import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsService } from '../services/documents.service';
import type { CreateTemplateDto, UpdateTemplateDto, RenderTemplateDto } from '../services/documents.service';

export const documentsQueryKeys = {
  all: ['documents'] as const,
  templates: (params?: { category?: string; includeSystem?: boolean }) =>
    ['documents', 'templates', params] as const,
  template: (id: string) => ['documents', 'templates', id] as const,
  rendered: () => ['documents', 'rendered'] as const,
  renderedOne: (id: string) => ['documents', 'rendered', id] as const,
  signatureStatus: (id: string) => ['documents', 'rendered', id, 'signature-status'] as const,
};

const NON_TERMINAL_SIGNATURE_STATUSES = new Set([null, 'CREATED', 'SENT', 'DELIVERED']);

// ─── Templates ──────────────────────────────────────────────────────────────

export const useGetTemplates = (params?: { category?: string; includeSystem?: boolean }) => {
  return useQuery({
    queryKey: documentsQueryKeys.templates(params),
    queryFn: () => documentsService.listTemplates(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useGetTemplate = (id: string) => {
  return useQuery({
    queryKey: documentsQueryKeys.template(id),
    queryFn: () => documentsService.getTemplate(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateTemplateDto) => documentsService.createTemplate(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', 'templates'] });
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTemplateDto }) =>
      documentsService.updateTemplate(id, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', 'templates'] });
      queryClient.invalidateQueries({ queryKey: documentsQueryKeys.template(variables.id) });
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsService.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', 'templates'] });
    },
  });
};

export const useRenderTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: RenderTemplateDto }) =>
      documentsService.renderTemplate(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsQueryKeys.rendered() });
    },
  });
};

// ─── Rendered Documents ──────────────────────────────────────────────────────

export const useGetRenderedDocuments = () => {
  return useQuery({
    queryKey: documentsQueryKeys.rendered(),
    queryFn: () => documentsService.listRendered(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useGetRenderedDocument = (id: string) => {
  return useQuery({
    queryKey: documentsQueryKeys.renderedOne(id),
    queryFn: () => documentsService.getRendered(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useDeleteRenderedDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsService.deleteRendered(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsQueryKeys.rendered() });
    },
  });
};

// ─── Signature (DocuSign) ─────────────────────────────────────────────────

export const useSendForSignature = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (renderedDocumentId: string) => documentsService.sendForSignature(renderedDocumentId),
    onSuccess: (_data, renderedDocumentId) => {
      queryClient.invalidateQueries({ queryKey: documentsQueryKeys.signatureStatus(renderedDocumentId) });
    },
  });
};

export const useSendToTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (renderedDocumentId: string) => documentsService.sendToTenant(renderedDocumentId),
    onSuccess: (_data, renderedDocumentId) => {
      queryClient.invalidateQueries({ queryKey: documentsQueryKeys.signatureStatus(renderedDocumentId) });
      queryClient.invalidateQueries({ queryKey: documentsQueryKeys.renderedOne(renderedDocumentId) });
      queryClient.invalidateQueries({ queryKey: documentsQueryKeys.rendered() });
    },
  });
};

export const useGetSigningUrl = () => {
  return useMutation({
    mutationFn: ({ renderedDocumentId, returnUrl }: { renderedDocumentId: string; returnUrl: string }) =>
      documentsService.getSigningUrl(renderedDocumentId, returnUrl),
  });
};

export const useGetSignatureStatus = (renderedDocumentId: string) => {
  return useQuery({
    queryKey: documentsQueryKeys.signatureStatus(renderedDocumentId),
    queryFn: () => documentsService.getSignatureStatus(renderedDocumentId),
    enabled: !!renderedDocumentId,
    staleTime: 15 * 1000,
    gcTime: 2 * 60 * 1000,
    retry: 1,
    refetchInterval: (query) => {
      const data = query.state.data as { status: string | null; completedAt?: string | null } | undefined;
      const status = data?.status ?? null;
      if (NON_TERMINAL_SIGNATURE_STATUSES.has(status)) return 10 * 1000;
      // Just reached COMPLETED — the fully-signed PDF is fetched from DocuSign
      // and uploaded to S3 asynchronously in the background, a few seconds
      // behind the status flip. Keep polling briefly to pick up the final
      // signedDocumentUrl once it lands, instead of freezing on the
      // landlord-only version that was there before the tenant signed.
      if (status === 'COMPLETED' && data?.completedAt) {
        const completedAgo = Date.now() - new Date(data.completedAt).getTime();
        if (completedAgo < 30 * 1000) return 3 * 1000;
      }
      return false;
    },
  });
};
