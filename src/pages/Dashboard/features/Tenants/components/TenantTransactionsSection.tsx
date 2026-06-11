interface TenantTransactionsSectionProps {
    tenantId: string;
    tenant: {
        id: number;
        name: string;
    };
}

const TenantTransactionsSection = ({ tenantId: _tenantId, tenant: _tenant }: TenantTransactionsSectionProps) => {
    return (
        <div className="text-center py-12 bg-[#F0F0F6] rounded-[2rem]">
            <p className="text-gray-600">No transactions found for this tenant</p>
            <p className="text-sm text-gray-500 mt-2">Transaction data will appear here once available</p>
        </div>
    );
};

export default TenantTransactionsSection;
