import React from 'react';

interface TenantInsuranceSectionProps {
    tenantId: string;
}

const TenantInsuranceSection: React.FC<TenantInsuranceSectionProps> = ({ tenantId }) => {
    // Note: There's no direct API for tenant insurance yet
    return (
        <div className="text-center py-12 bg-[#F0F0F6] rounded-[2rem]">
            <p className="text-gray-600">No insurance information available for this tenant</p>
            <p className="text-sm text-gray-500 mt-2">Insurance data will appear here once available</p>
        </div>
    );
};

export default TenantInsuranceSection;

