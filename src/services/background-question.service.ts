import { API_ENDPOINTS } from '../config/api.config';

export const backgroundQuestionService = {
  /**
   * Get all background questions for the current manager
   */
  async findAll(): Promise<any[]> {
    const response = await fetch(API_ENDPOINTS.BACKGROUND_QUESTIONS.GET_ALL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch background questions: ${response.statusText}`);
    }

    const data = await response.json();
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray(data.data)) return data.data;
    return [];
  },

  /**
   * Get a single background question
   */
  async findOne(id: string): Promise<any> {
    const response = await fetch(API_ENDPOINTS.BACKGROUND_QUESTIONS.GET_ONE(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch background question: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Create a new background question
   */
  async create(data: { question: string; order?: number; flagOnYes?: boolean; requiresExplanationOnYes?: boolean }): Promise<any> {
    const response = await fetch(API_ENDPOINTS.BACKGROUND_QUESTIONS.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create background question: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Update a background question
   */
  async update(id: string, data: { question?: string; order?: number; isActive?: boolean; flagOnYes?: boolean; requiresExplanationOnYes?: boolean }): Promise<any> {
    const response = await fetch(API_ENDPOINTS.BACKGROUND_QUESTIONS.UPDATE(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update background question: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Delete a background question
   */
  async delete(id: string): Promise<any> {
    const response = await fetch(API_ENDPOINTS.BACKGROUND_QUESTIONS.DELETE(id), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete background question: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Reorder background questions
   */
  async reorder(questions: { id: string; order: number }[]): Promise<any> {
    const response = await fetch(API_ENDPOINTS.BACKGROUND_QUESTIONS.REORDER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ questions }),
    });

    if (!response.ok) {
      throw new Error(`Failed to reorder background questions: ${response.statusText}`);
    }

    return response.json();
  },
};
