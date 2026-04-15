import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { filesService } from '../services/files.service';
import type { CreateFolderDto, CreateFileDto } from '../services/files.service';

export const filesQueryKeys = {
  all: ['files'] as const,
  folders: (parentId?: string) => ['files', 'folders', parentId] as const,
  filesList: (folderId?: string) => ['files', 'list', folderId] as const,
};

// ─── Folders ────────────────────────────────────────────────────────────────

export const useGetFolders = (parentId?: string) => {
  return useQuery({
    queryKey: filesQueryKeys.folders(parentId),
    queryFn: () => filesService.listFolders(parentId),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateFolderDto) => filesService.createFolder(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', 'folders'] });
    },
  });
};

export const useRenameFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      filesService.renameFolder(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', 'folders'] });
    },
  });
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => filesService.deleteFolder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', 'folders'] });
      queryClient.invalidateQueries({ queryKey: ['files', 'list'] });
    },
  });
};

// ─── Files ──────────────────────────────────────────────────────────────────

export const useGetFiles = (folderId?: string) => {
  return useQuery({
    queryKey: filesQueryKeys.filesList(folderId),
    queryFn: () => filesService.listFiles(folderId),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateFileDto) => filesService.uploadFile(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', 'list'] });
    },
  });
};

export const useRenameFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      filesService.renameFile(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', 'list'] });
    },
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => filesService.deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', 'list'] });
    },
  });
};
