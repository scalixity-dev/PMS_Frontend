import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronDown,
    Loader2,
    PlusCircle,
    Upload
} from 'lucide-react';
import { useGetApplication } from '../../../../hooks/useApplicationQueries';
import AddOccupantModal from './components/AddOccupantModal';
import AddPetModal from './components/AddPetModal';
import AddVehicleModal from './components/AddVehicleModal';
import AddReferenceModal from './components/AddReferenceModal';
import AddResidenceModal from './components/AddResidenceModal';
import { FileText, Trash2 } from 'lucide-react';
import AddIncomeModal from './components/AddIncomeModal';
import AddEmergencyContactModal from './components/AddEmergencyContactModal';
import AddResidenceInfoModal from './components/AddResidenceInfoModal';
import RequestVerificationModal from './components/RequestVerificationModal';
import RequestApplicationFeeModal from './components/RequestApplicationFeeModal';
import DeleteApplicationModal from './components/DeleteApplicationModal';
import DetailTabs from '../../components/DetailTabs';
import CustomTextBox from '../../components/CustomTextBox';

// ... existing imports ...

// Helper for initials
const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

// Helper for color from string
const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
};

// Section Component
const Section = ({
    title,
    onAdd,
    children,
    isEmpty,
    emptyText,
    addButtonLabel,
    secondaryButton
}: {
    title: string;
    onAdd?: () => void;
    children: React.ReactNode;
    isEmpty?: boolean;
    emptyText?: string;
    addButtonLabel?: string;
    secondaryButton?: React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 text-lg font-bold text-black hover:text-gray-700 transition-colors"
                >
                    {title}
                    <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className="flex items-center gap-3">
                    {secondaryButton}
                    {onAdd && (
                        <button
                            onClick={onAdd}
                            className="flex items-center gap-1 bg-white border border-gray-200 text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            {addButtonLabel || 'Add'}
                            <PlusCircle className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {isOpen && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                    {isEmpty ? (
                        <div className="bg-[#F6F6F8] rounded-[1.5rem] p-8 text-center text-gray-500 text-sm font-medium border border-gray-100/50">
                            {emptyText || `No ${title.toLowerCase()} added`}
                        </div>
                    ) : (
                        children
                    )}
                </div>
            )}
        </div>
    );
};

const ApplicationDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Modals State
    const [isOccupantModalOpen, setIsOccupantModalOpen] = useState(false);
    const [isPetModalOpen, setIsPetModalOpen] = useState(false);
    const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
    const [isResidenceModalOpen, setIsResidenceModalOpen] = useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
    const [isResidenceInfoModalOpen, setIsResidenceInfoModalOpen] = useState(false);
    const [isRequestVerificationModalOpen, setIsRequestVerificationModalOpen] = useState(false);
    const [isRequestFeeModalOpen, setIsRequestFeeModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('application');
    const [attachments, setAttachments] = useState<File[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
    const actionDropdownRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionDropdownRef.current && !actionDropdownRef.current.contains(event.target as Node)) {
                setIsActionDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setAttachments(prev => [...prev, file]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const tabs = [
        { id: 'application', label: 'Application' },
        { id: 'income', label: 'Income Verification' }
    ];

    const { data: application, isLoading, error } = useGetApplication(id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                    {error instanceof Error ? error.message : 'Application not found'}
                </div>
                <button onClick={() => navigate(-1)} className="mt-4 text-[#3A6D6C] hover:underline">
                    Go Back
                </button>
            </div>
        );
    }

    // Identify primary applicant
    const primaryApplicant = application.applicants.find(a => a.isPrimary) || application.applicants[0];
    const applicantName = primaryApplicant
        ? `${primaryApplicant.firstName} ${primaryApplicant.middleName || ''} ${primaryApplicant.lastName}`.trim()
        : 'Unknown Applicant';

    return (
        <div className="max-w-6xl mx-auto min-h-screen font-outfit pb-20">
            {/* Breadcrumb - Matches design style */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E5E5] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer">Tenants</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">No.{application.id.substring(0, 8)}</span>
            </div>

            {/* Main Container */}
            <div className="bg-[#E0E5E5] rounded-[2.5rem] p-4 lg:p-8 min-h-screen">

                {/* Header Back Button & ID */}
                <div className="flex items-center gap-2 mb-6">
                    <button onClick={() => navigate(-1)} className="p-1 hover:bg-black/5 rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">No. {application.id}</h1>
                </div>

                <div className="p-4 shadow-lg rounded-[2rem] mb-8">
                    {/* Profile Card */}
                    <div className="bg-[#F6F6F8] rounded-[2rem] shadow-lg p-6 mb-8 flex flex-col lg:flex-row gap-8 items-start">
                        {/* Left: Applicant Info & Image */}
                        <div className="flex gap-6 items-start">
                            <div className="w-32 h-32 flex-shrink-0">
                                {application.imageUrl ? (
                                    <img
                                        src={application.imageUrl}
                                        alt={applicantName}
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-inner"
                                        style={{ backgroundColor: stringToColor(applicantName) }}
                                    >
                                        {getInitials(applicantName)}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="bg-[#3A6D6C] text-white p-4 rounded-xl text-center min-w-[200px]">
                                    <h2 className="font-bold text-lg mb-1">{applicantName}</h2>
                                    <p className="text-[10px] uppercase tracking-wider opacity-80 mb-0.5">VIA INVITATION EMAIL</p>
                                    <p className="text-xs opacity-90 truncate max-w-[180px] mx-auto">{primaryApplicant?.email}</p>
                                </div>
                                <div className="w-full bg-[#C8C8C8] text-gray-700 py-2 rounded-full text-sm font-bold text-center shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                                    Approved
                                </div>
                            </div>
                        </div>

                        {/* Right: Property & Listing Stats */}
                        <div className="flex-1 flex flex-col justify-center bg-[#E4E4E4] p-4 rounded-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                                {/* Property Pill */}
                                <div className="bg-[#7BD747] rounded-full px-6 py-3 flex flex-col justify-center h-24 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">
                                    <span className="text-xs font-semibold text-white mb-2 ml-1">Property</span>
                                    <div className="flex justify-between items-center gap-2">
                                        <div className="bg-[#E8F5E9] px-4 py-1.5 rounded-full text-sm font-bold text-gray-700 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)] flex-1 truncate">
                                            Grand Vie
                                        </div>
                                        <div className="bg-[#3A6D6C] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">
                                            101
                                        </div>
                                    </div>
                                </div>

                                {/* Listing Content Link */}
                                <div className="bg-[#7BD747] rounded-full px-6 py-3 flex flex-col justify-center h-24 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">
                                    <span className="text-xs font-semibold text-white mb-2 ml-1">Listing content</span>
                                    <div className="flex justify-between items-center bg-[#E8F5E9] rounded-full p-1 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">
                                        <div className="px-4 py-0.5 text-sm font-bold text-gray-700">
                                            Yes
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
                    />
                </div>
                {/* Tab Content */}
                {activeTab === 'application' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Section Header */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-[#7CD947] text-white pl-6 pr-2 py-2 rounded-full shadow-sm flex items-center gap-4">
                                <h2 className="text-lg font-bold">Application Details</h2>
                                <div className="relative" ref={actionDropdownRef}>
                                    <button
                                        onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
                                        className="bg-[#3A6D6C] text-white px-6 py-1.5 rounded-full text-xs font-bold hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                                    >
                                        Action
                                        <ChevronDown size={14} className={`transition-transformDuration-200 ${isActionDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isActionDropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                                            <button
                                                onClick={() => {
                                                    setIsRequestFeeModalOpen(true);
                                                    setIsActionDropdownOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                                            >
                                                Request application fee
                                            </button>
                                            <div className="border-b border-gray-100 my-1" />
                                            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                                                Approve application
                                            </button>
                                            <div className="border-b border-gray-100 my-1" />
                                            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                                                In review
                                            </button>
                                            <div className="border-b border-gray-100 my-1" />
                                            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                                                Decline application
                                            </button>
                                            <div className="border-b border-gray-100 my-1" />
                                            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                                                Export application
                                            </button>
                                            <div className="border-b border-gray-100 my-1" />
                                            <button
                                                onClick={() => {
                                                    setIsDeleteModalOpen(true);
                                                    setIsActionDropdownOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 1. Applicant Information */}
                        <Section title="Applicant information">
                            <div className="bg-[#F0F0F6] rounded-[2rem] p-6 lg:p-4 relative overflow-hidden border border-gray-100/50">
                                <div className="flex flex-col md:flex-row gap-8 relative z-10">
                                    {/* Left Column */}
                                    <div className="flex-1 flex flex-col justify-center space-y-4">
                                        <CustomTextBox
                                            label="Date of birth"
                                            value={new Date(primaryApplicant?.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            className="w-full max-w-sm"
                                        />
                                        <CustomTextBox
                                            label="Preferred move-in"
                                            value={new Date(application.moveInDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            className="w-full max-w-sm"
                                        />
                                        <CustomTextBox
                                            label="Short bio"
                                            value="--"
                                            className="w-full max-w-sm"
                                        />
                                    </div>

                                    {/* Right Column (Rent-Income Percentage) */}
                                    <div className="bg-[#3A6D6C] rounded-2xl p-6 text-white min-w-[300px] flex flex-col justify-center shadow-lg">
                                        <h3 className="font-bold text-xl mb-4">Rent-Income Percentage</h3>
                                        <div className="space-y-2">
                                            <div className="text-sm opacity-90 font-medium">£50,000.00 Rent/mo</div>
                                            <div className="text-sm opacity-90 font-medium bg-white/10 px-2 py-1 -mx-2 rounded">£80,000.00 <span className="block text-[10px] opacity-75">Household income</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* 2. Additional Occupants */}
                        <Section
                            title="Additional occupants"
                            onAdd={() => setIsOccupantModalOpen(true)}
                            addButtonLabel="Add co-occupant"
                            isEmpty={application.occupants.length === 0}
                            emptyText="No additional occupants added"
                        >
                            <div className="space-y-3">
                                {application.occupants.map(occ => (
                                    <div key={occ.id} className="bg-[#F6F6F8] rounded-[2rem] p-6 border border-gray-100/50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <CustomTextBox
                                                label="Full name"
                                                value={occ.name || `${occ.firstName} ${occ.lastName}`}
                                                className="w-full"
                                            />
                                            <CustomTextBox
                                                label="Relationship"
                                                value={occ.relationship}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* 3. Pets */}
                        <Section
                            title="Pets"
                            onAdd={() => setIsPetModalOpen(true)}
                            addButtonLabel="Add Pets"
                            isEmpty={application.pets.length === 0}
                            emptyText="No pets added"
                        >
                            <div className="space-y-3">
                                {application.pets.map(pet => (
                                    <div key={pet.id} className="bg-[#F6F6F8] rounded-[2rem] p-6 border border-gray-100/50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <CustomTextBox
                                                label="Pet name"
                                                value={pet.name}
                                                className="w-full"
                                            />
                                            <CustomTextBox
                                                label="Type & Breed"
                                                value={`${pet.type} • ${pet.breed}`}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* 4. Vehicles */}
                        <Section
                            title="Vehicles"
                            onAdd={() => setIsVehicleModalOpen(true)}
                            addButtonLabel="Add Vehicles"
                            isEmpty={application.vehicles.length === 0}
                            emptyText="No vehicles added"
                        >
                            <div className="space-y-3">
                                {application.vehicles.map(v => (
                                    <div key={v.id} className="bg-[#F6F6F8] rounded-[2rem] p-6 border border-gray-100/50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <CustomTextBox
                                                label="Make & Model"
                                                value={`${v.make} ${v.model}`}
                                                className="w-full"
                                            />
                                            <CustomTextBox
                                                label="Color & Plate"
                                                value={`${v.color} • ${v.licensePlate}`}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* 5. Residential History */}
                        <Section
                            title="Residential history"
                            onAdd={() => setIsResidenceModalOpen(true)}
                            addButtonLabel="Add residence"
                            isEmpty={application.residenceHistory.length === 0}
                            emptyText="No residential history added"
                            secondaryButton={
                                <button
                                    onClick={() => setIsResidenceInfoModalOpen(true)}
                                    className="flex items-center gap-1 bg-white border border-gray-200 text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Additional information
                                    <PlusCircle className="w-4 h-4" />
                                </button>
                            }
                        >
                            <div className="space-y-4">
                                {application.residenceHistory.map(res => (
                                    <div key={res.id} className="bg-[#F6F6F8] rounded-[2rem] p-6 border border-gray-100/50">
                                        <div className="space-y-4">
                                            {/* Address & Status Header */}
                                            <CustomTextBox
                                                value={
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-[#D9EFE6] px-4 py-1.5 rounded-full text-[#3A6D6C] font-bold text-xs">
                                                            {res.isCurrent ? 'Current' : 'Previous'}
                                                        </div>
                                                        <div className="text-sm font-bold text-gray-700 truncate">
                                                            {res.address}, {res.city} {res.zipCode}
                                                        </div>
                                                    </div>
                                                }
                                                className="w-fit max-w-full"
                                            />

                                            {/* Grid Details */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <CustomTextBox
                                                    label="Rent or own"
                                                    value={res.residenceType}
                                                    className="w-full"
                                                />
                                                <CustomTextBox
                                                    label="Move in date"
                                                    value={new Date(res.moveInDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    className="w-full"
                                                />
                                                <CustomTextBox
                                                    label="Rent"
                                                    value={res.monthlyRent || '--'}
                                                    className="w-full"
                                                />
                                                <CustomTextBox
                                                    label="Landlord"
                                                    value={res.landlordName || '-'}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* 6. Income History */}
                        <Section
                            title="Income history"
                            onAdd={() => setIsIncomeModalOpen(true)}
                            addButtonLabel="Add income"
                            isEmpty={application.incomeDetails.length === 0}
                            emptyText="No income history added"
                        >
                            <div className="space-y-4">
                                {application.incomeDetails.map(inc => (
                                    <div key={inc.id} className="bg-[#F6F6F8] rounded-[2rem] p-6 border border-gray-100/50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <CustomTextBox
                                                label="Rent or own"
                                                value="Own"
                                                className="w-full"
                                            />
                                            <CustomTextBox
                                                label="Move in date"
                                                value={new Date(inc.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                className="w-full"
                                            />
                                            <CustomTextBox
                                                label="Rent"
                                                value={inc.monthlyIncome}
                                                className="w-full"
                                            />
                                            <CustomTextBox
                                                label="Landlord"
                                                value="-"
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* 7. Contacts */}
                        <Section
                            title="Contacts"
                            onAdd={() => setIsReferenceModalOpen(true)}
                            addButtonLabel="Add reference"
                            isEmpty={application.emergencyContacts.length === 0}
                            emptyText="No contacts added"
                            secondaryButton={
                                <button
                                    onClick={() => setIsContactModalOpen(true)}
                                    className="flex items-center gap-1 bg-white border border-gray-200 text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Emergency Contact
                                    <PlusCircle className="w-4 h-4" />
                                </button>
                            }
                        >
                            <div className="space-y-3">
                                {application.emergencyContacts.map(contact => (
                                    <div key={contact.id} className="bg-[#F6F6F8] rounded-[1.5rem] p-4 flex items-center justify-between border border-gray-100/50">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-gray-500">{contact.contactName}</span>
                                            <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center overflow-hidden">
                                                {/* Avatar placeholder or image */}
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.contactName}`} alt="avatar" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-[#3A6D6C] font-bold text-sm tracking-wide">{contact.phoneNumber}</span>
                                            <span className="text-xs text-gray-500 font-medium">{contact.email}</span>
                                        </div>
                                        <span className="bg-[#8FE165] text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                            {contact.relationship}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* 8. Additional Questions */}
                        <Section title="Additional questions">
                            <div className="space-y-3 bg-[#F6F6F8] rounded-[1.5rem] p-4 justify-between items-center border border-gray-100/50">
                                <CustomTextBox
                                    label="Do you or any occupants smoke?"
                                    value={
                                        <span className="bg-[#8FE165] text-white px-6 py-1 rounded-full !text-sm font-bold">No</span>
                                    }
                                    className="w-full"
                                    labelClassName="w-2/3 whitespace-normal !text-sm font-bold"
                                    valueClassName="w-1/3 flex justify-end"
                                />
                                <CustomTextBox
                                    label="Do you or any occupants smoke?"
                                    value={
                                        <span className="bg-[#8FE165] text-white px-6 py-1 rounded-full !text-sm font-bold">No</span>
                                    }
                                    className="w-full"
                                    labelClassName="w-2/3 whitespace-normal !text-sm font-bold"
                                    valueClassName="w-1/3 flex justify-end"
                                />
                            </div>
                        </Section>

                        {/* 9. Attachments */}
                        <Section
                            title="Attachments"
                            isEmpty={attachments.length === 0}
                            emptyText="No attachments yet"
                            secondaryButton={
                                <>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,image/*"
                                        onChange={handleFileUpload}
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-1 bg-white border border-gray-200 text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        Upload attachment
                                        <Upload className="w-4 h-4" />
                                    </button>
                                </>
                            }
                        >
                            <div className="space-y-3">
                                {attachments.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-[#F6F6F8] p-4 rounded-xl border border-gray-100/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                                                <FileText className="text-[#3A6D6C]" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{file.name}</p>
                                                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeAttachment(index)}
                                            className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* Footer */}
                        <div className="bg-[#F6F6F8] rounded-[1.5rem] p-6 mt-8 mb-8 border border-white/50 text-center">
                            <p className="text-xs font-bold text-gray-800">
                                <span className="font-extrabold">{applicantName}</span> agreed to Terms & Conditions on {new Date(application.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}.
                            </p>
                        </div>
                    </div>
                )}

                {/* Income Tab */}
                {activeTab === 'income' && (
                    <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Section Header */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-[#7CD947] text-white pl-6 pr-2 py-2 rounded-full shadow-sm flex items-center gap-4">
                                <h2 className="text-lg font-bold">Verification Details</h2>
                                <button
                                    onClick={() => setIsRequestVerificationModalOpen(true)}
                                    className="bg-[#3A6D6C] text-white px-6 py-1.5 rounded-full text-xs font-bold hover:bg-[#2c5251] transition-colors shadow-sm"
                                >
                                    Request Verification
                                </button>
                            </div>
                        </div>

                        {/* Content Card */}
                        <div className="bg-[#F0F0F6] rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100/50">
                            <p className="text-gray-700 text-sm font-medium leading-relaxed max-w-3xl">
                                Comprehensive income & employment verification solution using advanced technology to quickly and accurately verify income and detect fraudulent activity, helping you make informed decisions about potential renters.
                            </p>
                            <span className="text-[#84D34C] text-xl font-bold">
                                $12.00
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AddOccupantModal
                isOpen={isOccupantModalOpen}
                onClose={() => setIsOccupantModalOpen(false)}
                onSave={(data) => {
                    console.log('Occupant data:', data);
                    // Implement save logic here
                }}
            />
            <AddPetModal
                isOpen={isPetModalOpen}
                onClose={() => setIsPetModalOpen(false)}
                onSave={(data) => {
                    console.log('Pet data:', data);
                }}
            />
            <AddVehicleModal
                isOpen={isVehicleModalOpen}
                onClose={() => setIsVehicleModalOpen(false)}
                onSave={(data) => {
                    console.log('Vehicle data:', data);
                }}
            />
            <AddResidenceModal
                isOpen={isResidenceModalOpen}
                onClose={() => setIsResidenceModalOpen(false)}
                onSave={(data) => {
                    console.log('Residence data:', data);
                }}
            />
            <AddIncomeModal
                isOpen={isIncomeModalOpen}
                onClose={() => setIsIncomeModalOpen(false)}
                onSave={(data) => {
                    console.log('Income data:', data);
                }}
            />
            <AddEmergencyContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                onSave={(data) => {
                    console.log('Contact data:', data);
                }}
            />
            <AddResidenceInfoModal
                isOpen={isResidenceInfoModalOpen}
                onClose={() => setIsResidenceInfoModalOpen(false)}
                onSave={(info) => {
                    console.log('Additional Residence Info:', info);
                }}
                initialValue={(application as any).additionalResidenceInfo}
            />
            <AddReferenceModal
                isOpen={isReferenceModalOpen}
                onClose={() => setIsReferenceModalOpen(false)}
                onSave={(data) => {
                    console.log('Reference data:', data);
                }}
            />
            <RequestVerificationModal
                isOpen={isRequestVerificationModalOpen}
                onClose={() => setIsRequestVerificationModalOpen(false)}
                onSave={(payer) => {
                    console.log('Verification request payer:', payer);
                    // Add logic to save request
                }}
            />
            <RequestApplicationFeeModal
                isOpen={isRequestFeeModalOpen}
                onClose={() => setIsRequestFeeModalOpen(false)}
                onSend={(amount, currency) => {
                    console.log('Requesting application fee:', { amount, currency });
                }}
            />
            <DeleteApplicationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={() => {
                    console.log('Deleting application...');
                }}
            />
        </div>
    );
};

export default ApplicationDetail;
