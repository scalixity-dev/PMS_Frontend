import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronDown,
    ChevronUp,
    Printer,
    X,
    Tag,
    Home,
    AlignLeft,
    User,
    Users,
    DollarSign,
    Paperclip,
    Image as ImageIcon,
    Download
} from 'lucide-react';
import { PiChatCircleText } from "react-icons/pi";
import ServiceBreadCrumb from '../../../components/ServiceBreadCrumb';

interface CollapsibleSectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-[#F6F6F6] rounded-[20px] overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <span className="text-gray-700">{icon}</span>
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                </div>
                {isOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
            </button>
            {isOpen && (
                <div className="px-8 pb-8">
                    {children}
                </div>
            )}
        </div>
    );
};

const ServiceRequestDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [showActionDropdown, setShowActionDropdown] = useState(false);

    // Mock Data (In a real app, this would be fetched based on :id)
    const requestData = {
        id: id || '123456',
        category: 'Electrical / Outlets / Interior / Sparkling',
        property: 'Luxury Apartment',
        description: 'Mock Description: The electrical outlets in the main living area have been sparking when devices are plugged in. This is a potential fire hazard and needs immediate attention from a qualified electrician. Please check all outlets in the apartment to ensure safety.',
        assignee: {
            name: 'Siddak Bagga',
            email: 'siddakbagga@gmail.com',
            type: 'One Time',
            priority: 'Normal',
            dateInitiated: '-',
            dateDue: '-',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
        },
        tenant: {
            type: 'One Time',
            dateInitiated: '-',
            dateDue: '-'
        },
        // Mock Media
        media: [
            {
                id: '1',
                type: 'image',
                url: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600&auto=format&fit=crop', // Sparking outlet example
                name: 'Outlet_Damage.jpg'
            },
            {
                id: '2',
                type: 'image',
                url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?q=80&w=600&auto=format&fit=crop', // Electrician working
                name: 'Repair_Progress.jpg'
            }
        ],
        // Mock Transactions
        transactions: [
            {
                id: 't1',
                description: 'Initial Inspection Fee',
                date: '2023-10-25',
                amount: 50.00,
                status: 'Paid',
                invoiceUrl: '#'
            },
            {
                id: 't2',
                description: 'Outlet Replacement Parts',
                date: '2023-10-26',
                amount: 125.50,
                status: 'Pending',
                invoiceUrl: '#'
            }
        ]
    };

    return (
        <div className="p-2 flex flex-col gap-6">
            {/* Breadcrumb */}
            <ServiceBreadCrumb
                items={[
                    { label: 'Dashboard', to: '/service-dashboard' },
                    { label: 'Requests', to: '/service-dashboard/requests' },
                    { label: `Requests #${requestData.id}`, active: true }
                ]}
            />

            {/* Header / Top Action Bar */}
            <div className="bg-[#F6F6F6] rounded-[20px] p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <ChevronLeft size={28} className="text-gray-900" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Maintenance request</h1>
                    </div>

                    <div className="flex items-center gap-3 relative">
                        <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors border border-gray-100">
                            <PiChatCircleText size={20} className="text-gray-700" />
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowActionDropdown(!showActionDropdown)}
                                className="bg-[#7CD947] hover:bg-[#6bc23d] text-white px-8 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
                            >
                                Action
                            </button>

                            {showActionDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-1">
                                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                        <Printer size={16} />
                                        Print
                                    </button>
                                    <button className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
                                        <X size={16} />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-2">
                    <div className="flex items-start gap-3">
                        <Tag className="text-gray-700 mt-1" size={24} />
                        <div>
                            <p className="text-sm font-bold text-gray-900">No. {requestData.id}</p>
                            <p className="text-xl font-bold text-gray-900">{requestData.category}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Home className="text-gray-700 mt-1" size={24} />
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Property</p>
                            <p className="text-xl font-bold text-gray-900">{requestData.property}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <AlignLeft className="text-gray-700 mt-1" size={24} />
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Description</p>
                            <p className="text-lg font-bold text-gray-900 mt-1">{requestData.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Collapsible Sections */}
            <CollapsibleSection title="Media" icon={<ImageIcon size={24} />}>
                {requestData.media && requestData.media.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {requestData.media.map(item => (
                            <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">{item.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-400 italic">No media uploaded</div>
                )}
            </CollapsibleSection>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Assignee Information */}
                <div className="bg-[#F6F6F6] rounded-[20px] p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <User size={24} className="text-gray-900" />
                        <h3 className="text-xl font-bold text-gray-900">Assignee Information</h3>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-4">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Type</p>
                                <p className="text-lg font-bold text-gray-900">{requestData.assignee.type}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Priority</p>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#7CD94733] text-[#7CD947] rounded-full text-xs font-bold mt-1">
                                    <span className="w-2 h-2 rounded-full bg-[#7CD947]"></span>
                                    {requestData.assignee.priority}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Date Initiated</p>
                                <p className="text-lg font-bold text-gray-900">{requestData.assignee.dateInitiated}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Date Due</p>
                                <p className="text-lg font-bold text-gray-900">{requestData.assignee.dateDue}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col items-center text-center shadow-sm w-full md:w-48">
                            <div className="w-20 h-20 rounded-full mb-3 bg-coral-100 border-2 border-white flex items-center justify-center text-2xl font-bold text-gray-700 shadow-sm">
                                {requestData.assignee.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <h4 className="font-bold text-gray-900">{requestData.assignee.name}</h4>
                            <p className="text-[10px] text-gray-400 break-all">{requestData.assignee.email}</p>
                        </div>
                    </div>
                </div>

                {/* Tenant Information */}
                <div className="bg-[#F6F6F6] rounded-[20px] p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Users size={24} className="text-gray-900" />
                        <h3 className="text-xl font-bold text-gray-900">Tenant Information</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Type</p>
                            <p className="text-lg font-bold text-gray-900">{requestData.tenant.type}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Type</p>
                            <p className="text-lg font-bold text-gray-900">{requestData.tenant.type}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Date Initiated</p>
                            <p className="text-lg font-bold text-gray-900">{requestData.tenant.dateInitiated}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Date Due</p>
                            <p className="text-lg font-bold text-gray-900">{requestData.tenant.dateDue}</p>
                        </div>
                    </div>
                </div>
            </div>

            <CollapsibleSection title="Transactions" icon={<DollarSign size={24} />}>
                {requestData.transactions && requestData.transactions.length > 0 ? (
                    <>
                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {requestData.transactions.map((tx) => (
                                <div key={tx.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-gray-500 font-medium text-sm">#{tx.id}</span>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${tx.status === 'Paid' ? 'bg-green-50 text-green-700' :
                                            tx.status === 'Pending' ? 'bg-blue-50 text-blue-600' :
                                                'bg-yellow-50 text-yellow-700'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <h3 className="font-semibold text-gray-900 text-base mb-1">{tx.description}</h3>
                                        <p className="text-gray-500 text-sm">{tx.date}</p>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                        <span className="text-sm font-bold text-gray-900">${tx.amount.toFixed(2)}</span>
                                        <button className="text-[#3A6D6C] hover:text-[#2c5252] text-xs font-bold hover:underline flex items-center gap-1">
                                            Download Invoice
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#7BE156] text-white">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold">Description</th>
                                        <th className="px-6 py-4 font-semibold">Date</th>
                                        <th className="px-6 py-4 font-semibold text-right">Amount</th>
                                        <th className="px-6 py-4 font-semibold text-center">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {requestData.transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className={`flex items-center gap-2 font-medium text-sm ${tx.status === 'Paid' ? 'text-green-600' :
                                                    tx.status === 'Pending' ? 'text-blue-500' :
                                                        'text-yellow-600'
                                                    }`}>
                                                    <span className={`w-2 h-2 rounded-full ${tx.status === 'Paid' ? 'bg-green-600' :
                                                        tx.status === 'Pending' ? 'bg-blue-500' :
                                                            'bg-yellow-600'
                                                        }`}></span>
                                                    {tx.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{tx.description}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{tx.date}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">${tx.amount.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 relative group">
                                                    <Download size={20} />
                                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Download</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="text-gray-400 italic text-center py-8">No transactions found</div>
                )}
            </CollapsibleSection>

            <CollapsibleSection title="Attachments" icon={<Paperclip size={24} />}>
                <div className="text-gray-400 italic">No attachments found</div>
            </CollapsibleSection>
        </div>
    );
};

export default ServiceRequestDetail;
