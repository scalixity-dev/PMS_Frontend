import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ChevronLeft, Check, MoreHorizontal, Settings } from 'lucide-react';
import MoneyInMoneyOutButtons from '../../components/MoneyInMoneyOutButtons';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import { useTransactionStore } from '../Transactions/store/transactionStore';
import { useGetRecurringTransactions } from '../../../../hooks/useTransactionQueries';

// Reuse modals from Transactions
import EditInvoiceModal from '../Transactions/components/EditInvoiceModal';
import DeleteTransactionModal from '../Transactions/components/DeleteTransactionModal';
import PostNextInvoiceModal from './components/PostNextInvoiceModal';
import Breadcrumb from '../../../../components/ui/Breadcrumb';

// Utility function to calculate next date based on frequency
const calculateNextDate = (startDate: Date, frequency: string, endDate?: Date | null): Date | null => {
    const now = new Date();
    const start = new Date(startDate);
    
    // If end date exists and has passed, return null
    if (endDate) {
        const end = new Date(endDate);
        if (end < now) {
            return null;
        }
    }
    
    // If start date is in the future, return start date
    if (start > now) {
        return start;
    }
    
    // Calculate next occurrence based on frequency
    let nextDate = new Date(start);
    
    while (nextDate <= now) {
        switch (frequency) {
            case 'DAILY':
                nextDate.setDate(nextDate.getDate() + 1);
                break;
            case 'WEEKLY':
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case 'EVERY_TWO_WEEKS':
                nextDate.setDate(nextDate.getDate() + 14);
                break;
            case 'EVERY_FOUR_WEEKS':
                nextDate.setDate(nextDate.getDate() + 28);
                break;
            case 'MONTHLY':
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
            case 'EVERY_TWO_MONTHS':
                nextDate.setMonth(nextDate.getMonth() + 2);
                break;
            case 'QUARTERLY':
                nextDate.setMonth(nextDate.getMonth() + 3);
                break;
            case 'EVERY_SIX_MONTHS':
                nextDate.setMonth(nextDate.getMonth() + 6);
                break;
            case 'YEARLY':
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                break;
            default:
                return null;
        }
        
        // Check if we've exceeded end date
        if (endDate && nextDate > new Date(endDate)) {
            return null;
        }
    }
    
    return nextDate;
};

// Format date for display
const formatDate = (date: Date | null): string => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const Recurring: React.FC = () => {
    const navigate = useNavigate();
    const context = useOutletContext<{ sidebarCollapsed?: boolean }>();
    const sidebarCollapsed = context?.sidebarCollapsed ?? false;
    const [activeTab, setActiveTab] = useState<'All' | 'Income' | 'Expense'>('All');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    // Fetch recurring transactions from backend
    const { data: recurringTransactions = [], isLoading } = useGetRecurringTransactions();

    const dropdownContainerRef = useRef<HTMLDivElement>(null);
    const [moreMenuOpenId, setMoreMenuOpenId] = useState<string | null>(null);
    const moreMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (moreMenuOpenId !== null && moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
                setMoreMenuOpenId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [moreMenuOpenId]);
    const [isPostInvoiceModalOpen, setIsPostInvoiceModalOpen] = useState(false);
    const [selectedRecurringId, setSelectedRecurringId] = useState<string | null>(null);

    // Using transaction store for shared modals state
    const {
        setDeleteTransactionOpen,
        setSelectedTransactionId,
    } = useTransactionStore();

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<{
        date: string[];
        client: string[];
        property: string[];
    }>({
        date: [],
        client: [],
        property: []
    });

    // Transform backend data to component format
    const transformedRecurring = useMemo(() => {
        return recurringTransactions.map((rt: any) => {
            // Determine transaction type (income or expense)
            // For INVOICE type: if payerId exists, it's income; if payeeId exists, it's expense
            const isIncome = rt.type === 'INVOICE' && rt.payerId;
            const type = isIncome ? 'income' : 'expense';

            // Get contact name
            let contactName = 'N/A';
            if (rt.payer) {
                contactName = rt.payer.fullName || rt.payer.email || 'N/A';
            } else if (rt.payee) {
                contactName = rt.payee.fullName || rt.payee.email || 'N/A';
            } else if (rt.contact) {
                const nameParts = [
                    rt.contact.firstName,
                    rt.contact.middleName,
                    rt.contact.lastName,
                ].filter(Boolean);
                contactName = nameParts.length > 0 ? nameParts.join(' ') : rt.contact.email || 'N/A';
            }

            // Get property name
            const propertyName = rt.property?.propertyName || 'N/A';

            // Calculate next date
            const startDate = new Date(rt.startDate);
            const endDate = rt.endDate ? new Date(rt.endDate) : null;
            const nextDate = calculateNextDate(startDate, rt.frequency, endDate);

            // Determine status
            let status = 'Active';
            if (!rt.enabled) {
                status = 'Paused';
            } else if (endDate && nextDate === null) {
                status = 'Stopped';
            }

            return {
                id: rt.id,
                status,
                nextDate: formatDate(nextDate),
                nextDateObj: nextDate,
                transactionType: rt.subcategory || rt.category || 'N/A',
                category: rt.category || 'N/A',
                property: propertyName,
                contact: contactName,
                amount: parseFloat(rt.amount),
                currency: rt.currency || 'USD',
                type,
                frequency: rt.frequency,
                startDate: rt.startDate,
                endDate: rt.endDate,
            };
        });
    }, [recurringTransactions]);

    // Generate filter options from real data
    const filterOptions: Record<string, FilterOption[]> = useMemo(() => {
        const uniqueContacts = new Set<string>();
        const uniqueProperties = new Set<string>();

        transformedRecurring.forEach((item) => {
            if (item.contact && item.contact !== 'N/A') {
                uniqueContacts.add(item.contact);
            }
            if (item.property && item.property !== 'N/A') {
                uniqueProperties.add(item.property);
            }
        });

        return {
            date: [
                { value: 'today', label: 'Today' },
                { value: 'this_week', label: 'This Week' },
                { value: 'this_month', label: 'This Month' },
            ],
            client: Array.from(uniqueContacts).map(contact => ({
                value: contact.toLowerCase(),
                label: contact,
            })),
            property: Array.from(uniqueProperties).map(property => ({
                value: property.toLowerCase(),
                label: property,
            })),
        };
    }, [transformedRecurring]);

    const filterLabels: Record<string, string> = {
        date: 'Date',
        client: 'Clients',
        property: 'Property & Units',
    };

    // Filter Logic
    const filteredRecurring = useMemo(() => {
        return transformedRecurring.filter(item => {
            // Tab Filter
            if (activeTab !== 'All') {
                if (activeTab === 'Income' && item.type !== 'income') return false;
                if (activeTab === 'Expense' && item.type !== 'expense') return false;
            }

            // Search Filter
            const matchesSearch = searchQuery === '' ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.property.toLowerCase().includes(searchQuery.toLowerCase());

            // Dropdown Filters
            const matchesClient = filters.client.length === 0 || filters.client.some(c => item.contact.toLowerCase().includes(c.toLowerCase()));
            const matchesProperty = filters.property.length === 0 || filters.property.some(p => item.property.toLowerCase().includes(p.toLowerCase()));

            // Date Filter
            let matchesDate = true;
            if (filters.date.length > 0 && item.nextDateObj) {
                const itemDate = item.nextDateObj;
                const today = new Date();
                const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

                matchesDate = filters.date.some(filter => {
                    if (filter === 'today') {
                        return itemDate >= startOfDay && itemDate < endOfDay;
                    } else if (filter === 'this_week') {
                        const now = new Date();
                        const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                        firstDayOfWeek.setHours(0, 0, 0, 0);
                        const endOfWeek = new Date(firstDayOfWeek);
                        endOfWeek.setDate(firstDayOfWeek.getDate() + 6);
                        endOfWeek.setHours(23, 59, 59, 999);
                        return itemDate >= firstDayOfWeek && itemDate <= endOfWeek;
                    } else if (filter === 'this_month') {
                        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                        return itemDate >= startOfMonth && itemDate <= endOfMonth;
                    }
                    return false;
                });
            }

            return matchesSearch && matchesClient && matchesProperty && matchesDate;
        });
    }, [activeTab, searchQuery, filters, transformedRecurring]);

    const toggleSelection = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const toggleAll = () => {
        if (selectedItems.length === filteredRecurring.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredRecurring.map(item => item.id));
        }
    };

    const getStatusTextColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'text-[#2D5B46]';
            case 'paused': return 'text-orange-600';
            case 'stopped': return 'text-red-700';
            default: return 'text-gray-800';
        }
    };

    return (
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen font-outfit transition-all duration-300`}>
            {/* Modals - Reused from Transactions */}
            <EditInvoiceModal />
            <DeleteTransactionModal
                onConfirm={() => {
                    setDeleteTransactionOpen(false);
                    setSelectedTransactionId(null);
                }}
            />
            <PostNextInvoiceModal
                isOpen={isPostInvoiceModalOpen}
                onClose={() => {
                    setIsPostInvoiceModalOpen(false);
                    setSelectedRecurringId(null);
                }}
                onConfirm={() => {
                    console.log('Confirmed post next invoice for:', selectedRecurringId);
                    setIsPostInvoiceModalOpen(false);
                    setSelectedRecurringId(null);
                }}
            />

            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Recurring' }
                ]}
                className="mb-6"
            />

            <div className="p-6 bg-[#DFE5E3] min-h-screen rounded-[2rem] overflow-visible">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                        Recurring
                    </button>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3" ref={dropdownContainerRef}>
                        <MoneyInMoneyOutButtons />

                        {/* Settings */}
                        <button className="w-full sm:w-auto px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center justify-center gap-2">
                            <Settings className="w-4 h-4" />
                            Settings
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-4 mb-8 bg-[#f1f3f2] rounded-3xl md:rounded-full p-2 w-full md:w-min overflow-x-auto">
                    {(['All', 'Income', 'Expense'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 md:flex-none whitespace-nowrap px-4 md:px-8 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab
                                ? 'bg-[#7BD747] text-white shadow-sm'
                                : 'bg-[#DDDDDD] text-black hover:bg-gray-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Filters */}
                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={(newFilters) => setFilters(newFilters as any)}
                    showMoreFilters={true}
                />

                {/* Table Header */}
                <div className="hidden md:block bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm mt-8 pl-4 pr-6">
                    <div className="text-white px-6 py-4 grid grid-cols-[40px_0.5fr_1fr_1fr_1.5fr_1fr_1fr_50px] gap-4 items-center text-sm font-medium">
                        <div className="flex items-center justify-center">
                            <button onClick={toggleAll} className="flex items-center justify-center">
                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedItems.length === filteredRecurring.length && filteredRecurring.length > 0 ? 'bg-[#7BD747]' : 'bg-white/20 border border-white/50'}`}>
                                    {selectedItems.length === filteredRecurring.length && filteredRecurring.length > 0 && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                            </button>
                        </div>
                        <div>Status</div>
                        <div>Next Date</div>
                        <div>Type</div>
                        <div>Category & property</div>
                        <div>Contact</div>
                        <div>Amount</div>
                        <div></div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-b-[2rem] rounded-t min-h-[400px]">
                    {isLoading ? (
                        <div className="text-center py-10 text-gray-500">
                            Loading recurring transactions...
                        </div>
                    ) : filteredRecurring.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => navigate(`/dashboard/accounting/recurring/${item.id}`)}
                            className="relative transition-shadow hover:shadow-md rounded-2xl bg-white shadow-sm cursor-pointer"
                        >
                            {/* Desktop View */}
                            <div className="hidden md:grid px-6 py-4 grid-cols-[40px_0.5fr_1fr_1fr_1.5fr_1fr_1fr_50px] gap-4 items-center">
                                <div className="flex items-center justify-center">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSelection(item.id);
                                        }}
                                        className="flex items-center justify-center"
                                    >
                                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedItems.includes(item.id) ? 'bg-[#7BD747]' : 'bg-gray-200'}`}>
                                            {selectedItems.includes(item.id) && <Check className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                    </button>
                                </div>

                                {/* Status */}
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-medium ${getStatusTextColor(item.status)}`}>{item.status}</span>
                                </div>

                                {/* Next Date */}
                                <div className="text-[#3A6D6C] text-sm font-medium">{item.nextDate}</div>

                                {/* Type */}
                                <div className="text-[#3A6D6C] text-sm font-medium truncate">{item.transactionType}</div>

                                {/* Category & Property */}
                                <div className="text-[#3A6D6C] text-sm font-medium">{item.property}</div>

                                {/* Contact */}
                                <div className="text-[#3A6D6C] text-sm font-medium">{item.contact}</div>

                                {/* Amount */}
                                <div className="text-gray-900 text-sm font-bold">
                                    {item.currency === 'USD' ? '$' : item.currency === 'EUR' ? '€' : item.currency === 'GBP' ? '£' : item.currency === 'INR' ? '₹' : item.currency} {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMoreMenuOpenId(moreMenuOpenId === item.id ? null : item.id);
                                        }}
                                        className="text-gray-600 hover:text-gray-600"
                                    >
                                        <MoreHorizontal className="w-10 h-6 bg-gray-200 rounded-full p-0.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Mobile View */}
                            <div className="flex flex-col p-4 gap-4 md:hidden">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSelection(item.id);
                                            }}
                                            className="flex items-center justify-center"
                                        >
                                            <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedItems.includes(item.id) ? 'bg-[#7BD747]' : 'bg-gray-200'}`}>
                                                {selectedItems.includes(item.id) && <Check className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                        </button>
                                        <span className={`text-sm font-medium ${getStatusTextColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMoreMenuOpenId(moreMenuOpenId === item.id ? null : item.id);
                                        }}
                                        className="text-gray-600"
                                    >
                                        <MoreHorizontal className="w-8 h-8 bg-gray-100 rounded-full p-1.5" />
                                    </button>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-lg font-bold text-gray-800">{item.property}</div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {item.currency === 'USD' ? '$' : item.currency === 'EUR' ? '€' : item.currency === 'GBP' ? '£' : item.currency === 'INR' ? '₹' : item.currency} {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm mt-2 pt-4 border-t border-gray-100">
                                    <div>
                                        <div className="text-gray-400 text-xs mb-1">Next Date</div>
                                        <div className="font-medium text-[#3A6D6C]">{item.nextDate}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-xs mb-1">Type</div>
                                        <div className="font-medium text-[#3A6D6C]">{item.transactionType}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-gray-400 text-xs mb-1">Contact</div>
                                        <div className="font-medium text-[#3A6D6C]">{item.contact}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Shared Dropdown Menu */}
                            {moreMenuOpenId === item.id && (
                                <div
                                    ref={moreMenuRef}
                                    className="absolute right-4 top-14 md:top-12 z-50 mt-2 w-48 overflow-hidden rounded-md border border-gray-100 bg-white shadow-xl"
                                >
                                    <button
                                        onClick={() => {
                                            setSelectedRecurringId(item.id);
                                            setIsPostInvoiceModalOpen(true);
                                            setMoreMenuOpenId(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                    >
                                        Post next invoice
                                    </button>
                                    <button
                                        onClick={() => {
                                            console.log('End', item.id);
                                            setMoreMenuOpenId(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-[#3A6D6C] hover:bg-gray-50 border-b border-gray-100"
                                    >
                                        End
                                    </button>
                                    <button
                                        onClick={() => {
                                            console.log('Clone', item.id);
                                            setMoreMenuOpenId(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                    >
                                        Clone
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedTransactionId(item.id);
                                            setDeleteTransactionOpen(true);
                                            setMoreMenuOpenId(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-[#3A6D6C] hover:bg-gray-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    {!isLoading && filteredRecurring.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                            No recurring transactions found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Recurring;
