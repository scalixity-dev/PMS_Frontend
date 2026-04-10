import { API_ENDPOINTS } from '../config/api.config';

export interface NotificationResponse {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  entityId?: string;
  entityType?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsListResponse {
  data: NotificationResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const notificationService = {
  /**
   * Get all notifications with pagination
   */
  async findAll(isRead?: boolean, page: number = 1, limit: number = 20): Promise<NotificationsListResponse> {
    const params = new URLSearchParams();
    if (isRead !== undefined) params.append('isRead', String(isRead));
    params.append('_page', String(page));
    params.append('_limit', String(limit));

    const response = await fetch(`${API_ENDPOINTS.NOTIFICATION.GET_ALL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<{ unreadCount: number }> {
    const response = await fetch(`${API_ENDPOINTS.NOTIFICATION.GET_ALL}/unread-count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch unread count: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get single notification
   */
  async findOne(id: string): Promise<NotificationResponse> {
    const response = await fetch(API_ENDPOINTS.NOTIFICATION.GET_ONE(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch notification: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<{ success: boolean }> {
    const response = await fetch(API_ENDPOINTS.NOTIFICATION.MARK_READ(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to mark notification as read: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ success: boolean }> {
    const response = await fetch(API_ENDPOINTS.NOTIFICATION.MARK_ALL_READ, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to mark all notifications as read: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Delete notification
   */
  async delete(id: string): Promise<{ success: boolean }> {
    const response = await fetch(API_ENDPOINTS.NOTIFICATION.DELETE(id), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete notification: ${response.statusText}`);
    }

    return response.json();
  },
};
