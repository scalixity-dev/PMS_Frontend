import { useNavigate } from 'react-router-dom';
import ServiceBreadCrumb from '../../../components/ServiceBreadCrumb';

const ServiceTransactionDetail = () => {
    const navigate = useNavigate();

    return (
        <div>
            <ServiceBreadCrumb
                items={[
                    { label: 'Dashboard', to: '/service-dashboard' },
                    { label: 'Accounting', to: '/service-dashboard/accounting' },
                    { label: 'Transaction', active: true }
                ]}
            />
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Transaction detail not available</h3>
                <p className="text-gray-500 text-center max-w-md px-6 leading-relaxed mb-6">
                    Individual transaction details will be available once the backend supports this feature.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 bg-[#3A6D6C] text-white rounded-lg font-medium shadow-sm hover:bg-[#2c5251] transition-colors"
                >
                    Back to Accounting
                </button>
            </div>
        </div>
    );
};

export default ServiceTransactionDetail;
