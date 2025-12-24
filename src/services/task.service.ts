import { API_ENDPOINTS } from '../config/api.config';

export interface Task {
  id: string;
  title: string;
  description: string;
  name: string;
  avatar: string;
  date: string;
  time?: string;
  status: string;
  property: string;
  frequency: string;
  isRecurring: boolean;
  endDate?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  date: string;
  time: string;
  assignee?: string;
  propertyId?: string;
  isRecurring?: boolean;
  frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'ONCE';
  endDate?: string;
  status?: 'OPEN' | 'IN_PROGRESS' | 'ON_HOLD' | 'RESOLVED' | 'COMPLETED' | 'CANCELLED';
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {}

export interface TaskFilters {
  status?: string[];
  propertyId?: string[];
  date?: 'today' | 'week';
  frequency?: string[];
}

class TaskService {
  async getAll(filters?: TaskFilters): Promise<Task[]> {
    const queryParams = new URLSearchParams();
    
    if (filters?.status && filters.status.length > 0) {
      queryParams.append('status', filters.status.join(','));
    }
    if (filters?.propertyId && filters.propertyId.length > 0) {
      queryParams.append('propertyId', filters.propertyId.join(','));
    }
    if (filters?.date) {
      queryParams.append('date', filters.date);
    }
    if (filters?.frequency && filters.frequency.length > 0) {
      queryParams.append('frequency', filters.frequency.join(','));
    }

    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.TASK.GET_ALL}?${queryParams.toString()}`
      : API_ENDPOINTS.TASK.GET_ALL;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch tasks';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to fetch tasks: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getOne(id: string): Promise<Task> {
    const response = await fetch(API_ENDPOINTS.TASK.GET_ONE(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch task';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to fetch task: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const response = await fetch(API_ENDPOINTS.TASK.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(createTaskDto),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create task';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to create task: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const response = await fetch(API_ENDPOINTS.TASK.UPDATE(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateTaskDto),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update task';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to update task: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async delete(id: string): Promise<{ message: string }> {
    const response = await fetch(API_ENDPOINTS.TASK.DELETE(id), {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete task';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to delete task: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // Read and return the response body
    return response.json();
  }
}

export const taskService = new TaskService();

