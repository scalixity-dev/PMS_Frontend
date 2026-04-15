import { API_ENDPOINTS } from '../config/api.config';

export interface TemplateVariable {
  key: string;
  label: string;
  required: boolean;
  type: string;
}

export interface DocumentTemplate {
  id: string;
  userId: string | null;
  category: string;
  title: string;
  description: string | null;
  content: string;
  variables: TemplateVariable[] | null;
  isSystem: boolean;
  isPublished: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RenderedDocument {
  id: string;
  userId: string;
  templateId: string | null;
  title: string;
  content: string;
  values: Record<string, string> | null;
  propertyId: string | null;
  tenantId: string | null;
  leaseId: string | null;
  url: string | null;
  createdAt: string;
}

export interface CreateTemplateDto {
  title: string;
  content: string;
  description?: string;
  variables?: TemplateVariable[];
}

export interface UpdateTemplateDto {
  title?: string;
  content?: string;
  description?: string;
  variables?: TemplateVariable[];
  isPublished?: boolean;
}

export interface RenderTemplateDto {
  values: Record<string, string>;
  propertyId?: string;
  tenantId?: string;
  leaseId?: string;
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

  return response.json() as Promise<T>;
}

export const documentsService = {
  // ─── Templates ───────────────────────────────────────────────────────────

  listTemplates(params?: { category?: string; includeSystem?: boolean }): Promise<DocumentTemplate[]> {
    const url = new URL(API_ENDPOINTS.DOCUMENTS.LIST_TEMPLATES);
    if (params?.category) url.searchParams.set('category', params.category);
    if (params?.includeSystem === false) url.searchParams.set('includeSystem', 'false');
    return request<DocumentTemplate[]>(url.toString());
  },

  getTemplate(id: string): Promise<DocumentTemplate> {
    return request<DocumentTemplate>(API_ENDPOINTS.DOCUMENTS.GET_TEMPLATE(id));
  },

  createTemplate(dto: CreateTemplateDto): Promise<DocumentTemplate> {
    return request<DocumentTemplate>(API_ENDPOINTS.DOCUMENTS.CREATE_TEMPLATE, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  updateTemplate(id: string, dto: UpdateTemplateDto): Promise<DocumentTemplate> {
    return request<DocumentTemplate>(API_ENDPOINTS.DOCUMENTS.UPDATE_TEMPLATE(id), {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  },

  deleteTemplate(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(API_ENDPOINTS.DOCUMENTS.DELETE_TEMPLATE(id), {
      method: 'DELETE',
    });
  },

  renderTemplate(id: string, dto: RenderTemplateDto): Promise<RenderedDocument> {
    return request<RenderedDocument>(API_ENDPOINTS.DOCUMENTS.RENDER_TEMPLATE(id), {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  // ─── Rendered Documents ──────────────────────────────────────────────────

  listRendered(): Promise<RenderedDocument[]> {
    return request<RenderedDocument[]>(API_ENDPOINTS.DOCUMENTS.LIST_RENDERED);
  },

  getRendered(id: string): Promise<RenderedDocument> {
    return request<RenderedDocument>(API_ENDPOINTS.DOCUMENTS.GET_RENDERED(id));
  },

  deleteRendered(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(API_ENDPOINTS.DOCUMENTS.DELETE_RENDERED(id), {
      method: 'DELETE',
    });
  },
};
