import * as XLSX from "xlsx";
import { API_ENDPOINTS } from "../config/api.config";

const IMAGE_KEY_RX = /(photo|image|avatar|thumbnail|cover|banner|youtube)/i;

type EntitySpec = { sheet: string; url: string };

const ENTITIES: EntitySpec[] = [
  { sheet: "Profile", url: API_ENDPOINTS.AUTH.GET_CURRENT_USER },
  { sheet: "Properties", url: `${API_ENDPOINTS.PROPERTY.GET_ALL}?_limit=10000` },
  { sheet: "Units", url: API_ENDPOINTS.PROPERTY.GET_ALL_UNITS },
  { sheet: "Listings", url: `${API_ENDPOINTS.LISTING.GET_ALL}?_limit=10000` },
  { sheet: "Leasings", url: API_ENDPOINTS.LEASING.GET_ALL },
  { sheet: "Leases", url: `${API_ENDPOINTS.LEASE.GET_ALL}?_limit=10000` },
  { sheet: "Tenants", url: `${API_ENDPOINTS.TENANT.GET_ALL}?_limit=10000` },
  { sheet: "Applications", url: `${API_ENDPOINTS.APPLICATION.GET_ALL}?_limit=10000` },
  { sheet: "Leads", url: `${API_ENDPOINTS.LEAD.GET_ALL}?_limit=10000` },
  { sheet: "Transactions", url: `${API_ENDPOINTS.TRANSACTION.GET_ALL}?_limit=10000` },
  { sheet: "Payments", url: API_ENDPOINTS.TRANSACTION.GET_PAYMENTS },
  { sheet: "Maintenance", url: `${API_ENDPOINTS.MAINTENANCE_REQUEST.GET_ALL}?_limit=10000` },
  { sheet: "Keys", url: API_ENDPOINTS.KEYS.GET_ALL },
  { sheet: "Equipment", url: API_ENDPOINTS.EQUIPMENT.GET_ALL },
  { sheet: "Tasks", url: API_ENDPOINTS.TASK.GET_ALL },
  { sheet: "Reminders", url: API_ENDPOINTS.REMINDER.GET_ALL },
  { sheet: "Contacts", url: API_ENDPOINTS.CONTACT_BOOK.GET_ALL },
  { sheet: "Team", url: API_ENDPOINTS.TEAM.GET_ALL },
  { sheet: "Notifications", url: API_ENDPOINTS.NOTIFICATION.GET_ALL },
];

const unwrap = (raw: any): any[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.data)) return raw.data;
  if (Array.isArray(raw.items)) return raw.items;
  if (Array.isArray(raw.results)) return raw.results;
  if (typeof raw === "object") return [raw];
  return [];
};

const sanitize = (obj: any, depth = 0): any => {
  if (obj == null) return obj;
  if (depth > 4) return "[deep]";
  if (Array.isArray(obj)) return obj.map((v) => sanitize(v, depth + 1));
  if (typeof obj !== "object") return obj;
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (IMAGE_KEY_RX.test(k)) continue;
    if (k === "photos") continue;
    out[k] = sanitize(v, depth + 1);
  }
  return out;
};

const flatten = (obj: any, prefix = "", out: Record<string, any> = {}): Record<string, any> => {
  if (obj == null) return out;
  if (typeof obj !== "object" || Array.isArray(obj)) {
    out[prefix || "value"] = Array.isArray(obj) ? JSON.stringify(obj) : obj;
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      flatten(v, key, out);
    } else if (Array.isArray(v)) {
      out[key] = JSON.stringify(v);
    } else {
      out[key] = v as any;
    }
  }
  return out;
};

const fetchEntity = async (url: string): Promise<any[]> => {
  try {
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) return [];
    const json = await res.json();
    return unwrap(json);
  } catch {
    return [];
  }
};

export const exportUserData = async (): Promise<void> => {
  const results = await Promise.all(ENTITIES.map((e) => fetchEntity(e.url)));

  const wb = XLSX.utils.book_new();
  let hasAny = false;

  ENTITIES.forEach((spec, idx) => {
    const rows = results[idx];
    const cleaned = rows.map((r) => flatten(sanitize(r)));
    const sheetData = cleaned.length > 0 ? cleaned : [{ note: "No data" }];
    const ws = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, spec.sheet.slice(0, 31));
    if (cleaned.length > 0) hasAny = true;
  });

  if (!hasAny) {
    throw new Error("No data to export");
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  XLSX.writeFile(wb, `smarttenant-export-${timestamp}.xlsx`);
};
