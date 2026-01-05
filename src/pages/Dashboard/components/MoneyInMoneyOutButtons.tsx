import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface MoneyInMoneyOutButtonsProps {
    className?: string;
}

const MoneyInMoneyOutButtons: React.FC<MoneyInMoneyOutButtonsProps> = ({ className = '' }) => {
    const navigate = useNavigate();
    const [activeDropdown, setActiveDropdown] = useState<'money_in' | 'money_out' | null>(null);
    const dropdownContainerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };

        if (activeDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeDropdown]);

    return (
        <div className={`flex flex-wrap items-center gap-3 w-full sm:w-auto ${className}`} ref={dropdownContainerRef}>
            {/* Money In */}
            <div className="relative flex-1 sm:flex-none">
                <button
                    onClick={() => setActiveDropdown(activeDropdown === 'money_in' ? null : 'money_in')}
                    className="w-full sm:w-40 px-6 py-2 bg-[#3A6D6C] text-white rounded-md text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                    Money In
                    <ChevronDown className="w-4 h-4" />
                </button>

                {activeDropdown === 'money_in' && (
                    <div className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-md border border-gray-100 bg-white shadow-xl">
                        <button onClick={() => navigate('/dashboard/accounting/transactions/income/add')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Income invoice</button>
                        <button onClick={() => navigate('/dashboard/accounting/transactions/income-payments')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Income payment</button>
                        <button onClick={() => navigate('/dashboard/accounting/transactions/recurring-income/add')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Recurring income</button>
                        <button onClick={() => navigate('/dashboard/accounting/transactions/bulk-payments-income')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Bulk change</button>
                        <button onClick={() => navigate('/dashboard/accounting/transactions/deposit/add')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Deposit</button>
                        <button onClick={() => navigate('/dashboard/accounting/transactions/credits/add')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Credits</button>
                    </div>
                )}
            </div>

            {/* Money Out */}
            <div className="relative flex-1 sm:flex-none">
                <button
                    onClick={() => setActiveDropdown(activeDropdown === 'money_out' ? null : 'money_out')}
                    className="w-full sm:w-40 px-6 py-2 bg-[#1f2937] text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                    Money Out
                    <ChevronDown className="w-4 h-4" />
                </button>
                {activeDropdown === 'money_out' && (
                    <div className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-md border border-gray-100 bg-white shadow-xl">
                        <button onClick={() => navigate('/dashboard/accounting/transactions/expense/add')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Expense invoice</button>
                        <button onClick={() => navigate('/dashboard/accounting/transactions/expense-payments')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Expense payment</button>
                        <button onClick={() => navigate('/dashboard/accounting/transactions/recurring-expense/add')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Recurring expense</button>
                        <button onClick={() => navigate('/dashboard/accounting/transactions/bulk-payments-expense')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Bulk change</button>
                        <button onClick={() => navigate('/dashboard/accounting/transactions/return-deposit')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Return deposit</button>
                        <button onClick={() => navigate('/dashboard/accounting/transactions/apply-deposit')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Apply deposit</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MoneyInMoneyOutButtons;
