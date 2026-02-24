import React from 'react';
import { DollarSign, Mail, Phone, MapPin, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { type MaintenanceRequestApplicant } from '../../../../../services/maintenance-request.service';

interface ApplicantCardProps {
    applicant: MaintenanceRequestApplicant;
    onAssign: (serviceProviderId: string) => void;
    onAddToContact?: (serviceProviderId: string) => void;
    isAssigning?: boolean;
    isAddingToContact?: boolean;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({
    applicant,
    onAssign,
    onAddToContact,
    isAssigning = false,
    isAddingToContact = false,
}) => {
    const navigate = useNavigate();
    const serviceProvider = applicant.serviceProvider;
    const serviceProviderName =
        serviceProvider.companyName ||
        `${serviceProvider.firstName} ${serviceProvider.lastName}`.trim();
    
    const fullName = `${serviceProvider.firstName} ${serviceProvider.lastName}`.trim();
    const phoneDisplay = serviceProvider.phoneCountryCode
        ? `${serviceProvider.phoneCountryCode} ${serviceProvider.phoneNumber}`
        : serviceProvider.phoneNumber;
    
    const categoryDisplay = serviceProvider.subcategory
        ? `${serviceProvider.category} - ${serviceProvider.subcategory}`
        : serviceProvider.category;

    const locationDisplay = [
        serviceProvider.city,
        serviceProvider.state,
        serviceProvider.zipCode,
        serviceProvider.country,
    ]
        .filter(Boolean)
        .join(', ');

    const handleAddToContact = async () => {
        if (onAddToContact) {
            onAddToContact(serviceProvider.id);
        } else {
            // Fallback: navigate to ServicePros page
            navigate('/dashboard/contacts/service-pros');
        }
    };

    return (
        <div className="bg-green-50 border border-green-100 rounded-lg hover:bg-green-100 transition-colors">
            <div className="p-4">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {serviceProviderName}
                        </h3>
                        {serviceProviderName !== fullName && (
                            <p className="text-xs text-gray-600 mt-0.5">{fullName}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">{categoryDisplay}</p>
                    </div>
                    {applicant.quotedAmount > 0 && (
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-700 font-semibold">
                                ${applicant.quotedAmount.toLocaleString()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Contact Information */}
                <div className="space-y-1.5 mb-3">
                    {serviceProvider.email && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{serviceProvider.email}</span>
                        </div>
                    )}
                    {serviceProvider.phoneNumber && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span>{phoneDisplay}</span>
                        </div>
                    )}
                    {locationDisplay && (
                        <div className="flex items-start gap-2 text-xs text-gray-600">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{locationDisplay}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-green-200">
                    <p className="text-xs text-gray-500">
                        Applied {new Date(applicant.quotedAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleAddToContact}
                            disabled={isAddingToContact}
                            className="px-3 py-1.5 bg-white border border-[#3A6D6C] text-[#3A6D6C] text-xs font-medium rounded-lg hover:bg-[#3A6D6C] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
                        >
                            <UserPlus className="w-3.5 h-3.5" />
                            {isAddingToContact ? 'Adding...' : 'Add to Contact'}
                        </button>
                        <button
                            onClick={() => onAssign(serviceProvider.id)}
                            disabled={isAssigning}
                            className="px-3 py-1.5 bg-[#3A6D6C] text-white text-xs font-medium rounded-lg hover:bg-[#2c5251] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {isAssigning ? 'Assigning...' : 'Assign'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicantCard;
