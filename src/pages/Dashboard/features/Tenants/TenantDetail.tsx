import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import DetailTabs from '../../components/DetailTabs';
import CustomTextBox from '../../components/CustomTextBox';
import TenantProfileSection from './components/TenantProfileSection';
import TenantLeasesSection from './components/TenantLeasesSection';
import TenantTransactionsSection from './components/TenantTransactionsSection';
import TenantInsuranceSection from './components/TenantInsuranceSection';
import TenantApplicationsSection from './components/TenantApplicationsSection';
import TenantRequestsSection from './components/TenantRequestsSection';

// Mock Data - keyed by tenant ID
const TENANT_DETAILS: Record<number, any> = {
    1: {
        id: 1,
        name: 'Anjali Vyas',
        phone: '+91 8569325417',
        email: 'Anjli57474@gmail.com',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
        outstanding: 45000,
        deposits: 45000,
        credits: 45000,
        personalInfo: {
            firstName: 'Jay',
            middleName: 'Kumar',
            lastName: 'Rai',
            email: '-',
            additionalEmail: '-',
            phone: '+91 78546 21026',
            additionalPhone: '-',
            companyName: 'Clever Monts',
            dateOfBirth: 'dd/mm/yy',
            companyName2: '-'
        },
        forwardingAddress: 'Silicon City Main Rd, Indore Division, MP 452012',
        emergencyContacts: [
            { name: 'Jay', relationship: 'bro', email: '-', phone: '+91 78546 21026' }
        ],
        pets: [
            { name: 'Tommy', type: 'Dog', weight: '5', breed: 'german' }
        ],
        vehicles: [
            { type: 'Automobile', make: 'as', registeredIn: 'mp', year: '2021', color: 'red', license: '123641' }
        ]
    },
    2: {
        id: 2,
        name: 'Rahul Sharma',
        phone: '+91 9876543210',
        email: 'rahul.sharma@example.com',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
        outstanding: 32000,
        deposits: 40000,
        credits: 28000,
        personalInfo: {
            firstName: 'Rahul',
            middleName: 'Kumar',
            lastName: 'Sharma',
            email: 'rahul.sharma@example.com',
            additionalEmail: '-',
            phone: '+91 9876543210',
            additionalPhone: '-',
            companyName: 'Tech Solutions',
            dateOfBirth: '15/08/1990',
            companyName2: '-'
        },
        forwardingAddress: 'Tech Park, Bangalore, Karnataka 560001',
        emergencyContacts: [
            { name: 'Priya Sharma', relationship: 'spouse', email: 'priya@example.com', phone: '+91 9876543211' }
        ],
        pets: [],
        vehicles: [
            { type: 'Car', make: 'Honda', registeredIn: 'KA', year: '2020', color: 'silver', license: 'KA01AB1234' }
        ]
    },
    3: {
        id: 3,
        name: 'Priya Patel',
        phone: '+91 7890123456',
        email: 'priya.patel@example.com',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200',
        outstanding: 0,
        deposits: 50000,
        credits: 15000,
        personalInfo: {
            firstName: 'Priya',
            middleName: '',
            lastName: 'Patel',
            email: 'priya.patel@example.com',
            additionalEmail: 'priya.work@example.com',
            phone: '+91 7890123456',
            additionalPhone: '+91 7890123457',
            companyName: 'Design Studio',
            dateOfBirth: '22/03/1992',
            companyName2: '-'
        },
        forwardingAddress: 'MG Road, Pune, Maharashtra 411001',
        emergencyContacts: [
            { name: 'Amit Patel', relationship: 'brother', email: 'amit@example.com', phone: '+91 7890123458' }
        ],
        pets: [
            { name: 'Milo', type: 'Cat', weight: '3', breed: 'persian' }
        ],
        vehicles: []
    },
    4: {
        id: 4,
        name: 'Arjun Mehta',
        phone: '+91 6543210987',
        email: 'arjun.mehta@example.com',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
        outstanding: 18000,
        deposits: 35000,
        credits: 22000,
        personalInfo: {
            firstName: 'Arjun',
            middleName: 'Singh',
            lastName: 'Mehta',
            email: 'arjun.mehta@example.com',
            additionalEmail: '-',
            phone: '+91 6543210987',
            additionalPhone: '-',
            companyName: 'Finance Corp',
            dateOfBirth: '10/12/1988',
            companyName2: '-'
        },
        forwardingAddress: 'Connaught Place, New Delhi, Delhi 110001',
        emergencyContacts: [
            { name: 'Neha Mehta', relationship: 'sister', email: 'neha@example.com', phone: '+91 6543210988' }
        ],
        pets: [
            { name: 'Max', type: 'Dog', weight: '8', breed: 'labrador' }
        ],
        vehicles: [
            { type: 'Motorcycle', make: 'Royal Enfield', registeredIn: 'DL', year: '2019', color: 'black', license: 'DL02XY5678' }
        ]
    }
};

const TenantDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('profile');

    // Get tenant by ID from route param, fallback to tenant 1
    const tenant = TENANT_DETAILS[Number(id)] || TENANT_DETAILS[1];

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'leases', label: 'Leases' },
        { id: 'transactions', label: 'Transactions' },
        { id: 'insurance', label: 'Insurance' },
        { id: 'applications', label: 'Applications' },
        { id: 'requests', label: 'Requests' }
    ];

    return (
        <div className="max-w-6xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E5E5] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard/contacts/tenants')}>Tenants</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">{tenant.name}</span>
            </div>

            <div className="p-6 bg-[#E0E5E5] min-h-screen rounded-[2rem]">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-black">Tenant</h1>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2">
                            Add Invoice
                            <Plus className="w-4 h-4" />
                        </button>
                        <button className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors">
                            Action
                        </button>
                    </div>
                </div>

                <div className='shadow-lg rounded-[2rem] p-6 mb-8'>
                    {/* Top Card */}
                    <div className="bg-[#F6F6F8] rounded-[2rem] shadow-lg p-6 mb-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Tenant Info */}
                            <div className="flex gap-6 items-start">
                                <img src={tenant.image} alt={tenant.name} className="w-32 h-32 rounded-2xl object-cover" />
                                <div className="flex flex-col gap-3">
                                    <div className="bg-[#3A6D6C] text-white p-4 rounded-xl text-center min-w-[200px]">
                                        <h2 className="font-bold text-lg">{tenant.name}</h2>
                                        <p className="text-xs opacity-90">{tenant.phone}</p>
                                        <p className="text-xs opacity-90">{tenant.email}</p>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/dashboard/contacts/tenants/${tenant.id}/profile`)}
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
                                            <div className="bg-[#E8F5E9] px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">₹{tenant.outstanding.toLocaleString()}.00</div>
                                            <button className="bg-[#3A6D6C] text-white px-3 py-1 rounded-full text-[10px] font-medium uppercase shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">Received</button>
                                        </div>
                                    </div>
                                    <div className="bg-[#7BD747] rounded-full px-4 py-3 flex flex-col justify-between h-18 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">
                                        <span className="text-xs font-semibold text-white">Deposits</span>
                                        <div className="flex justify-between items-center">
                                            <div className="bg-[#E8F5E9] px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">₹{tenant.deposits.toLocaleString()}.00</div>
                                            <button className="bg-[#3A6D6C] text-white px-3 py-1 rounded-full text-[10px] font-medium uppercase shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">Action</button>
                                        </div>
                                    </div>
                                    <div className="bg-[#7BD747] rounded-full px-4 py-3 flex flex-col justify-between h-18 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">
                                        <span className="text-xs font-semibold text-white">Credits</span>
                                        <div className="flex justify-between items-center">
                                            <div className="bg-[#E8F5E9] px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">₹{tenant.credits.toLocaleString()}.00</div>
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
                                                <div className="bg-[#E8F5E9] px-4 py-1 rounded-full text-xs text-gray-600 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">Tenant Statement</div>
                                                <button className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-medium uppercase shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">View</button>
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-[#7BD747] rounded-full px-4 py-3 flex flex-col justify-between min-h-[5rem] shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-white">Notice</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="bg-[#E8F5E9] px-4 py-1 rounded-full text-xs text-gray-600 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">Tenant Notice</div>
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
                    <TenantProfileSection tenant={tenant} />
                )}
                {activeTab === 'leases' && (
                    <TenantLeasesSection tenant={tenant} />
                )}
                {activeTab === 'transactions' && (
                    <TenantTransactionsSection tenant={tenant} />
                )}
                {activeTab === 'insurance' && (
                    <TenantInsuranceSection tenant={tenant} />
                )}
                {activeTab === 'applications' && (
                    <TenantApplicationsSection tenant={tenant} />
                )}
                {activeTab === 'requests' && (
                    <TenantRequestsSection tenant={tenant} />
                )}
            </div>
        </div>
    );
};

export default TenantDetail;
