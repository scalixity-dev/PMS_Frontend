import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  leadService, 
  type BackendLead, 
  type CreateLeadDto, 
  type UpdateLeadDto,
  type BackendNote,
  type CreateNoteDto,
  type UpdateNoteDto,
  type BackendTask,
  type CreateTaskDto,
  type UpdateTaskDto,
  type BackendActivity,
  type CreateActivityDto,
  type BackendCall,
  type CreateCallDto,
  type UpdateCallDto,
  type BackendMeeting,
  type CreateMeetingDto,
  type UpdateMeetingDto,
} from '../services/lead.service';

// Query keys for React Query
export const leadQueryKeys = {
  all: ['leads'] as const,
  lists: () => [...leadQueryKeys.all, 'list'] as const,
  list: (filters?: any) => [...leadQueryKeys.lists(), filters] as const,
  details: () => [...leadQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...leadQueryKeys.details(), id] as const,
  notes: (leadId: string) => [...leadQueryKeys.detail(leadId), 'notes'] as const,
  note: (leadId: string, noteId: string) => [...leadQueryKeys.notes(leadId), noteId] as const,
  tasks: (leadId: string) => [...leadQueryKeys.detail(leadId), 'tasks'] as const,
  task: (leadId: string, taskId: string) => [...leadQueryKeys.tasks(leadId), taskId] as const,
  activities: (leadId: string) => [...leadQueryKeys.detail(leadId), 'activities'] as const,
  activity: (leadId: string, activityId: string) => [...leadQueryKeys.activities(leadId), activityId] as const,
  calls: (leadId: string) => [...leadQueryKeys.detail(leadId), 'calls'] as const,
  call: (leadId: string, callId: string) => [...leadQueryKeys.calls(leadId), callId] as const,
  meetings: (leadId: string) => [...leadQueryKeys.detail(leadId), 'meetings'] as const,
  meeting: (leadId: string, meetingId: string) => [...leadQueryKeys.meetings(leadId), meetingId] as const,
};

/**
 * Hook to get all leads for the authenticated manager
 */
export const useGetAllLeads = (enabled: boolean = true) => {
  return useQuery({
    queryKey: leadQueryKeys.lists(),
    queryFn: () => leadService.getAll(),
    enabled,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to get a single lead by ID
 */
export const useGetLead = (leadId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: leadId ? leadQueryKeys.detail(leadId) : ['leads', 'detail', 'null'] as const,
    queryFn: () => leadService.getOne(leadId!),
    enabled: enabled && !!leadId,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to create a new lead
 */
export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leadData: CreateLeadDto): Promise<BackendLead> => {
      return leadService.create(leadData);
    },
    onSuccess: (data) => {
      // Invalidate and refetch leads list
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.lists() });
      // Cache the newly created lead
      queryClient.setQueryData(leadQueryKeys.detail(data.id), data);
    },
  });
};

/**
 * Hook to update a lead
 */
export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadDto }): Promise<BackendLead> => {
      return leadService.update(id, data);
    },
    onSuccess: (data) => {
      // Invalidate and refetch leads list
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.lists() });
      // Update the cached lead
      queryClient.setQueryData(leadQueryKeys.detail(data.id), data);
    },
  });
};

/**
 * Hook to delete a lead
 */
export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string): Promise<void> => {
      console.log('Deleting lead with ID:', id);
      return leadService.delete(id);
    },
    onSuccess: (_, deletedId) => {
      console.log('Lead deleted successfully, invalidating cache for ID:', deletedId);
      // Invalidate and refetch leads list - use refetchType to ensure immediate refetch
      queryClient.invalidateQueries({ 
        queryKey: leadQueryKeys.lists(),
        refetchType: 'active'
      });
      // Remove the deleted lead from cache
      queryClient.removeQueries({ queryKey: leadQueryKeys.detail(deletedId) });
    },
    onError: (error, deletedId) => {
      console.error('Error deleting lead:', deletedId, error);
    },
  });
};

// ========== Notes Hooks ==========

/**
 * Hook to get all notes for a lead
 */
export const useGetAllNotes = (leadId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: leadId ? leadQueryKeys.notes(leadId) : ['leads', 'notes', 'null'] as const,
    queryFn: () => leadService.getAllNotes(leadId!),
    enabled: enabled && !!leadId,
    staleTime: 1 * 60 * 1000, // Cache for 1 minute
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to get a single note
 */
export const useGetNote = (leadId: string | null | undefined, noteId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: leadId && noteId ? leadQueryKeys.note(leadId, noteId) : ['leads', 'note', 'null'] as const,
    queryFn: () => leadService.getNote(leadId!, noteId!),
    enabled: enabled && !!leadId && !!noteId,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to create a note
 */
export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, noteData }: { leadId: string; noteData: CreateNoteDto }): Promise<BackendNote> => {
      return leadService.createNote(leadId, noteData);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.notes(variables.leadId) });
      queryClient.setQueryData(leadQueryKeys.note(variables.leadId, data.id), data);
      // Also invalidate activities since notes create activities
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.activities(variables.leadId) });
    },
  });
};

/**
 * Hook to update a note
 */
export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, noteId, noteData }: { leadId: string; noteId: string; noteData: UpdateNoteDto }): Promise<BackendNote> => {
      return leadService.updateNote(leadId, noteId, noteData);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.notes(variables.leadId) });
      queryClient.setQueryData(leadQueryKeys.note(variables.leadId, data.id), data);
    },
  });
};

/**
 * Hook to delete a note
 */
export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, noteId }: { leadId: string; noteId: string }): Promise<void> => {
      return leadService.deleteNote(leadId, noteId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.notes(variables.leadId) });
      queryClient.removeQueries({ queryKey: leadQueryKeys.note(variables.leadId, variables.noteId) });
    },
  });
};

// ========== Tasks Hooks ==========

/**
 * Hook to get all tasks for a lead
 */
export const useGetAllTasks = (leadId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: leadId ? leadQueryKeys.tasks(leadId) : ['leads', 'tasks', 'null'] as const,
    queryFn: () => leadService.getAllTasks(leadId!),
    enabled: enabled && !!leadId,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to get a single task
 */
export const useGetTask = (leadId: string | null | undefined, taskId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: leadId && taskId ? leadQueryKeys.task(leadId, taskId) : ['leads', 'task', 'null'] as const,
    queryFn: () => leadService.getTask(leadId!, taskId!),
    enabled: enabled && !!leadId && !!taskId,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to create a task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, taskData }: { leadId: string; taskData: CreateTaskDto }): Promise<BackendTask> => {
      return leadService.createTask(leadId, taskData);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.tasks(variables.leadId) });
      queryClient.setQueryData(leadQueryKeys.task(variables.leadId, data.id), data);
      // Also invalidate activities since tasks create activities
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.activities(variables.leadId) });
    },
  });
};

/**
 * Hook to update a task
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, taskId, taskData }: { leadId: string; taskId: string; taskData: UpdateTaskDto }): Promise<BackendTask> => {
      return leadService.updateTask(leadId, taskId, taskData);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.tasks(variables.leadId) });
      queryClient.setQueryData(leadQueryKeys.task(variables.leadId, data.id), data);
    },
  });
};

/**
 * Hook to delete a task
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, taskId }: { leadId: string; taskId: string }): Promise<void> => {
      return leadService.deleteTask(leadId, taskId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.tasks(variables.leadId) });
      queryClient.removeQueries({ queryKey: leadQueryKeys.task(variables.leadId, variables.taskId) });
    },
  });
};

// ========== Activities Hooks ==========

/**
 * Hook to get all activities for a lead
 */
export const useGetAllActivities = (leadId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: leadId ? leadQueryKeys.activities(leadId) : ['leads', 'activities', 'null'] as const,
    queryFn: () => leadService.getAllActivities(leadId!),
    enabled: enabled && !!leadId,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to get a single activity
 */
export const useGetActivity = (leadId: string | null | undefined, activityId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: leadId && activityId ? leadQueryKeys.activity(leadId, activityId) : ['leads', 'activity', 'null'] as const,
    queryFn: () => leadService.getActivity(leadId!, activityId!),
    enabled: enabled && !!leadId && !!activityId,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to create an activity
 */
export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, activityData }: { leadId: string; activityData: CreateActivityDto }): Promise<BackendActivity> => {
      return leadService.createActivity(leadId, activityData);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.activities(variables.leadId) });
      queryClient.setQueryData(leadQueryKeys.activity(variables.leadId, data.id), data);
    },
  });
};

/**
 * Hook to delete an activity
 */
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, activityId }: { leadId: string; activityId: string }): Promise<void> => {
      return leadService.deleteActivity(leadId, activityId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.activities(variables.leadId) });
      queryClient.removeQueries({ queryKey: leadQueryKeys.activity(variables.leadId, variables.activityId) });
    },
  });
};

// ========== Calls Hooks ==========

/**
 * Hook to get all calls for a lead
 */
export const useGetAllCalls = (leadId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: leadId ? leadQueryKeys.calls(leadId) : ['leads', 'calls', 'null'] as const,
    queryFn: () => leadService.getAllCalls(leadId!),
    enabled: enabled && !!leadId,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to get a single call
 */
export const useGetCall = (leadId: string | null | undefined, callId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: leadId && callId ? leadQueryKeys.call(leadId, callId) : ['leads', 'call', 'null'] as const,
    queryFn: () => leadService.getCall(leadId!, callId!),
    enabled: enabled && !!leadId && !!callId,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to create a call
 */
export const useCreateCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, callData }: { leadId: string; callData: CreateCallDto }): Promise<BackendCall> => {
      return leadService.createCall(leadId, callData);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.calls(variables.leadId) });
      queryClient.setQueryData(leadQueryKeys.call(variables.leadId, data.id), data);
      // Also invalidate activities since calls might create activities
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.activities(variables.leadId) });
    },
  });
};

/**
 * Hook to update a call
 */
export const useUpdateCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, callId, callData }: { leadId: string; callId: string; callData: UpdateCallDto }): Promise<BackendCall> => {
      return leadService.updateCall(leadId, callId, callData);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.calls(variables.leadId) });
      queryClient.setQueryData(leadQueryKeys.call(variables.leadId, data.id), data);
    },
  });
};

/**
 * Hook to delete a call
 */
export const useDeleteCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, callId }: { leadId: string; callId: string }): Promise<void> => {
      return leadService.deleteCall(leadId, callId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.calls(variables.leadId) });
      queryClient.removeQueries({ queryKey: leadQueryKeys.call(variables.leadId, variables.callId) });
    },
  });
};

// ========== Meetings Hooks ==========

/**
 * Hook to get all meetings for a lead
 */
export const useGetAllMeetings = (leadId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: leadId ? leadQueryKeys.meetings(leadId) : ['leads', 'meetings', 'null'] as const,
    queryFn: () => leadService.getAllMeetings(leadId!),
    enabled: enabled && !!leadId,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to get a single meeting
 */
export const useGetMeeting = (leadId: string | null | undefined, meetingId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: leadId && meetingId ? leadQueryKeys.meeting(leadId, meetingId) : ['leads', 'meeting', 'null'] as const,
    queryFn: () => leadService.getMeeting(leadId!, meetingId!),
    enabled: enabled && !!leadId && !!meetingId,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to create a meeting
 */
export const useCreateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, meetingData }: { leadId: string; meetingData: CreateMeetingDto }): Promise<BackendMeeting> => {
      return leadService.createMeeting(leadId, meetingData);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.meetings(variables.leadId) });
      queryClient.setQueryData(leadQueryKeys.meeting(variables.leadId, data.id), data);
      // Also invalidate activities since meetings might create activities
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.activities(variables.leadId) });
    },
  });
};

/**
 * Hook to update a meeting
 */
export const useUpdateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, meetingId, meetingData }: { leadId: string; meetingId: string; meetingData: UpdateMeetingDto }): Promise<BackendMeeting> => {
      return leadService.updateMeeting(leadId, meetingId, meetingData);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.meetings(variables.leadId) });
      queryClient.setQueryData(leadQueryKeys.meeting(variables.leadId, data.id), data);
    },
  });
};

/**
 * Hook to delete a meeting
 */
export const useDeleteMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, meetingId }: { leadId: string; meetingId: string }): Promise<void> => {
      return leadService.deleteMeeting(leadId, meetingId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.meetings(variables.leadId) });
      queryClient.removeQueries({ queryKey: leadQueryKeys.meeting(variables.leadId, variables.meetingId) });
    },
  });
};

