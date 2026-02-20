import { API_ENDPOINTS } from '../config/api.config';

export type MaintenanceCategory =
  | 'APPLIANCES'
  | 'ELECTRICAL'
  | 'EXTERIOR'
  | 'HOUSEHOLD'
  | 'OUTDOORS'
  | 'PLUMBING';

export type MaintenancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type UploadCategory = 'IMAGE' | 'VIDEO' | 'DOCUMENT';

export type FileType = 'PDF' | 'DOC' | 'DOCX' | 'XLS' | 'XLSX' | 'IMAGE' | 'OTHER';

export interface MaintenanceTenantMeta {
  tenantAuthorization?: boolean;
  accessCode?: string;
  petsInResidence?: string;
  selectedPets?: string[];
  dateOptions?: Array<{ date?: string; timeSlots?: string[] }>;
}

export interface CreateMaintenanceMaterialInput {
  materialName: string;
  quantity?: number;
  unit?: string;
  description?: string;
}

export type ChargeTo = 'LANDLORD' | 'TENANT' | 'PENDING';

export interface CreateMaintenanceAttachmentInput {
  fileUrl: string;
  fileType: FileType;
}

export interface CreateMaintenanceRequestInput {
  propertyId: string;
  unitId?: string;
  category: MaintenanceCategory;
  subcategory: string;
  issue?: string;
  subissue?: string;
  title: string;
  problemDetails?: string;
  priority?: MaintenancePriority;
  dueDate?: string;
  equipmentLinked?: boolean;
  equipmentId?: string;
  tenantMeta?: MaintenanceTenantMeta;
  materials?: CreateMaintenanceMaterialInput[];
  chargeTo?: ChargeTo;
  attachments?: CreateMaintenanceAttachmentInput[];
}

export interface MaintenanceRequestResponse {
  id: string;
}

export interface MaintenanceRequestDetail {
  id: string;
  property?: {
    id: string;
    propertyName?: string;
  };
  category?: MaintenanceCategory;
  subcategory?: string;
  issue?: string;
  subissue?: string;
  title?: string;
  problemDetails?: string;
  priority?: MaintenancePriority;
  requestedAt?: string;
  dueDate?: string;
  equipmentLinked?: boolean;
  equipmentId?: string | null;
  tenantMeta?: MaintenanceTenantMeta;
  materials?: CreateMaintenanceMaterialInput[];
  attachments?: Array<{
    id: string;
    fileUrl: string;
    fileType?: FileType;
    description?: string | null;
  }>;
  photos?: Array<{
    id: string;
    fileUrl: string;
    description?: string | null;
  }>;
}

export interface MaintenanceRequestTransaction {
  id: string;
  amount: number;
  type: string;
  currency?: string;
  transactionDate?: string;
  details?: string | null;
  notes?: string | null;
}

export interface MaintenanceRequestApplicant {
  id: string;
  serviceProviderId: string;
  quotedAmount: number;
  quotedAt: string;
  serviceProvider: {
    id: string;
    companyName: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

class MaintenanceRequestService {
  async getAll(): Promise<unknown[]> {
    const response = await fetch(API_ENDPOINTS.MAINTENANCE_REQUEST.GET_ALL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to fetch maintenance requests';
      throw new Error(message);
    }

    return response.json();
  }

  async create(input: CreateMaintenanceRequestInput): Promise<MaintenanceRequestResponse> {
    const response = await fetch(API_ENDPOINTS.MAINTENANCE_REQUEST.CREATE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to create maintenance request';
      throw new Error(message);
    }

    return response.json();
  }

  async update(id: string, input: Partial<CreateMaintenanceRequestInput>): Promise<MaintenanceRequestDetail> {
    const response = await fetch(API_ENDPOINTS.MAINTENANCE_REQUEST.UPDATE(id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to update maintenance request';
      throw new Error(message);
    }

    return response.json();
  }

  async getOne(id: string): Promise<MaintenanceRequestDetail> {
    const response = await fetch(API_ENDPOINTS.MAINTENANCE_REQUEST.GET_ONE(id), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to fetch maintenance request';
      throw new Error(message);
    }

    return response.json();
  }

  async listTransactions(id: string): Promise<MaintenanceRequestTransaction[]> {
    const response = await fetch(API_ENDPOINTS.MAINTENANCE_REQUEST.LIST_TRANSACTIONS(id), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to fetch maintenance request transactions';
      throw new Error(message);
    }

    return response.json();
  }

  async uploadFile(params: {
    file: File;
    category: UploadCategory;
    propertyId?: string;
    maintenanceRequestId?: string;
    description?: string;
  }): Promise<{ url: string; key: string }> {
    const form = new FormData();
    form.append('file', params.file);
    form.append('category', params.category);
    if (params.propertyId) form.append('propertyId', params.propertyId);
    if (params.maintenanceRequestId) form.append('maintenanceRequestId', params.maintenanceRequestId);
    if (params.description) form.append('description', params.description);

    const response = await fetch(API_ENDPOINTS.UPLOAD.FILE, {
      method: 'POST',
      credentials: 'include',
      body: form,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to upload file';
      throw new Error(message);
    }

    return response.json();
  }

  async assignInternal(
    requestId: string,
    assignedToUserId: string,
    options?: { scheduledDate?: string; notes?: string; quotedAmount?: number; quotedAmountCurrency?: string },
  ): Promise<unknown> {
    const response = await fetch(API_ENDPOINTS.MAINTENANCE_REQUEST.ASSIGN_INTERNAL(requestId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ assignedToUserId, ...options }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to assign internal team member';
      throw new Error(message);
    }

    return response.json();
  }

  async approveTenantCharge(id: string): Promise<MaintenanceRequestDetail> {
    const response = await fetch(API_ENDPOINTS.MAINTENANCE_REQUEST.APPROVE_TENANT_CHARGE(id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to approve tenant charge';
      throw new Error(message);
    }

    return response.json();
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.MAINTENANCE_REQUEST.DELETE(id), {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to delete maintenance request';
      throw new Error(message);
    }
  }

  async getApplicants(id: string): Promise<MaintenanceRequestApplicant[]> {
    const response = await fetch(API_ENDPOINTS.MAINTENANCE_REQUEST.GET_APPLICANTS(id), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to fetch applicants';
      throw new Error(message);
    }

    return response.json();
  }
}

export const maintenanceRequestService = new MaintenanceRequestService();

