/**
 * Utility functions for managing leads in localStorage
 * Provides a consistent interface for CRUD operations on leads
 */

export interface Lead {
    id: string;
    fullName: string;
    phone: string;
    email: string;
    leadType: 'Hot' | 'Cold';
    createdAt: string;
    status: string;
    // Add other fields as needed
}

const LEADS_STORAGE_KEY = 'leads';

const getLeadsKey = (userId: string): string => `${userId}_${LEADS_STORAGE_KEY}`;
/**
 * Generate a unique ID for a new lead
 */
export const generateLeadId = (): string => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    return `lead_${timestamp}_${randomStr}`;
};

/**
 * Get all leads from localStorage for a specific user
 */
export const getAllLeads = (userId: string): Lead[] => {
    try {
        const leadsJson = localStorage.getItem(getLeadsKey(userId));
        return leadsJson ? JSON.parse(leadsJson) : [];
    } catch (error) {
        console.error('Error reading leads from localStorage:', error);
        return [];
    }
};

/**
 * Get a single lead by ID for a specific user
 */
export const getLeadById = (userId: string, id: string): Lead | null => {
    const leads = getAllLeads(userId);
    return leads.find(lead => lead.id === id) || null;
};

/**
 * Save a new lead to localStorage for a specific user
 */
export const saveLead = (userId: string, leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>): Lead => {
    const newLead: Lead = {
        id: generateLeadId(),
        ...leadData,
        createdAt: new Date().toISOString(),
        status: 'New'
    };

    const leads = getAllLeads(userId);
    const updatedLeads = [...leads, newLead];

    try {
        localStorage.setItem(getLeadsKey(userId), JSON.stringify(updatedLeads));
        return newLead;
    } catch (error) {
        console.error('Error saving lead to localStorage:', error);
        throw error;
    }
};

/**
 * Update an existing lead for a specific user
 */
export const updateLead = (userId: string, id: string, updates: Partial<Omit<Lead, 'id' | 'createdAt'>>): Lead | null => {
    const leads = getAllLeads(userId);
    const leadIndex = leads.findIndex(lead => lead.id === id);

    if (leadIndex === -1) {
        console.error(`Lead with id ${id} not found`);
        return null;
    }

    const updatedLead = {
        ...leads[leadIndex],
        ...updates
    };

    leads[leadIndex] = updatedLead;

    try {
        localStorage.setItem(getLeadsKey(userId), JSON.stringify(leads));
        return updatedLead;
    } catch (error) {
        console.error('Error updating lead in localStorage:', error);
        throw error;
    }
};

/**
 * Delete a lead by ID for a specific user
 */
export const deleteLead = (userId: string, id: string): boolean => {
    const leads = getAllLeads(userId);
    const filteredLeads = leads.filter(lead => lead.id !== id);

    if (filteredLeads.length === leads.length) {
        console.error(`Lead with id ${id} not found`);
        return false;
    }

    try {
        localStorage.setItem(getLeadsKey(userId), JSON.stringify(filteredLeads));
        return true;
    } catch (error) {
        console.error('Error deleting lead from localStorage:', error);
        throw error;
    }
};

/**
 * Search leads by name, email, or phone for a specific user
 */
export const searchLeads = (userId: string, query: string): Lead[] => {
    const leads = getAllLeads(userId);
    const lowerQuery = query.toLowerCase();

    return leads.filter(lead =>
        lead.fullName.toLowerCase().includes(lowerQuery) ||
        lead.email.toLowerCase().includes(lowerQuery) ||
        lead.phone.includes(query)
    );
};

/**
 * Filter leads by type for a specific user
 */
export const filterLeadsByType = (userId: string, type: 'Hot' | 'Cold'): Lead[] => {
    const leads = getAllLeads(userId);
    return leads.filter(lead => lead.leadType === type);
};

/**
 * Filter leads by status for a specific user
 */
export const filterLeadsByStatus = (userId: string, status: string): Lead[] => {
    const leads = getAllLeads(userId);
    return leads.filter(lead => lead.status === status);
};

/**
 * Get leads count for a specific user
 */
export const getLeadsCount = (userId: string): number => {
    return getAllLeads(userId).length;
};

/**
 */
export const clearAllLeads = (userId: string): void => {
    try {
        localStorage.removeItem(getLeadsKey(userId));
    } catch (error) {
        console.error('Error clearing leads from localStorage:', error);
        throw error;
    }
};
