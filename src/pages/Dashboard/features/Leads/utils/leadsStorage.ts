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

/**
 * Generate a unique ID for a new lead
 */
export const generateLeadId = (): string => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    return `lead_${timestamp}_${randomStr}`;
};

/**
 * Get all leads from localStorage
 */
export const getAllLeads = (): Lead[] => {
    try {
        const leadsJson = localStorage.getItem(LEADS_STORAGE_KEY);
        return leadsJson ? JSON.parse(leadsJson) : [];
    } catch (error) {
        console.error('Error reading leads from localStorage:', error);
        return [];
    }
};

/**
 * Get a single lead by ID
 */
export const getLeadById = (id: string): Lead | null => {
    const leads = getAllLeads();
    return leads.find(lead => lead.id === id) || null;
};

/**
 * Save a new lead to localStorage
 */
export const saveLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>): Lead => {
    const newLead: Lead = {
        id: generateLeadId(),
        ...leadData,
        createdAt: new Date().toISOString(),
        status: 'New'
    };

    const leads = getAllLeads();
    const updatedLeads = [...leads, newLead];

    try {
        localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updatedLeads));
        return newLead;
    } catch (error) {
        console.error('Error saving lead to localStorage:', error);
        throw error;
    }
};

/**
 * Update an existing lead
 */
export const updateLead = (id: string, updates: Partial<Omit<Lead, 'id' | 'createdAt'>>): Lead | null => {
    const leads = getAllLeads();
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
        localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
        return updatedLead;
    } catch (error) {
        console.error('Error updating lead in localStorage:', error);
        throw error;
    }
};

/**
 * Delete a lead by ID
 */
export const deleteLead = (id: string): boolean => {
    const leads = getAllLeads();
    const filteredLeads = leads.filter(lead => lead.id !== id);

    if (filteredLeads.length === leads.length) {
        console.error(`Lead with id ${id} not found`);
        return false;
    }

    try {
        localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(filteredLeads));
        return true;
    } catch (error) {
        console.error('Error deleting lead from localStorage:', error);
        throw error;
    }
};

/**
 * Search leads by name, email, or phone
 */
export const searchLeads = (query: string): Lead[] => {
    const leads = getAllLeads();
    const lowerQuery = query.toLowerCase();

    return leads.filter(lead =>
        lead.fullName.toLowerCase().includes(lowerQuery) ||
        lead.email.toLowerCase().includes(lowerQuery) ||
        lead.phone.includes(query)
    );
};

/**
 * Filter leads by type
 */
export const filterLeadsByType = (type: 'Hot' | 'Cold'): Lead[] => {
    const leads = getAllLeads();
    return leads.filter(lead => lead.leadType === type);
};

/**
 * Filter leads by status
 */
export const filterLeadsByStatus = (status: string): Lead[] => {
    const leads = getAllLeads();
    return leads.filter(lead => lead.status === status);
};

/**
 * Get leads count
 */
export const getLeadsCount = (): number => {
    return getAllLeads().length;
};

/**
 * Clear all leads (use with caution!)
 */
export const clearAllLeads = (): void => {
    try {
        localStorage.removeItem(LEADS_STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing leads from localStorage:', error);
        throw error;
    }
};
