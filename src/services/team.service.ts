import { API_ENDPOINTS } from '../config/api.config';

export type TeamRole = 'ADMIN' | 'MANAGER' | 'ACCOUNTANT' | 'MAINTENANCE' | 'VIEWER';
export type TeamMemberStatus = 'INVITED' | 'ACTIVE' | 'SUSPENDED' | 'REVOKED';

export interface TeamMember {
  id: string;
  ownerId: string;
  userId: string | null;
  email: string;
  name: string;
  phoneNumber: string | null;
  role: TeamRole;
  permissions: string[];
  status: TeamMemberStatus;
  invitationExpiresAt: string | null;
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
  propertyIds: string[];
  user?: {
    id: string;
    email: string;
    fullName: string;
    isActive: boolean;
  } | null;
  propertyAssignments?: Array<{
    propertyId: string;
    property?: { id: string; propertyName: string };
  }>;
}

export interface InviteTeamMemberDto {
  name: string;
  email: string;
  phoneNumber?: string;
  role?: TeamRole;
  permissions?: string[];
  propertyIds?: string[];
}

export interface UpdateTeamMemberDto {
  name?: string;
  phoneNumber?: string;
  role?: TeamRole;
  permissions?: string[];
  propertyIds?: string[];
}

class TeamService {
  async getAll(): Promise<TeamMember[]> {
    const response = await fetch(API_ENDPOINTS.TEAM.GET_ALL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error(await this.extractError(response, 'Failed to fetch team members'));
    const data = await response.json();
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray(data.data)) return data.data;
    return [];
  }

  async getMyTeams(): Promise<any[]> {
    const response = await fetch(API_ENDPOINTS.TEAM.MY_TEAMS, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error(await this.extractError(response, 'Failed to fetch your teams'));
    return response.json();
  }

  async getOne(id: string): Promise<TeamMember> {
    const response = await fetch(API_ENDPOINTS.TEAM.GET_ONE(id), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error(await this.extractError(response, 'Failed to fetch team member'));
    return response.json();
  }

  async invite(dto: InviteTeamMemberDto): Promise<TeamMember> {
    const response = await fetch(API_ENDPOINTS.TEAM.INVITE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error(await this.extractError(response, 'Failed to invite team member'));
    return response.json();
  }

  async update(id: string, dto: UpdateTeamMemberDto): Promise<TeamMember> {
    const response = await fetch(API_ENDPOINTS.TEAM.UPDATE(id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error(await this.extractError(response, 'Failed to update team member'));
    return response.json();
  }

  async revoke(id: string): Promise<{ message: string }> {
    const response = await fetch(API_ENDPOINTS.TEAM.REVOKE(id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error(await this.extractError(response, 'Failed to revoke team member'));
    return response.json();
  }

  async enable(id: string): Promise<{ message: string }> {
    const response = await fetch(API_ENDPOINTS.TEAM.ENABLE(id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error(await this.extractError(response, 'Failed to enable team member'));
    return response.json();
  }

  async resendInvitation(id: string): Promise<{ message: string }> {
    const response = await fetch(API_ENDPOINTS.TEAM.RESEND(id), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error(await this.extractError(response, 'Failed to resend invitation'));
    return response.json();
  }

  async delete(id: string): Promise<{ message: string }> {
    const response = await fetch(API_ENDPOINTS.TEAM.DELETE(id), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error(await this.extractError(response, 'Failed to delete team member'));
    return response.json();
  }

  async getInvitation(token: string): Promise<{ email: string; name: string; role: string }> {
    const response = await fetch(API_ENDPOINTS.TEAM.GET_INVITATION(token), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(await this.extractError(response, 'Invalid or expired invitation'));
    return response.json();
  }

  async acceptInvitation(token: string, password: string): Promise<TeamMember> {
    const response = await fetch(API_ENDPOINTS.TEAM.ACCEPT_INVITATION, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token, password }),
    });
    if (!response.ok) throw new Error(await this.extractError(response, 'Failed to accept invitation'));
    return response.json();
  }

  private async extractError(response: Response, fallback: string): Promise<string> {
    try {
      const err = await response.json();
      if (Array.isArray(err.message)) return err.message.join('. ');
      return err.message || err.error || fallback;
    } catch {
      return `${fallback}: ${response.statusText}`;
    }
  }
}

export const teamService = new TeamService();
