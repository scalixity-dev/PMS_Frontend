import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus, Edit, Link2Off, Archive, Trash2, Send, X, AlertTriangle } from 'lucide-react';
import DetailTabs from '../../components/DetailTabs';
import ServiceProProfileSection from './components/ServiceProProfileSection';
import ServiceProTransactionsSection from './components/ServiceProTransactionsSection';

// Mock Data - keyed by Service Pro ID
// Mock Data - keyed by Service Pro ID
const SERVICE_PRO_DETAILS: Record<number, any> = {
    1: {
        id: 1,
        initials: 'SR',
        name: 'sam rao',
        phone: '+91 78965 41236',
        email: 'xyz1234@gmail.com',
        outstanding: 0,
        deposits: 0,
        credits: 0,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
        personalInfo: {
            firstName: 'sam',
            middleName: '-',
            lastName: 'rao',
            email: 'xyz1234@gmail.com',
            additionalEmail: '-',
            phone: '+91 78965 41236',
            additionalPhone: '-',
            companyName: '-',
            companyWebsite: '-',
            fax: '-',
            category: 'Cleaning / Commercial Cleaning Services'
        },
        forwardingAddress: 'Silicon City Main Rd, Indore Division, MP 452012'
    },
    2: {
        id: 2,
        initials: 'VR',
        name: 'vijay rfgdd',
        phone: '+91 70326 59874',
        email: 'vijay.r@example.com',
        outstanding: 5000,
        deposits: 2000,
        credits: 0,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
        personalInfo: {
            firstName: 'vijay',
            middleName: '-',
            lastName: 'rfgdd',
            email: 'vijay.r@example.com',
            additionalEmail: '-',
            phone: '+91 70326 59874',
            additionalPhone: '-',
            companyName: 'Vijay Appraisals',
            companyWebsite: 'www.vijayappraisals.com',
            fax: '-',
            category: 'Appraisal'
        },
        forwardingAddress: '456 Market St, Mumbai, MH 400001'
    },
    3: {
        id: 3,
        initials: 'AB',
        name: 'Alex Brown',
        phone: '+1 555 123 4567',
        email: 'alex.brown@example.com',
        outstanding: 1200,
        deposits: 0,
        credits: 500,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
        personalInfo: {
            firstName: 'Alex',
            middleName: '-',
            lastName: 'Brown',
            email: 'alex.brown@example.com',
            additionalEmail: '-',
            phone: '+1 555 123 4567',
            additionalPhone: '-',
            companyName: 'Brown Plumbing',
            companyWebsite: 'www.brownplumbing.com',
            fax: '+1 555 123 4568',
            category: 'Plumbing Services'
        },
        forwardingAddress: '789 Pipe Lane, New York, NY 10001'
    },
    4: {
        id: 4,
        initials: 'JD',
        name: 'John Doe',
        phone: '+1 555 987 6543',
        email: 'john.doe@example.com',
        outstanding: 0,
        deposits: 1000,
        credits: 0,
        image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=200&h=200',
        personalInfo: {
            firstName: 'John',
            middleName: '-',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            additionalEmail: '-',
            phone: '+1 555 987 6543',
            additionalPhone: '-',
            companyName: 'Doe Electricals',
            companyWebsite: 'www.doeelectricals.com',
            fax: '-',
            category: 'Electrical Services'
        },
        forwardingAddress: '101 Wire St, San Francisco, CA 94105'
    }
};

const ServiceProsDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('profile');
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
    const [isSendConnectionModalOpen, setIsSendConnectionModalOpen] = useState(false);
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const actionMenuRef = useRef<HTMLDivElement>(null);

    const handleSendConnection = () => {
        setIsConnected(true);
        setIsSendConnectionModalOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setIsActionMenuOpen(false);
            }
        };

        if (isActionMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isActionMenuOpen]);

    // Get service pro by ID from route param, fallback to id 1
    const servicePro = SERVICE_PRO_DETAILS[Number(id)] || SERVICE_PRO_DETAILS[1];

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'transactions', label: 'Transactions' }
    ];

    return (
        <div className="max-w-6xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E5E5] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard/contacts/service-pros')}>Service Pros</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">{servicePro.name}</span>
            </div>

            <div className="p-6 bg-[#E0E5E5] min-h-screen rounded-[2rem]">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-black">Service Pro</h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/dashboard/accounting/transactions/expense/add', {
                                state: {
                                    prefilledPayer: {
                                        id: servicePro.id,
                                        label: servicePro.name,
                                        type: 'service_pro'
                                    }
                                }
                            })}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2"
                        >
                            Add Invoice
                            <Plus className="w-4 h-4" />
                        </button>
                        <div className="relative" ref={actionMenuRef}>
                            <button
                                onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                                className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2"
                            >
                                Action
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform duration-200 ${isActionMenuOpen ? 'rotate-180' : ''}`}>
                                    <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            {isActionMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-10 overflow-hidden">
                                    <button onClick={() => navigate(`/dashboard/contacts/service-pros/edit/${id}`)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors flex items-center gap-2">
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    {isConnected ? (
                                        <button onClick={() => { setIsConnected(false); setIsActionMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors flex items-center gap-2">
                                            <Link2Off className="w-4 h-4" />
                                            Remove Connection
                                        </button>
                                    ) : (
                                        <button onClick={() => { setIsSendConnectionModalOpen(true); setIsActionMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors flex items-center gap-2">
                                            <Send className="w-4 h-4" />
                                            Send Connection
                                        </button>
                                    )}
                                    <button onClick={() => { setIsArchiveModalOpen(true); setIsActionMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors flex items-center gap-2">
                                        <Archive className="w-4 h-4" />
                                        Archive
                                    </button>
                                    <button onClick={() => { setIsDeleteModalOpen(true); setIsActionMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className='shadow-lg rounded-[2rem] p-6 mb-8'>
                    {/* Top Card */}
                    <div className="bg-[#F6F6F8] rounded-[2rem] shadow-lg p-6 mb-8">
                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            {/* Left: Image */}
                            <div className="flex-shrink-0">
                                {servicePro.image ? (
                                    <img src={servicePro.image} alt={servicePro.name} className="w-[250px] h-[250px] rounded-[2rem] object-cover" />
                                ) : (
                                    <div className="w-[250px] h-[250px] bg-[#4ad1a6] rounded-[2rem] flex items-center justify-center">
                                        <span className="text-white text-5xl font-medium">{servicePro.initials}</span>
                                    </div>
                                )}
                            </div>

                            {/* Middle: Info + Outstanding Stack */}
                            <div className="flex flex-col gap-2 min-w-[280px]">
                                {/* Info Card */}
                                <div className="bg-[#3A6D6C] text-white p-4 rounded-[2rem] text-center shadow-md">
                                    <h2 className="font-bold text-xl mb-1 capitalize">{servicePro.name}</h2>
                                    <p className="text-sm opacity-90 mb-0.5">{servicePro.phone}</p>
                                    <p className="text-sm opacity-90">{servicePro.email}</p>
                                </div>

                                {/* View Profile Button */}
                                <button className="w-full bg-[#C8C8C8] text-gray-800 py-2.5 rounded-full text-sm font-semibold hover:bg-[#b8b8b8] transition-colors shadow-inner">
                                    View Profile
                                </button>

                                {/* Outstanding Card */}
                                <div className="bg-[#7BD747] rounded-[2rem] px-6 py-3 flex flex-col items-center justify-center gap-2 shadow-md">
                                    <span className="text-sm font-bold text-white">Outstanding</span>
                                    <div className="bg-[#E8F5E9] px-6 py-2 rounded-full text-sm font-bold text-gray-700 shadow-inner w-full text-center">
                                        ₹{servicePro.outstanding.toLocaleString()}.00
                                    </div>
                                </div>
                            </div>

                            {/* Right: Reports */}
                            <div className="flex-1 bg-[#E4E4E4] rounded-[2.5rem] p-6 shadow-lg h-full self-stretch">
                                <h3 className="text-gray-700 font-bold mb-4 ml-1 text-lg">Reports</h3>
                                <div className="bg-[#7BD747] rounded-[2.5rem] p-5 flex items-center justify-between gap-4 shadow-inner relative overflow-hidden h-[100px]">
                                    {/* Green background container for the report item */}
                                    {/* Based on screenshot, "Rentals" text is in top left, pills bottom right */}
                                    <span className="absolute top-4 left-6 text-white font-bold text-lg">Rentals</span>

                                    <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center p-1 rounded-full backdrop-blur-sm">
                                        <div className="bg-[#E8F5E9] px-4 py-1.5 rounded-full text-xs font-medium text-gray-700 shadow-sm flex-1 text-center mr-2">
                                            Provider Statement
                                        </div>
                                        <button
                                            onClick={() => navigate('/dashboard/reports/statement')}
                                            className="bg-[#3A6D6C] text-white px-5 py-1.5 rounded-full text-xs font-medium shadow-md hover:bg-[#2c5251] transition-colors"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Tabs */}
                    <DetailTabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        className="mb-2"
                    />
                </div>

                {/* Tab Content */}
                {
                    activeTab === 'profile' && (
                        <ServiceProProfileSection servicePro={servicePro} />
                    )
                }
                {
                    activeTab === 'transactions' && (
                        <ServiceProTransactionsSection servicePro={servicePro} />
                    )
                }
            </div >

            {/* Send Connection Modal */}
            {
                isSendConnectionModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
                            {/* Header */}
                            <div className="bg-[#3A6D6C] px-6 py-4 flex justify-between items-center">
                                <h3 className="text-white text-lg font-medium">Send connection</h3>
                                <button onClick={() => setIsSendConnectionModalOpen(false)} className="text-white hover:bg-white/10 p-1 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="mb-8">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email*</label>
                                    <input
                                        type="email"
                                        placeholder="Enter email address"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3A6D6C]"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsSendConnectionModalOpen(false)}
                                        className="flex-1 px-6 py-3 bg-[#545E6B] text-white rounded-lg font-medium hover:bg-[#464f5b] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSendConnection}
                                        className="flex-1 px-6 py-3 bg-[#3A6D6C] text-white rounded-lg font-medium hover:bg-[#2c5251] transition-colors"
                                    >
                                        Send request
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Archive Modal */}
            {
                isArchiveModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
                            {/* Header */}
                            <div className="bg-[#3A6D6C] px-6 py-4 flex justify-between items-center">
                                <h3 className="text-white text-lg font-medium">You're about to archive this service pro</h3>
                                <button onClick={() => setIsArchiveModalOpen(false)} className="text-white hover:bg-white/10 p-1 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-gray-700 font-medium mb-8">Are you sure you want to archive the service pro?</p>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsArchiveModalOpen(false)}
                                        className="flex-1 px-6 py-3 bg-[#545E6B] text-white rounded-lg font-medium hover:bg-[#464f5b] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => setIsArchiveModalOpen(false)}
                                        className="flex-1 px-6 py-3 bg-[#3A6D6C] text-white rounded-lg font-medium hover:bg-[#2c5251] transition-colors"
                                    >
                                        Yes I'm Sure
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Delete Modal */}
            {
                isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
                            {/* Header */}
                            <div className="bg-[#3A6D6C] px-6 py-4 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-white">
                                    <AlertTriangle className="w-6 h-6" />
                                    <h3 className="text-lg font-medium">Are you sure you want to delete it?</h3>
                                </div>
                                <button onClick={() => setIsDeleteModalOpen(false)} className="text-white hover:bg-white/10 p-1 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-gray-700 font-medium mb-8">
                                    Are you sure you want to delete it? Service pro will be removed from all assigned maintenance requests and all related transactions will be deleted!
                                </p>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="flex-1 px-6 py-3 bg-[#545E6B] text-white rounded-lg font-medium hover:bg-[#464f5b] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="flex-1 px-6 py-3 bg-[#FF3B30] text-white rounded-lg font-medium hover:bg-[#d6332a] transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ServiceProsDetail;
