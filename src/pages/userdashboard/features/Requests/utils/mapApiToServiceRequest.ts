import type { ServiceRequest } from "../../../utils/types";

type ApiMaintenanceRequest = {
  id: string;
  status?: string;
  category?: string;
  subcategory?: string;
  issue?: string;
  subissue?: string;
  title?: string;
  problemDetails?: string;
  priority?: string;
  requestedAt?: string;
  dueDate?: string | null;
  property?: { propertyName?: string; address?: { streetAddress?: string; city?: string } };
  assignments?: Array<{
    serviceProvider?: { companyName?: string; firstName?: string; lastName?: string };
    assignedToUser?: { fullName?: string };
  }>;
  chargeTo?: string;
  tenantChargeApprovedAt?: string | null;
};

const STATUS_MAP: Record<string, ServiceRequest["status"]> = {
  NEW: "New",
  IN_REVIEW: "In Progress",
  ASSIGNED: "In Progress",
  VENDOR_NOTIFIED: "In Progress",
  IN_PROGRESS: "In Progress",
  ON_HOLD: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const PRIORITY_MAP: Record<string, ServiceRequest["priority"]> = {
  LOW: "Low",
  MEDIUM: "Normal",
  HIGH: "Critical",
  URGENT: "Critical",
};

const CATEGORY_DISPLAY: Record<string, string> = {
  APPLIANCES: "Appliances",
  ELECTRICAL: "Electrical",
  EXTERIOR: "Exterior",
  HOUSEHOLD: "Households",
  OUTDOORS: "Outdoors",
  PLUMBING: "Plumbing",
};

export function mapApiToServiceRequest(api: ApiMaintenanceRequest): ServiceRequest {
  const assignee =
    api.assignments?.[0]?.serviceProvider?.companyName ??
    (api.assignments?.[0]?.serviceProvider
      ? `${api.assignments[0].serviceProvider.firstName ?? ""} ${api.assignments[0].serviceProvider.lastName ?? ""}`.trim()
      : null) ??
    api.assignments?.[0]?.assignedToUser?.fullName ??
    "Not Assigned";

  const propertyName =
    api.property?.propertyName ?? "Property";

  return {
    id: api.id as string,
    requestId: api.id,
    status: STATUS_MAP[api.status ?? ""] ?? "New",
    title: api.title,
    category: CATEGORY_DISPLAY[api.category ?? ""] ?? api.category ?? "General",
    subCategory: api.subcategory,
    problem: api.issue,
    subIssue: api.subissue,
    description: api.problemDetails,
    property: propertyName,
    priority: PRIORITY_MAP[api.priority ?? ""] ?? "Normal",
    assignee: assignee || "Not Assigned",
    createdAt: api.requestedAt ?? new Date().toISOString(),
    dateDue: api.dueDate ?? null,
    chargeTo: api.chargeTo,
    tenantChargeApprovedAt: api.tenantChargeApprovedAt,
  };
}

type ApiDetail = ApiMaintenanceRequest & {
  attachments?: Array<{ fileUrl: string; fileType?: string }>;
  photos?: Array<{ photoUrl?: string; videoUrl?: string }>;
  materials?: Array<{ materialName?: string; quantity?: number }>;
  equipment?: { id?: string } | null;
};

export function mapApiDetailToServiceRequest(api: ApiDetail): ServiceRequest & { attachments?: (File | string)[]; video?: File | string | null } {
  const base = mapApiToServiceRequest(api);
  const attachmentUrls: string[] = [];
  let videoUrl: string | null = null;
  if (api.attachments?.length) {
    for (const a of api.attachments) {
      const isVideo = a.fileType === "VIDEO" || a.fileUrl?.toLowerCase().includes(".mp4") || a.fileUrl?.toLowerCase().includes("video");
      if (isVideo) videoUrl = a.fileUrl;
      else attachmentUrls.push(a.fileUrl);
    }
  }
  if (api.photos?.length) {
    for (const p of api.photos) {
      if (p.videoUrl) videoUrl = p.videoUrl;
      else if (p.photoUrl) attachmentUrls.push(p.photoUrl);
    }
  }
  const materials = api.materials?.map((m, i) => ({
    id: String(i),
    name: m.materialName ?? "",
    quantity: m.quantity ?? 1,
  }));
  return {
    ...base,
    attachments: attachmentUrls.length ? attachmentUrls : undefined,
    video: videoUrl,
    materials,
  };
}
