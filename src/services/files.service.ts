import { API_ENDPOINTS } from '../config/api.config';

export interface FileFolder {
  id: string;
  userId: string;
  parentId: string | null;
  name: string;
  propertyId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FileRecord {
  id: string;
  userId: string;
  folderId: string | null;
  name: string;
  originalName: string;
  url: string;
  mimeType: string | null;
  sizeBytes: number | null;
  propertyId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFolderDto {
  name: string;
  parentId?: string;
  propertyId?: string;
}

export interface CreateFileDto {
  url: string;
  name: string;
  originalName: string;
  mimeType?: string;
  sizeBytes?: number;
  folderId?: string;
  propertyId?: string;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...init,
  });

  if (!response.ok) {
    let errorMessage = `Request failed: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (Array.isArray(errorData.message)) {
        errorMessage = errorData.message.join('. ');
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // ignore parse error
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

class FilesService {
  // ─── Folders ──────────────────────────────────────────────────────────────

  async listFolders(parentId?: string): Promise<FileFolder[]> {
    const params = parentId !== undefined ? `?parentId=${encodeURIComponent(parentId)}` : '';
    return request<FileFolder[]>(`${API_ENDPOINTS.FILES.LIST_FOLDERS}${params}`);
  }

  async createFolder(dto: CreateFolderDto): Promise<FileFolder> {
    return request<FileFolder>(API_ENDPOINTS.FILES.CREATE_FOLDER, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  async renameFolder(id: string, name: string): Promise<FileFolder> {
    return request<FileFolder>(API_ENDPOINTS.FILES.RENAME_FOLDER(id), {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    });
  }

  async deleteFolder(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(API_ENDPOINTS.FILES.DELETE_FOLDER(id), {
      method: 'DELETE',
    });
  }

  // ─── Files ────────────────────────────────────────────────────────────────

  async listFiles(folderId?: string): Promise<FileRecord[]> {
    const params = folderId !== undefined ? `?folderId=${encodeURIComponent(folderId)}` : '';
    return request<FileRecord[]>(`${API_ENDPOINTS.FILES.LIST_FILES}${params}`);
  }

  async uploadFile(dto: CreateFileDto): Promise<FileRecord> {
    return request<FileRecord>(API_ENDPOINTS.FILES.UPLOAD, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  async renameFile(id: string, name: string): Promise<FileRecord> {
    return request<FileRecord>(API_ENDPOINTS.FILES.RENAME_FILE(id), {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    });
  }

  async deleteFile(id: string): Promise<{ message: string; url: string }> {
    return request<{ message: string; url: string }>(API_ENDPOINTS.FILES.DELETE_FILE(id), {
      method: 'DELETE',
    });
  }
}

export const filesService = new FilesService();
