import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backgroundQuestionService } from '../services/background-question.service';

// Query keys for React Query
export const backgroundQuestionQueryKeys = {
  all: ['backgroundQuestions'] as const,
  list: () => [...backgroundQuestionQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...backgroundQuestionQueryKeys.all, id] as const,
};

/**
 * Hook to get all background questions for the current manager
 */
export const useGetBackgroundQuestions = (enabled: boolean = true) => {
  return useQuery({
    queryKey: backgroundQuestionQueryKeys.list(),
    queryFn: () => backgroundQuestionService.findAll(),
    enabled: enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to create a new background question
 */
export const useCreateBackgroundQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { question: string; order?: number; flagOnYes?: boolean; requiresExplanationOnYes?: boolean }) =>
      backgroundQuestionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: backgroundQuestionQueryKeys.list() });
    },
  });
};

/**
 * Hook to update a background question
 */
export const useUpdateBackgroundQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { question?: string; order?: number; isActive?: boolean; flagOnYes?: boolean; requiresExplanationOnYes?: boolean } }) =>
      backgroundQuestionService.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: backgroundQuestionQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: backgroundQuestionQueryKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to delete a background question
 */
export const useDeleteBackgroundQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => backgroundQuestionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: backgroundQuestionQueryKeys.list() });
    },
  });
};

/**
 * Hook to reorder background questions
 */
export const useReorderBackgroundQuestions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questions: { id: string; order: number }[]) =>
      backgroundQuestionService.reorder(questions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: backgroundQuestionQueryKeys.list() });
    },
  });
};
