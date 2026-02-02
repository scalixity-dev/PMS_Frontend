import { API_ENDPOINTS } from '../config/api.config';

export interface Contact {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  contactType: string;
}

export async function getContacts(): Promise<Contact[]> {
  const res = await fetch(API_ENDPOINTS.CONTACT_BOOK.GET_ALL, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch contacts');
  const data = await res.json();
  return data.contacts ?? [];
}
