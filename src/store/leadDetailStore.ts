import { create } from 'zustand';
import type {
  BackendNote,
  BackendTask,
  BackendActivity,
  BackendCall,
  BackendMeeting,
} from '../services/lead.service';

interface LeadDetailState {
  leadId: string | null;
  notes: BackendNote[];
  tasks: BackendTask[];
  activities: BackendActivity[];
  calls: BackendCall[];
  meetings: BackendMeeting[];

  setLeadId: (id: string | null) => void;
  setNotes: (notes: BackendNote[]) => void;
  setTasks: (tasks: BackendTask[]) => void;
  setActivities: (activities: BackendActivity[]) => void;
  setCalls: (calls: BackendCall[]) => void;
  setMeetings: (meetings: BackendMeeting[]) => void;

  addNote: (note: BackendNote) => void;
  updateNote: (noteId: string, note: BackendNote) => void;
  removeNote: (noteId: string) => void;

  addTask: (task: BackendTask) => void;
  updateTask: (taskId: string, task: BackendTask) => void;
  removeTask: (taskId: string) => void;

  addActivity: (activity: BackendActivity) => void;
  removeActivity: (activityId: string) => void;

  addCall: (call: BackendCall) => void;
  updateCall: (callId: string, call: BackendCall) => void;
  removeCall: (callId: string) => void;

  addMeeting: (meeting: BackendMeeting) => void;
  updateMeeting: (meetingId: string, meeting: BackendMeeting) => void;
  removeMeeting: (meetingId: string) => void;

  reset: () => void;
}

const initialState = {
  leadId: null as string | null,
  notes: [] as BackendNote[],
  tasks: [] as BackendTask[],
  activities: [] as BackendActivity[],
  calls: [] as BackendCall[],
  meetings: [] as BackendMeeting[],
};

export const useLeadDetailStore = create<LeadDetailState>((set) => ({
  ...initialState,

  setLeadId: (id) => set({ leadId: id }),
  setNotes: (notes) => set({ notes }),
  setTasks: (tasks) => set({ tasks }),
  setActivities: (activities) => set({ activities }),
  setCalls: (calls) => set({ calls }),
  setMeetings: (meetings) => set({ meetings }),

  addNote: (note) => set((s) => ({ notes: [note, ...s.notes] })),
  updateNote: (noteId, note) => set((s) => ({ notes: s.notes.map((n) => n.id === noteId ? note : n) })),
  removeNote: (noteId) => set((s) => ({ notes: s.notes.filter((n) => n.id !== noteId) })),

  addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
  updateTask: (taskId, task) => set((s) => ({ tasks: s.tasks.map((t) => t.id === taskId ? task : t) })),
  removeTask: (taskId) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== taskId) })),

  addActivity: (activity) => set((s) => ({ activities: [activity, ...s.activities] })),
  removeActivity: (activityId) => set((s) => ({ activities: s.activities.filter((a) => a.id !== activityId) })),

  addCall: (call) => set((s) => ({ calls: [call, ...s.calls] })),
  updateCall: (callId, call) => set((s) => ({ calls: s.calls.map((c) => c.id === callId ? call : c) })),
  removeCall: (callId) => set((s) => ({ calls: s.calls.filter((c) => c.id !== callId) })),

  addMeeting: (meeting) => set((s) => ({ meetings: [meeting, ...s.meetings] })),
  updateMeeting: (meetingId, meeting) => set((s) => ({ meetings: s.meetings.map((m) => m.id === meetingId ? meeting : m) })),
  removeMeeting: (meetingId) => set((s) => ({ meetings: s.meetings.filter((m) => m.id !== meetingId) })),

  reset: () => set(initialState),
}));
