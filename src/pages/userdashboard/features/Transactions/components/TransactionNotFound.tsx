import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TransactionNotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center max-w-md">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Transaction Not Found</h2>
                <p className="text-gray-600 mb-6">
                    We couldn't find the transaction you're looking for. It might have been deleted or the link is incorrect.
                </p>
                <button
                    onClick={() => navigate('/userdashboard/rent')}
                    className="w-full py-3 bg-[#7ED957] text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                    Back to Accounting
                </button>
            </div>
        </div>
    );
};
