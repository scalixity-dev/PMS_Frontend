import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus, Edit, Link2Off, Archive, Trash2 } from 'lucide-react';
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
    const actionMenuRef = useRef<HTMLDivElement>(null);

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
                                    <button onClick={() => setIsActionMenuOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors flex items-center gap-2">
                                        <Link2Off className="w-4 h-4" />
                                        Remove Connection
                                    </button>
                                    <button onClick={() => setIsActionMenuOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors flex items-center gap-2">
                                        <Archive className="w-4 h-4" />
                                        Archive
                                    </button>
                                    <button onClick={() => setIsActionMenuOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
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
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Service Pro Info */}
                            <div className="flex gap-6 items-start">
                                {/* Image or Initials */}
                                {servicePro.image ? (
                                    <img src={servicePro.image} alt={servicePro.name} className="w-32 h-32 rounded-2xl object-cover" />
                                ) : (
                                    <div className="w-32 h-32 bg-[#4ad1a6] rounded-2xl flex items-center justify-center">
                                        <span className="text-white text-3xl font-medium">{servicePro.initials}</span>
                                    </div>
                                )}

                                <div className="flex flex-col gap-3">
                                    <div className="bg-[#3A6D6C] text-white p-4 rounded-xl text-center min-w-[200px]">
                                        <h2 className="font-bold text-lg">{servicePro.name}</h2>
                                        <p className="text-xs opacity-90">{servicePro.phone}</p>
                                        <p className="text-xs opacity-90">{servicePro.email}</p>
                                    </div>
                                    <button
                                        className="w-full bg-[#C8C8C8] text-gray-700 py-2 rounded-full text-sm font-medium hover:bg-[#b8b8b8] transition-colors shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]"
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </div>

                            {/* Stats & Reports */}
                            <div className="flex-1 flex flex-col justify-between gap-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-[#7BD747] rounded-full px-4 py-3 flex flex-col justify-between h-18 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">
                                        <span className="text-xs font-semibold text-white">Outstanding</span>
                                        <div className="flex justify-between items-center">
                                            <div className="bg-[#E8F5E9] px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">₹{servicePro.outstanding.toLocaleString()}.00</div>
                                            <button className="bg-[#3A6D6C] text-white px-3 py-1 rounded-full text-[10px] font-medium uppercase shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">Received</button>
                                        </div>
                                    </div>
                                    {/* Placeholders to match grid structure if desired, or can be removed. Keeping placeholders for EXACT layout match minus the content values if needed. 
                                        Let's keep them as "Deposits" and "Credits" for now unless user requested removal, 
                                        since "exactly like Tenant Page" implies same grid.
                                    */}
                                    <div className="bg-[#7BD747] rounded-full px-4 py-3 flex flex-col justify-between h-18 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">
                                        <span className="text-xs font-semibold text-white">Deposits</span>
                                        <div className="flex justify-between items-center">
                                            <div className="bg-[#E8F5E9] px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">₹{(servicePro.deposits || 0).toLocaleString()}.00</div>
                                            <button className="bg-[#3A6D6C] text-white px-3 py-1 rounded-full text-[10px] font-medium uppercase shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">Action</button>
                                        </div>
                                    </div>
                                    <div className="bg-[#7BD747] rounded-full px-4 py-3 flex flex-col justify-between h-18 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">
                                        <span className="text-xs font-semibold text-white">Credits</span>
                                        <div className="flex justify-between items-center">
                                            <div className="bg-[#E8F5E9] px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">₹{(servicePro.credits || 0).toLocaleString()}.00</div>
                                            <button className="bg-[#3A6D6C] text-white px-3 py-1 rounded-full text-[10px] font-medium uppercase shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">Action</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#E4E4E4] rounded-[3.5rem] p-4 shadow-lg">
                                    <h3 className="text-gray-700 font-bold mb-2 ml-1">Reports</h3>
                                    <div className="flex gap-4">
                                        <div className="flex-1 bg-[#7BD747] rounded-full px-4 py-3 flex flex-col justify-between min-h-[5rem] shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-white">Financial</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="bg-[#E8F5E9] px-4 py-1 rounded-full text-xs text-gray-600 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">Provider Statement</div>
                                                <button className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-medium uppercase shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">View</button>
                                            </div>
                                        </div>
                                        {/* Notice button might not be needed for provider, but keeping layout consistent. Could be "Send Notice" */}
                                        <div className="flex-1 bg-[#7BD747] rounded-full px-4 py-3 flex flex-col justify-between min-h-[5rem] shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-white">Notice</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="bg-[#E8F5E9] px-4 py-1 rounded-full text-xs text-gray-600 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">Provider Notice</div>
                                                <button className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-medium uppercase shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">Send</button>
                                            </div>
                                        </div>
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
                {activeTab === 'profile' && (
                    <ServiceProProfileSection servicePro={servicePro} />
                )}
                {activeTab === 'transactions' && (
                    <ServiceProTransactionsSection servicePro={servicePro} />
                )}
            </div>
        </div>
    );
};

export default ServiceProsDetail;
