import { API_ENDPOINTS } from '../config/api.config';

export type SettingsSection =
  | 'account_security'
  | 'accounting_invoice'
  | 'accounting_quickbook'
  | 'accounting_tags'
  | 'subscription_my_card'
  | 'request_settings'
  | 'request_automation'
  | 'rental_online_application'
  | 'rental_form_configuration'
  | 'rental_terms_signature'
  | 'team_roles_permissions'
  | 'team_property_permissions'
  | 'reports_general';

export interface UserSettingsResponse<T = Record<string, unknown>> {
  section: SettingsSection;
  values: T;
}

export interface SecuritySession {
  id: string;
  location: string;
  device: string;
  ipAddress: string;
  lastActivity: string;
}

export const settingsService = {
  async getSection<T = Record<string, unknown>>(section: SettingsSection): Promise<UserSettingsResponse<T>> {
    const response = await fetch(API_ENDPOINTS.SETTINGS.GET_SECTION(section), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch settings (${section}): ${response.statusText}`);
    }

    return response.json();
  },

  async updateSection<T = Record<string, unknown>>(
    section: SettingsSection,
    values: Record<string, unknown>,
  ): Promise<UserSettingsResponse<T>> {
    const response = await fetch(API_ENDPOINTS.SETTINGS.UPDATE_SECTION(section), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ values }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update settings (${section}): ${response.statusText}`);
    }

    return response.json();
  },

  async getSecuritySessions(): Promise<{ sessions: SecuritySession[] }> {
    const response = await fetch(API_ENDPOINTS.SETTINGS.SECURITY_SESSIONS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch security sessions: ${response.statusText}`);
    }

    return response.json();
  },
};
