import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus, Edit, Link2Off, Archive, Trash2, Send, X, AlertTriangle, Loader2 } from 'lucide-react';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import DetailTabs from '../../components/DetailTabs';
import ServiceProProfileSection from './components/ServiceProProfileSection';
import ServiceProTransactionsSection from './components/ServiceProTransactionsSection';
import { serviceProviderService, type BackendServiceProvider } from '../../../../services/service-provider.service';

// Helper function to generate initials from name
const getInitials = (firstName: string, lastName: string): string => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return `${first}${last}`;
};

// Helper function to format phone number with country code
const formatPhoneNumber = (phoneNumber: string, phoneCountryCode?: string | null): string => {
    if (phoneCountryCode) {
        return `${phoneCountryCode} ${phoneNumber}`;
    }
    return phoneNumber;
};

// Helper function to format category with subcategory
const formatCategory = (category: string, subcategory?: string | null): string => {
    if (subcategory) {
        return `${category} / ${subcategory}`;
    }
    return category;
};

// Helper function to format address
const formatAddress = (address: string, city?: string | null, state?: string, zipCode?: string, country?: string): string => {
    const parts = [address];
    if (city) parts.push(city);
    if (state) parts.push(state);
    if (zipCode) parts.push(zipCode);
    if (country) parts.push(country);
    return parts.join(', ');
};

// Transform backend data to component format
const transformServiceProvider = (data: BackendServiceProvider) => {
    const fullName = `${data.firstName}${data.middleName ? ` ${data.middleName}` : ''} ${data.lastName}`.trim();

    return {
        id: data.id,
        initials: getInitials(data.firstName, data.lastName),
        name: fullName,
        phone: formatPhoneNumber(data.phoneNumber, data.phoneCountryCode),
        email: data.email,
        outstanding: 0, // TODO: Calculate from transactions
        deposits: 0, // TODO: Calculate from transactions
        credits: 0, // TODO: Calculate from transactions
        image: data.photoUrl || undefined,
        personalInfo: {
            firstName: data.firstName,
            middleName: data.middleName || '-',
            lastName: data.lastName,
            email: data.email,
            additionalEmail: '-', // TODO: Add support for additional emails
            phone: formatPhoneNumber(data.phoneNumber, data.phoneCountryCode),
            additionalPhone: '-', // TODO: Add support for additional phones
            companyName: data.companyName || '-',
            companyWebsite: data.companyWebsite || '-',
            fax: data.faxNumber || '-',
            category: formatCategory(data.category, data.subcategory)
        },
        forwardingAddress: formatAddress(data.address, data.city, data.state, data.zipCode, data.country)
    };
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
    const [servicePro, setServicePro] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);
    const [documents, setDocuments] = useState<any[]>([]);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
    const actionMenuRef = useRef<HTMLDivElement>(null);

    // Fetch service provider data
    useEffect(() => {
        const fetchServiceProvider = async () => {
            if (!id) {
                setError('Service provider ID is required');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const data = await serviceProviderService.getOne(id);
                setServicePro(transformServiceProvider(data));

                // Fetch documents
                setIsLoadingDocuments(true);
                try {
                    const docs = await serviceProviderService.getDocuments(id);
                    setDocuments(docs);
                } catch (docError) {
                    console.error('Error fetching documents:', docError);
                    // Don't fail the whole page if documents fail to load
                    setDocuments([]);
                } finally {
                    setIsLoadingDocuments(false);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load service provider');
                console.error('Error fetching service provider:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchServiceProvider();
    }, [id]);

    const handleSendConnection = () => {
        setIsConnected(true);
        setIsSendConnectionModalOpen(false);
    };

    const handleDelete = async () => {
        if (!id) return;

        setIsDeleting(true);
        try {
            await serviceProviderService.delete(id);
            navigate('/dashboard/contacts/service-pros');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete service provider');
            console.error('Error deleting service provider:', err);
            setIsDeleteModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleArchive = async () => {
        if (!id || !servicePro) return;

        setIsArchiving(true);
        try {
            await serviceProviderService.update(id, { isActive: false });
            setServicePro({ ...servicePro, isActive: false });
            setIsArchiveModalOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to archive service provider');
            console.error('Error archiving service provider:', err);
            setIsArchiveModalOpen(false);
        } finally {
            setIsArchiving(false);
        }
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

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'transactions', label: 'Transactions' }
    ];

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto min-h-screen font-outfit pb-10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
                    <p className="text-gray-600">Loading service provider...</p>
                </div>
            </div>
        );
    }

    if (error || !servicePro) {
        return (
            <div className="max-w-6xl mx-auto min-h-screen font-outfit pb-10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                    <p className="text-gray-600">{error || 'Service provider not found'}</p>
                    <button
                        onClick={() => navigate('/dashboard/contacts/service-pros')}
                        className="px-6 py-2 bg-[#3A6D6C] text-white rounded-lg hover:bg-[#2c5251] transition-colors"
                    >
                        Back to Service Pros
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Service Pros', path: '/dashboard/contacts/service-pros' },
                    { label: servicePro.name }
                ]}
                className="mb-6"
            />

            <div className="p-4 sm:p-6 bg-[#E0E5E5] min-h-screen rounded-[1.5rem] sm:rounded-[2rem]">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-black">Service Pro</h1>
                    </div>
                    <div className="flex gap-3 flex-wrap w-full sm:w-auto">
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
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            Add Invoice
                            <Plus className="w-4 h-4" />
                        </button>
                        <div className="relative w-full sm:w-auto" ref={actionMenuRef}>
                            <button
                                onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                                className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
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
                                    <button
                                        onClick={() => { setIsArchiveModalOpen(true); setIsActionMenuOpen(false); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors flex items-center gap-2"
                                        disabled={isArchiving}
                                    >
                                        <Archive className="w-4 h-4" />
                                        {isArchiving ? 'Archiving...' : 'Archive'}
                                    </button>
                                    <button
                                        onClick={() => { setIsDeleteModalOpen(true); setIsActionMenuOpen(false); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                        disabled={isDeleting}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className='shadow-lg rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 mb-8 bg-white'>
                    {/* Top Card */}
                    <div className="bg-[#F6F6F8] rounded-[1.5rem] sm:rounded-[2rem] shadow-lg p-4 sm:p-6 mb-8">
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center lg:items-start">
                            {/* Left: Image */}
                            <div className="flex-shrink-0 flex justify-center lg:justify-start w-full lg:w-auto">
                                {servicePro.image ? (
                                    <img src={servicePro.image} alt={servicePro.name} className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] rounded-[2rem] object-cover" />
                                ) : (
                                    <div className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] bg-[#4ad1a6] rounded-[2rem] flex items-center justify-center">
                                        <span className="text-white text-5xl font-medium">{servicePro.initials}</span>
                                    </div>
                                )}
                            </div>

                            {/* Middle: Info + Outstanding Stack */}
                            <div className="flex flex-col gap-2 min-w-full sm:min-w-[280px]">
                                {/* Info Card */}
                                <div className="bg-[#3A6D6C] text-white p-4 rounded-[2rem] text-center shadow-md">
                                    <h2 className="font-bold text-xl mb-1 capitalize">{servicePro.name}</h2>
                                    <p className="text-sm opacity-90 mb-0.5">{servicePro.phone}</p>
                                    <p className="text-sm opacity-90 break-words">{servicePro.email}</p>
                                    <div className="mt-2 text-xs bg-white/20 inline-block px-3 py-1 rounded-full">{servicePro.personalInfo.category}</div>
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
                                <div className="bg-[#7BD747] rounded-[2.5rem] p-5 shadow-inner relative overflow-hidden flex flex-col justify-between h-auto min-h-[140px] sm:min-h-[100px]">
                                    <span className="text-white font-bold text-lg mb-4 sm:mb-0 sm:absolute sm:top-4 sm:left-6">Rentals</span>

                                    <div className="flex flex-col sm:flex-row sm:absolute sm:bottom-4 sm:left-6 sm:right-6 justify-between items-center gap-3 sm:gap-0 p-1 rounded-3xl sm:rounded-full sm:backdrop-blur-sm w-full sm:w-auto">
                                        <div className="bg-[#E8F5E9] px-4 py-2 sm:py-1.5 rounded-full text-xs font-medium text-gray-700 shadow-sm w-full sm:flex-1 text-center sm:mr-2">
                                            Provider Statement
                                        </div>
                                        <button
                                            onClick={() => navigate('/dashboard/reports/statement')}
                                            className="bg-[#3A6D6C] text-white px-5 py-2 sm:py-1.5 rounded-full text-xs font-medium shadow-md hover:bg-[#2c5251] transition-colors w-full sm:w-auto"
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
                        <ServiceProProfileSection servicePro={servicePro} documents={documents} isLoadingDocuments={isLoadingDocuments} />
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
                                        className="flex-1 px-6 py-3 bg-[#545E6B] text-white rounded-lg font-medium hover:bg-[#464f5b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isArchiving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleArchive}
                                        className="flex-1 px-6 py-3 bg-[#3A6D6C] text-white rounded-lg font-medium hover:bg-[#2c5251] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        disabled={isArchiving}
                                    >
                                        {isArchiving && <Loader2 className="w-4 h-4 animate-spin" />}
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
                                        className="flex-1 px-6 py-3 bg-[#545E6B] text-white rounded-lg font-medium hover:bg-[#464f5b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex-1 px-6 py-3 bg-[#FF3B30] text-white rounded-lg font-medium hover:bg-[#d6332a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        disabled={isDeleting}
                                    >
                                        {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
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
