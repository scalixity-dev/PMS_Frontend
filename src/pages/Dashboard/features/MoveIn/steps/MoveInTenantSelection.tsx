import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, User, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useMoveInStore } from '../store/moveInStore';
import { useGetAllApplications } from '../../../../../hooks/useApplicationQueries';
import { useGetAllTenants } from '../../../../../hooks/useTenantQueries';
import { tenantService, type BackendTenantProfile } from '../../../../../services/tenant.service';
import type { BackendApplication } from '../../../../../services/application.service';

interface Tenant {
    id: string; // User ID, tenant profile ID, or application ID (for backend API)
    applicationId?: string; // Application ID if from application
    tenantProfileId?: string; // Tenant profile ID (if found in contact book)
    name: string;
    email: string;
    phone: string;
    image?: string;
    status?: 'Pending' | 'Accepted' | 'Declined' | 'Approved'; // Contact book status or application status
    hasUserAccount: boolean; // Whether tenant has a user account
    source: 'application' | 'contactBook'; // Where the tenant comes from
}

interface MoveInTenantSelectionProps {
    onNext: () => void;
    onBack: () => void;
}

const MoveInTenantSelection: React.FC<MoveInTenantSelectionProps> = ({
    onNext
}) => {
    const location = useLocation();
    const { formData, setTenantId } = useMoveInStore();
    const selectedTenantId = formData.tenantId;
    const propertyId = formData.propertyId;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch applications to get approved applicants for the property
    const { data: applications = [], isLoading: isLoadingApplications } = useGetAllApplications();
    
    // Fetch tenants from contact book (for matching)
    const { data: backendTenants = [], isLoading: isLoadingTenants } = useGetAllTenants();

    const isLoading = isLoadingApplications || isLoadingTenants;
    // Get errors from queries if any
    const { error: applicationsError } = useGetAllApplications();
    const { error: tenantsError } = useGetAllTenants();
    const error = applicationsError || tenantsError;

    // Transform approved applications to tenants for the selected property
    const tenantsFromApplications: Tenant[] = useMemo(() => {
        if (!propertyId) return [];

        // Filter approved applications for the selected property
        const approvedApps = applications.filter((app: BackendApplication) => {
            // Check if application has leasing and property data
            if (!app.leasing || !app.leasing.property) {
                return false;
            }
            
            const appPropertyId = app.leasing.property.id;
            const isApproved = app.status === 'APPROVED';
            
            // Ensure we have applicants
            if (!app.applicants || app.applicants.length === 0) {
                return false;
            }
            
            return appPropertyId === propertyId && isApproved;
        });

        // Extract primary applicants from approved applications
        const tenantList: Tenant[] = [];
        
        for (const app of approvedApps) {
            const primaryApplicant = app.applicants.find(a => a.isPrimary) || app.applicants[0];
            if (!primaryApplicant || !primaryApplicant.email) continue;

            // Try to find matching tenant profile by email
            const matchingTenant = backendTenants.find((tenant: BackendTenantProfile) => {
                const tenantEmail = tenant.user?.email || tenant.contactBookEntry?.email;
                return tenantEmail?.toLowerCase() === primaryApplicant.email.toLowerCase();
            });

            // Construct phone number
            const phone = primaryApplicant.phoneNumber || 'N/A';

            // Determine tenant ID and account status
            let tenantId: string;
            let hasUserAccount = false;
            let tenantProfileId: string | undefined;

            if (matchingTenant) {
                // Found in contact book - use user ID if available, otherwise tenant profile ID
                tenantId = matchingTenant.userId || matchingTenant.id;
                hasUserAccount = !!matchingTenant.userId;
                tenantProfileId = matchingTenant.id;
            } else {
                // Not in contact book yet - applicant from approved application
                // Since they submitted an application, they should have a user account
                // We'll use the applicant email to find/create tenant profile in backend
                // For now, use a placeholder that backend can resolve by email
                // The backend moveInTenant can look up by email if needed
                tenantId = `email:${primaryApplicant.email}`; // Backend will need to resolve this
                hasUserAccount = true; // Assume they have account since they submitted application
                tenantProfileId = undefined;
            }

            tenantList.push({
                id: tenantId,
                applicationId: app.id,
                tenantProfileId,
                name: `${primaryApplicant.firstName} ${primaryApplicant.middleName || ''} ${primaryApplicant.lastName}`.trim(),
                email: primaryApplicant.email,
                phone,
                image: app.imageUrl || undefined,
                status: 'Approved' as const,
                hasUserAccount,
                source: 'application' as const,
            });
        }
        
        return tenantList;
    }, [applications, propertyId, backendTenants]);

    // Combine tenants from applications (prioritized) and contact book
    const tenants: Tenant[] = useMemo(() => {
        const applicationEmails = new Set(
            tenantsFromApplications
                .filter(t => t.email) // Filter out tenants without email
                .map(t => t.email.toLowerCase())
        );
        
        // Add contact book tenants that aren't already in applications list
        const contactBookTenants: Tenant[] = backendTenants
            .filter((tenant: any) => {
                const tenantEmail = tenant.user?.email || tenant.contactBookEntry?.email;
                return tenantEmail && !applicationEmails.has(tenantEmail.toLowerCase());
            })
            .map((tenant: any) => {
                const transformed = tenantService.transformTenant(tenant);
                const hasUserAccount = !!tenant.userId;
                
                return {
                    id: tenant.userId || tenant.id,
                    tenantProfileId: tenant.id,
                    name: transformed.name,
                    email: transformed.email,
                    phone: transformed.phone,
                    image: transformed.image,
                    status: tenant.contactBookEntry?.status === 'PENDING' 
                        ? 'Pending' 
                        : tenant.contactBookEntry?.status === 'ACCEPTED' 
                        ? 'Accepted' 
                        : 'Declined',
                    hasUserAccount,
                    source: 'contactBook' as const,
                };
            });

        // Applications first (approved tenants), then contact book
        return [...tenantsFromApplications, ...contactBookTenants];
    }, [tenantsFromApplications, backendTenants]);

    const selectedTenant = tenants.find(t => t.id === selectedTenantId);

    // Pre-select tenant from application if email is provided in navigation state
    useEffect(() => {
        const state = location.state as { preSelectedTenantEmail?: string } | null;
        if (state?.preSelectedTenantEmail && !selectedTenantId && tenants.length > 0) {
            // Find tenant by email
            const tenantByEmail = tenants.find(
                t => t.email.toLowerCase() === state.preSelectedTenantEmail!.toLowerCase()
            );
            if (tenantByEmail) {
                setTenantId(tenantByEmail.id);
            }
        }
    }, [location.state, tenants, selectedTenantId, setTenantId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (tenantId: string) => {
        setTenantId(tenantId);
        setIsOpen(false);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="w-full flex flex-col items-center justify-center min-h-[200px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#3D7475]" />
                <p className="mt-4 text-gray-600">Loading tenants...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-full flex flex-col items-center">
                <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">
                        {error instanceof Error ? error.message : 'Failed to load tenants'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2 text-[#374151]">Tenant information</h2>
                <p className="text-[#6B7280] max-w-lg mx-auto">Select the tenant from the dropdown menu. If your tenant is connected with you, the lease will be automatically shared with them.</p>
            </div>

            <div className="w-full max-w-md relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-bold">Tenants</label>

                {/* Dropdown Trigger */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:border-[#3D7475] focus:outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        {!selectedTenant ? (
                            <>
                                <span className="text-gray-500">Search a Tenants</span>
                            </>
                        ) : (
                            <>
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                                    {selectedTenant.image ? (
                                        <img src={selectedTenant.image} alt={selectedTenant.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                                            <User size={16} />
                                        </div>
                                    )}
                                </div>
                                <span className="text-gray-900 font-medium">{selectedTenant.name}</span>
                            </>
                        )}

                    </div>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto">
                        {tenants.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                {propertyId 
                                    ? `No approved applications found for this property. Please approve an application for property ${propertyId} first.`
                                    : 'No tenants found. Select a property first or add tenants to your contact book.'}
                            </div>
                        ) : (
                            tenants.map((tenant) => (
                                <button
                                    key={tenant.id}
                                    onClick={() => tenant.hasUserAccount && handleSelect(tenant.id)}
                                    disabled={!tenant.hasUserAccount}
                                    className={`w-full flex items-center justify-between p-3 transition-colors border-b border-gray-50 last:border-0 ${
                                        tenant.hasUserAccount 
                                            ? 'hover:bg-gray-50 cursor-pointer' 
                                            : 'opacity-60 cursor-not-allowed'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                                            {tenant.image ? (
                                                <img src={tenant.image} alt={tenant.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                    <User size={16} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-left flex-1">
                                            <p className="text-sm font-medium text-gray-900">{tenant.name}</p>
                                            <p className="text-xs text-gray-500">{tenant.email}</p>
                                            {tenant.source === 'application' && (
                                                <p className="text-xs text-blue-600 mt-0.5">From approved application</p>
                                            )}
                                            {!tenant.hasUserAccount && tenant.source === 'contactBook' && (
                                                <p className="text-xs text-orange-600 mt-0.5">Invitation pending</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {tenant.status && (
                                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    tenant.status === 'Approved' || tenant.status === 'Accepted'
                                                        ? 'bg-green-100 text-green-700' 
                                                        : tenant.status === 'Pending'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {tenant.status}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            <div className="w-full max-w-md mt-16 flex justify-center">
                <button
                    onClick={onNext}
                    disabled={!selectedTenantId}
                    className={`
                    px-12 py-3 rounded-lg font-medium text-white transition-all
                    ${!selectedTenantId
                            ? 'bg-[#3D7475] opacity-50 cursor-not-allowed'
                            : 'bg-[#3D7475] hover:bg-[#2c5554] shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                        }
                `}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MoveInTenantSelection;
