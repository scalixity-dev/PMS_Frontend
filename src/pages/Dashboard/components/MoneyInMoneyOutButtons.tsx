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
    const triggerInRef = useRef<HTMLButtonElement>(null);
    const triggerOutRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

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

    // Handle focus when opening/closing
    useEffect(() => {
        if (activeDropdown && menuRef.current) {
            const firstItem = menuRef.current.querySelector('button');
            firstItem?.focus();
        } else if (!activeDropdown) {
            // Return focus to the trigger that was active
            // Note: This is a simple heuristic; ideally we'd track which trigger opened it
        }
    }, [activeDropdown]);

    const handleKeyDown = (e: React.KeyboardEvent, type: 'money_in' | 'money_out') => {
        if (e.key === 'Escape') {
            setActiveDropdown(null);
            if (type === 'money_in') triggerInRef.current?.focus();
            else triggerOutRef.current?.focus();
        }

        if (activeDropdown && menuRef.current) {
            const items = Array.from(menuRef.current.querySelectorAll('button'));
            const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % items.length;
                items[nextIndex]?.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + items.length) % items.length;
                items[prevIndex]?.focus();
            }
        }
    };

    return (
        <div className={`flex flex-wrap items-center gap-3 w-full sm:w-auto ${className}`} ref={dropdownContainerRef}>
            {/* Money In */}
            <div className="relative flex-1 sm:flex-none">
                <button
                    ref={triggerInRef}
                    aria-haspopup="true"
                    aria-expanded={activeDropdown === 'money_in'}
                    onClick={() => setActiveDropdown(activeDropdown === 'money_in' ? null : 'money_in')}
                    onKeyDown={(e) => handleKeyDown(e, 'money_in')}
                    className="w-full sm:w-40 px-6 py-2 bg-[#3A6D6C] text-white rounded-md text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                    Money In
                    <ChevronDown className="w-4 h-4" />
                </button>

                {activeDropdown === 'money_in' && (
                    <div
                        ref={menuRef}
                        role="menu"
                        onKeyDown={(e) => handleKeyDown(e, 'money_in')}
                        className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-md border border-gray-100 bg-white shadow-xl"
                    >
                        <button role="menuitem" onClick={() => navigate('/dashboard/accounting/transactions/income/add')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 text-nowrap">Income invoice</button>
                        <button role="menuitem" onClick={() => navigate('/dashboard/accounting/transactions/income-payments')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 text-nowrap">Income payment</button>
                        <button role="menuitem" onClick={() => navigate('/dashboard/accounting/transactions/recurring-income/add')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 text-nowrap">Recurring income</button>
                        <button role="menuitem" onClick={() => navigate('/dashboard/accounting/transactions/bulk-payments-income')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 text-nowrap">Bulk change</button>
                        <button role="menuitem" onClick={() => navigate('/dashboard/accounting/transactions/deposit/add')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 text-nowrap">Deposit</button>
                        <button role="menuitem" onClick={() => navigate('/dashboard/accounting/transactions/credits/add')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-nowrap">Credits</button>
                    </div>
                )}
            </div>

            {/* Money Out */}
            <div className="relative flex-1 sm:flex-none">
                <button
                    ref={triggerOutRef}
                    aria-haspopup="true"
                    aria-expanded={activeDropdown === 'money_out'}
                    onClick={() => setActiveDropdown(activeDropdown === 'money_out' ? null : 'money_out')}
                    onKeyDown={(e) => handleKeyDown(e, 'money_out')}
                    className="w-full sm:w-40 px-6 py-2 bg-[#1f2937] text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                    Money Out
                    <ChevronDown className="w-4 h-4" />
                </button>
                {activeDropdown === 'money_out' && (
                    <div
                        ref={menuRef}
                        role="menu"
                        onKeyDown={(e) => handleKeyDown(e, 'money_out')}
                        className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-md border border-gray-100 bg-white shadow-xl"
                    >
                        <button role="menuitem" onClick={() => navigate('/dashboard/accounting/transactions/expense/add')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 text-nowrap">Expense invoice</button>
                        <button role="menuitem" onClick={() => navigate('/dashboard/accounting/transactions/expense-payments')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 text-nowrap">Expense payment</button>
                        <button role="menuitem" onClick={() => navigate('/dashboard/accounting/transactions/recurring-expense/add')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 text-nowrap">Recurring expense</button>
                        <button role="menuitem" onClick={() => navigate('/dashboard/accounting/transactions/bulk-payments-expense')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 text-nowrap">Bulk change</button>
                        <button role="menuitem" onClick={() => navigate('/dashboard/accounting/transactions/return-deposit')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 text-nowrap">Return deposit</button>
                        <button role="menuitem" onClick={() => navigate('/dashboard/accounting/transactions/apply-deposit')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 text-nowrap">Apply deposit</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MoneyInMoneyOutButtons;
