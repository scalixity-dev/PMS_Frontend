import { API_ENDPOINTS } from '../config/api.config';

export interface DemoRequestPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  numberOfUnits: string;
}

export const demoRequestService = {
  async submit(data: DemoRequestPayload): Promise<void> {
    const response = await fetch(API_ENDPOINTS.DEMO_REQUESTS.CREATE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to send your demo request. Please try again.';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // ignore parse errors, use default message
      }
      throw new Error(errorMessage);
    }
  },
};
