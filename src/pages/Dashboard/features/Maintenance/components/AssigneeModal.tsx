import React, { useState, useEffect } from 'react';
import { X, Check, ChevronDown, Users, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { serviceProviderService, type BackendServiceProvider } from '../../../../../services/service-provider.service';
import { maintenanceRequestService } from '../../../../../services/maintenance-request.service';
import { useGetCurrentUser } from '../../../../../hooks/useAuthQueries';
import { useGetMaintenanceRequestApplicants } from '../../../../../hooks/useMaintenanceRequestQueries';

interface AssigneeOption {
    type: 'internal' | 'service_provider';
    id: string;
    label: string;
}

interface AssigneeModalProps {
    isOpen: boolean;
    onClose: () => void;
    requestId: string;
    currentAssignee: string;
    requestCategory?: string;
    onSuccess: () => void;
}

const AssigneeModal: React.FC<AssigneeModalProps> = ({
    isOpen,
    onClose,
    requestId,
    currentAssignee,
    requestCategory,
    onSuccess,
}) => {
    const { data: currentUser } = useGetCurrentUser(isOpen);
    const [selectedOption, setSelectedOption] = useState<AssigneeOption | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: serviceProviders = [], isLoading: isLoadingProviders } = useQuery({
        queryKey: ['service-providers', isOpen],
        queryFn: () => serviceProviderService.getAll(true),
        enabled: isOpen,
        staleTime: 2 * 60 * 1000,
    });

    const { data: applicants = [], isLoading: isLoadingApplicants } = useGetMaintenanceRequestApplicants(
        requestId,
        isOpen,
    );

    const filteredProviders = requestCategory
        ? serviceProviders.filter(
              (sp: BackendServiceProvider) =>
                  sp.category?.toUpperCase() === requestCategory.toUpperCase(),
          )
        : serviceProviders;

    const options: AssigneeOption[] = [
        ...(currentUser
            ? [
                  {
                      type: 'internal' as const,
                      id: currentUser.userId,
                      label: `Assign to me (${currentUser.fullName || currentUser.email})`,
                  },
              ]
            : []),
        ...filteredProviders.map((sp: BackendServiceProvider) => ({
            type: 'service_provider' as const,
            id: sp.id,
            label: sp.companyName || `${sp.firstName} ${sp.lastName}`.trim(),
        })),
    ];

    useEffect(() => {
        if (isOpen) {
            setSelectedOption(null);
            setIsDropdownOpen(false);
            setError(null);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSelect = (option: AssigneeOption) => {
        setSelectedOption(option);
        setIsDropdownOpen(false);
        setError(null);
    };

    const handleSave = async () => {
        if (!selectedOption) {
            setError('Please select an assignee');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            if (selectedOption.type === 'internal') {
                await maintenanceRequestService.assignInternal(requestId, selectedOption.id);
            } else {
                await serviceProviderService.assignToMaintenanceRequest(
                    selectedOption.id,
                    requestId,
                );
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to assign');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAssignApplicant = async (serviceProviderId: string) => {
        setIsSubmitting(true);
        setError(null);

        try {
            await serviceProviderService.assignToMaintenanceRequest(
                serviceProviderId,
                requestId,
            );
            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to assign applicant');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-[#355F5E] px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-lg font-medium text-white">Add assignee</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                <div className="p-8 rounded-b-2xl max-h-[80vh] overflow-y-auto">
                    {/* Applicants Section */}
                    {applicants.length > 0 && (
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <div className="flex items-center gap-2 mb-3">
                                <Users className="w-4 h-4 text-[#3A6D6C]" />
                                <h3 className="text-sm font-semibold text-gray-900">Applicants</h3>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                    {applicants.length}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">
                                Service providers who expressed interest in this job
                            </p>
                            <div className="space-y-2">
                                {applicants.map((applicant) => (
                                    <div
                                        key={applicant.id}
                                        className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg hover:bg-green-100 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {applicant.serviceProvider.companyName ||
                                                    `${applicant.serviceProvider.firstName} ${applicant.serviceProvider.lastName}`.trim()}
                                            </p>
                                            {applicant.quotedAmount > 0 && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <DollarSign className="w-3 h-3 text-green-600" />
                                                    <span className="text-xs text-green-700 font-medium">
                                                        ${applicant.quotedAmount.toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">
                                                Applied {new Date(applicant.quotedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleAssignApplicant(applicant.serviceProviderId)}
                                            disabled={isSubmitting}
                                            className="ml-3 px-4 py-1.5 bg-[#3A6D6C] text-white text-xs font-medium rounded-lg hover:bg-[#2c5251] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                        >
                                            Assign
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {isLoadingApplicants && (
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <div className="flex items-center gap-2 mb-3">
                                <Users className="w-4 h-4 text-gray-400" />
                                <h3 className="text-sm font-semibold text-gray-900">Applicants</h3>
                            </div>
                            <p className="text-xs text-gray-500">Loading applicants...</p>
                        </div>
                    )}

                    <p className="text-gray-600 text-sm mb-6">
                        {applicants.length > 0
                            ? 'Or assign yourself, select a team member, or a Service Pro from the list below.'
                            : 'Assign yourself, select a team member, or a Service Pro from the list.'}
                    </p>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assignee <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            disabled={isLoadingProviders}
                            className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3A6D6C] flex items-center justify-between disabled:opacity-50"
                        >
                            <span className="text-gray-700">
                                {selectedOption
                                    ? selectedOption.label
                                    : isLoadingProviders
                                      ? 'Loading...'
                                      : currentAssignee && currentAssignee !== 'Unassigned'
                                        ? `Current: ${currentAssignee}`
                                        : 'Select assignee'}
                            </span>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl z-[60] overflow-hidden max-h-60 overflow-y-auto">
                                {options.length === 0 && !isLoadingProviders ? (
                                    <div className="px-4 py-3 text-sm text-gray-500">
                                        No service providers found. Add service providers in
                                        Service Pros.
                                    </div>
                                ) : (
                                    options.map((option) => (
                                        <button
                                            key={`${option.type}-${option.id}`}
                                            onClick={() => handleSelect(option)}
                                            className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between
                                                ${selectedOption?.id === option.id ? 'bg-gray-50' : ''}
                                            `}
                                        >
                                            <span className="text-gray-700">{option.label}</span>
                                            {selectedOption?.id === option.id && (
                                                <Check className="w-4 h-4 text-[#3A6D6C]" />
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {error && (
                        <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}

                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 bg-[#535D68] text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:bg-[#434b54] transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!selectedOption || isSubmitting}
                            className="flex-1 bg-[#3A6D6C] text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:bg-[#2c5251] transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Adding...' : 'Add'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssigneeModal;
