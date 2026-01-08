import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronDown,
    ChevronUp,
    User,
    Users,
    PawPrint,
    Car,
    Home,
    Briefcase,
    Contact,
    HelpCircle,
    Paperclip,
    ExternalLink,
    Info
} from 'lucide-react';

interface ApplicationData {
    id: string;
    applicationNumber: string;
    applicantName: string;
    phone: string;
    email: string;
    status: 'Approved' | 'Pending' | 'Rejected' | 'Submitted';
    propertyName: string;
    listingContact: string;
    applicantInfo: {
        hasDetails: boolean;
        dateOfBirth: string;
        preferredMoveIn: string;
        shortBio: string;
        rentPerMonth: number;
        householdIncome: number;
    };
    additionalOccupants: number;
    pets: number;
    vehicles: number;
    residentialHistory: number;
    residentialHistoryData: Array<{
        id: number;
        address: string;
        location: string;
        status: 'Current' | 'Previous';
        rentOrOwn: string;
        moveInDate: string;
        moveOutDate: string;
        rent: number;
        landlord: {
            name: string;
            initials: string;
        };
    }>;
    incomeHistory: number;
    incomeHistoryData: Array<{
        id: number;
        jobTitle: string;
        company: string;
        status: 'Current' | 'Previous';
        type: string;
        startDate: string;
        address: string;
        incomePerMonth: number;
        officeNumber: string;
        workPhone: string;
    }>;
    contacts: number;
    additionalQuestions: {
        smoke: string;
        military: string;
        crime: string;
        bankruptcy: string;
        refusedRent: string;
        evicted: string;
    };
    attachments: number;
    termsAccepted: {
        date: string;
    };
}

const ApplicationDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Mock data - in real app, this would come from API
    const [application] = useState<ApplicationData>(() => {
        const localApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
        const foundApp = localApps.find((app: any) => String(app.id) === id);

        if (foundApp) {
            return {
                id: String(foundApp.id),
                applicationNumber: String(foundApp.id).slice(-7),
                applicantName: foundApp.name,
                phone: foundApp.phone,
                email: 'user@example.com', // Placeholder or use store
                status: foundApp.status,
                propertyName: 'Grand Villa',
                listingContact: 'Ashendra Sharma',
                applicantInfo: {
                    hasDetails: true,
                    dateOfBirth: '12 Jan, 1995',
                    preferredMoveIn: foundApp.appliedDate,
                    shortBio: 'I am looking for a peaceful residence.',
                    rentPerMonth: 45000,
                    householdIncome: 500000,
                },
                additionalOccupants: 0,
                pets: 0,
                vehicles: 0,
                residentialHistory: 1,
                residentialHistoryData: [
                    {
                        id: 1,
                        address: foundApp.address,
                        location: 'Current Address',
                        status: 'Current',
                        rentOrOwn: 'Rent',
                        moveInDate: '01 Jan, 2023',
                        moveOutDate: '—',
                        rent: 25000,
                        landlord: {
                            name: 'Inderjeet Singh',
                            initials: 'IS',
                        },
                    },
                ],
                incomeHistory: 1,
                incomeHistoryData: [
                    {
                        id: 1,
                        jobTitle: 'Senior Developer',
                        company: 'Tech Solutions',
                        status: 'Current',
                        type: 'Full-time',
                        startDate: '01 June, 2021',
                        address: 'Business Park, City',
                        incomePerMonth: 150000,
                        officeNumber: '—',
                        workPhone: '—',
                    },
                ],
                contacts: 1,
                additionalQuestions: {
                    smoke: 'No',
                    military: 'No',
                    crime: 'No',
                    bankruptcy: 'No',
                    refusedRent: 'No',
                    evicted: 'No',
                },
                attachments: 1,
                termsAccepted: {
                    date: foundApp.appliedDate,
                },
            };
        }

        // Default mock data
        return {
            id: id || '1771890',
            applicationNumber: '1771890',
            applicantName: 'Siddak Bagga',
            phone: '+91 88395 86908',
            email: 'siddak77777@gmail.com',
            status: 'Approved',
            propertyName: 'Grand Villa',
            listingContact: 'Ashendra Sharma',
            applicantInfo: {
                hasDetails: true,
                dateOfBirth: '—',
                preferredMoveIn: '—',
                shortBio: '—',
                rentPerMonth: 45000,
                householdIncome: 500000,
            },
            additionalOccupants: 0,
            pets: 0,
            vehicles: 0,
            residentialHistory: 1,
            residentialHistoryData: [
                {
                    id: 1,
                    address: 'Indore Bypass Rd, Indore Division, MP 452007, IN',
                    location: 'Indore Bypass Rd',
                    status: 'Current',
                    rentOrOwn: 'Rent',
                    moveInDate: '15 Dec, 2025',
                    moveOutDate: '—',
                    rent: 50000,
                    landlord: {
                        name: 'Siddak Bagga',
                        initials: 'SB',
                    },
                },
            ],
            incomeHistory: 1,
            incomeHistoryData: [
                {
                    id: 1,
                    jobTitle: 'CEO',
                    company: 'Maza aa Gaya',
                    status: 'Current',
                    type: 'Full-time',
                    startDate: '—',
                    address: 'Indore Bypass Rd, Indore Division, MP 452007, IN',
                    incomePerMonth: 500000,
                    officeNumber: '—',
                    workPhone: '—',
                },
            ],
            contacts: 1,
            additionalQuestions: {
                smoke: 'Yes',
                military: 'No',
                crime: 'No',
                bankruptcy: 'No',
                refusedRent: 'No',
                evicted: 'No',
            },
            attachments: 0,
            termsAccepted: {
                date: '15 Dec, 2025',
            },
        };
    });

    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        applicantInfo: application.applicantInfo.hasDetails,
        additionalOccupants: application.additionalOccupants > 0,
        pets: application.pets > 0,
        vehicles: application.vehicles > 0,
        residentialHistory: application.residentialHistory > 0,
        incomeHistory: application.incomeHistory > 0,
        contacts: application.contacts > 0,
        additionalQuestions: true,
        attachments: application.attachments > 0,
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved':
                return 'bg-[#DCFCE7] text-[#16A34A]';
            case 'Submitted':
                return 'bg-[#FFF3E0] text-[#F57C00]';
            case 'Rejected':
                return 'bg-red-100 text-red-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const applicationSections = [
        {
            id: 'applicantInfo',
            icon: User,
            title: 'Applicant information',
            subtitle: application.applicantInfo.hasDetails ? '(Details)' : '(0 records)',
            recordCount: application.applicantInfo.hasDetails ? 1 : 0,
            primaryAction: 'Edit',
            secondaryActions: [],
        },
        {
            id: 'additionalOccupants',
            icon: Users,
            title: 'Additional occupants',
            subtitle: `(${application.additionalOccupants} records)`,
            recordCount: application.additionalOccupants,
            primaryAction: '+ Add occupant',
            secondaryActions: [],
        },
        {
            id: 'pets',
            icon: PawPrint,
            title: 'Pets',
            subtitle: `(${application.pets} records)`,
            recordCount: application.pets,
            primaryAction: '+ Add pet',
            secondaryActions: [],
        },
        {
            id: 'vehicles',
            icon: Car,
            title: 'Vehicles',
            subtitle: `(${application.vehicles} records)`,
            recordCount: application.vehicles,
            primaryAction: '+ Add vehicle',
            secondaryActions: [],
        },
        {
            id: 'residentialHistory',
            icon: Home,
            title: 'Residential history',
            subtitle: `(${application.residentialHistory} record)`,
            recordCount: application.residentialHistory,
            primaryAction: '+ Add residence',
            secondaryActions: ['+ Add additional information'],
        },
        {
            id: 'incomeHistory',
            icon: Briefcase,
            title: 'Income history',
            subtitle: `(${application.incomeHistory} record)`,
            recordCount: application.incomeHistory,
            primaryAction: '+ Add income',
            secondaryActions: ['+ Add additional information'],
        },
        {
            id: 'contacts',
            icon: Contact,
            title: 'Contacts',
            subtitle: `(${application.contacts} record)`,
            recordCount: application.contacts,
            primaryAction: '+ Add reference',
            secondaryActions: ['+ Add emergency contact'],
        },
    ];

    return (
        <div className="flex flex-col gap-6 w-full min-h-screen bg-white p-4 lg:p-8">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-base font-medium">
                    <li>
                        <Link
                            to="/userdashboard"
                            className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity"
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">
                        /
                    </li>
                    <li>
                        <Link
                            to="/userdashboard/applications"
                            className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity"
                        >
                            Applications
                        </Link>
                    </li>
                    <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">
                        /
                    </li>
                    <li className="text-[#1A1A1A] font-medium" aria-current="page">
                        No.{application.applicationNumber}
                    </li>
                </ol>
            </nav>

            <div className="max-w-7xl mx-auto w-full space-y-6">
                {/* Main Card */}
                <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="px-2 py-2 border-b border-[#E5E7EB] flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ChevronLeft size={24} className="text-gray-900" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-900">No.{application.applicationNumber}</h1>
                        </div>
                    </div>

                    <div className="p-8 space-y-6">
                        {/* Applicant Information Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
                                <div className="p-1 rounded-full border border-gray-900">
                                    <User size={16} className="text-gray-900" />
                                </div>
                                <span>Applicant</span>
                            </div>

                            <div className="flex items-start justify-between pl-1">
                                <div className="flex items-center gap-4">
                                    {/* Profile Image */}
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md overflow-hidden bg-gray-100">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${application.applicantName}`}
                                            alt={application.applicantName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <p className="text-xl font-semibold text-gray-900">
                                                {application.applicantName}
                                            </p>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                                                    application.status
                                                )}`}
                                            >
                                                {application.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <a
                                                href={`tel:${application.phone}`}
                                                className="text-gray-500 font-medium hover:opacity-80 transition-opacity"
                                            >
                                                {application.phone}
                                            </a>
                                            <a
                                                href={`mailto:${application.email}`}
                                                className="text-gray-500 font-medium hover:opacity-80 transition-opacity"
                                            >
                                                {application.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Property */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-600 font-medium text-sm">
                                <div className="p-1 rounded-full border border-gray-900">
                                    <Home size={16} className="text-gray-900" />
                                </div>
                                <span>Property</span>
                            </div>
                            <div className="pl-1">
                                <p className="text-xl font-semibold text-gray-900">{application.propertyName}</p>
                            </div>
                        </div>

                        {/* Listing Contact */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-600 font-medium text-md">
                                <div className="p-1 rounded-full border border-gray-900">
                                    <User size={16} className="text-gray-900" />
                                </div>
                                <span>Listing contact</span>
                            </div>
                            <div className="pl-1">
                                <p className="text-xl font-semibold text-gray-900">{application.listingContact}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="border-b border-[#F1F1F1]">
                    <div className="flex flex-wrap gap-4">
                        <button className="px-4 py-2 font-semibold text-[15px] transition-all relative text-white bg-[#7ED957] rounded-t-lg -mb-[1px]">
                            Application
                            <div className="absolute -bottom-4 left-0 right-0 h-4 bg-[#7ED957] blur-lg opacity-20 -z-10"></div>
                        </button>
                    </div>
                </div>

                {/* Application Details Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Application details</h2>

                    {applicationSections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <div
                                key={section.id}
                                className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden"
                            >
                                <div
                                    className="px-6 py-4 flex items-center justify-between cursor-pointer  transition-colors"
                                    onClick={() => toggleSection(section.id)}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <Icon size={20} className="text-gray-500" />
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {section.title} <span className="text-gray-400 text-sm font-medium ml-2">{section.subtitle}</span>
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {section.primaryAction && (
                                            <button
                                                className="text-[#7ED957] text-sm font-semibold hover:opacity-80 transition-opacity"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {section.primaryAction}
                                            </button>
                                        )}
                                        {section.secondaryActions.map((action, idx) => (
                                            <button
                                                key={idx}
                                                className="text-[#7ED957] text-sm font-semibold hover:opacity-80 transition-opacity"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {action}
                                            </button>
                                        ))}
                                        <div className="p-1">
                                            {expandedSections[section.id] ? (
                                                <ChevronUp size={20} className="text-gray-500" />
                                            ) : (
                                                <ChevronDown size={20} className="text-gray-500" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {expandedSections[section.id] && (
                                    <div className="px-6 pb-6 border-t border-[#E5E7EB]">
                                        <div className="pt-4">
                                            {section.id === 'applicantInfo' && section.recordCount > 0 ? (
                                                <div className="flex items-start justify-between gap-8">
                                                    <div className="flex-1 space-y-4">
                                                        <div className="flex items-center gap-8 py-2">
                                                            <span className="text-gray-900 font-medium">Date of birth</span>
                                                            <span className="text-gray-900 font-normal">{application.applicantInfo.dateOfBirth}</span>
                                                        </div>
                                                        <div className="flex items-center gap-8 py-2">
                                                            <span className="text-gray-900 font-medium">Preferred move-in</span>
                                                            <span className="text-gray-900 font-normal">{application.applicantInfo.preferredMoveIn}</span>
                                                        </div>
                                                        <div className="py-2">
                                                            <p className="text-gray-900 font-medium mb-2">Short bio</p>
                                                            <p className="text-gray-900 font-normal">{application.applicantInfo.shortBio}</p>
                                                        </div>
                                                    </div>

                                                    {/* Rent-Income Percentage Card */}
                                                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-w-[280px]">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h3 className="text-gray-900 font-semibold text-base">Rent-Income Percentage</h3>
                                                            <Info size={18} className="text-gray-400" />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <p className="text-2xl font-semibold text-gray-900">₹{application.applicantInfo.rentPerMonth.toLocaleString('en-IN')}.00</p>
                                                                    <p className="text-gray-500 text-sm font-medium">Rent/mo</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-2xl font-semibold text-gray-900">₹{application.applicantInfo.householdIncome.toLocaleString('en-IN')}.00</p>
                                                                    <p className="text-gray-500 text-sm font-medium">Household Income</p>
                                                                </div>
                                                            </div>

                                                            {/* Circular Progress */}
                                                            {(() => {
                                                                const rentIncomeRatio = application.applicantInfo.householdIncome > 0
                                                                    ? application.applicantInfo.rentPerMonth / application.applicantInfo.householdIncome
                                                                    : 0;
                                                                const percentage = Math.round(rentIncomeRatio * 100);
                                                                const circumference = 2 * Math.PI * 40;
                                                                const strokeDashoffset = circumference * (1 - rentIncomeRatio);

                                                                return (
                                                                    <div className="relative w-24 h-24">
                                                                        <svg className="w-24 h-24 transform -rotate-90">
                                                                            <circle
                                                                                cx="48"
                                                                                cy="48"
                                                                                r="40"
                                                                                stroke="#E5E7EB"
                                                                                strokeWidth="8"
                                                                                fill="none"
                                                                            />
                                                                            <circle
                                                                                cx="48"
                                                                                cy="48"
                                                                                r="40"
                                                                                stroke="#7ED957"
                                                                                strokeWidth="8"
                                                                                fill="none"
                                                                                strokeDasharray={circumference}
                                                                                strokeDashoffset={strokeDashoffset}
                                                                                strokeLinecap="round"
                                                                            />
                                                                        </svg>
                                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                                            <span className="text-xl font-bold text-[#7ED957]">
                                                                                {application.applicantInfo.householdIncome > 0 ? `${percentage}%` : 'N/A'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : section.id === 'residentialHistory' && section.recordCount > 0 ? (
                                                <div className="space-y-4">
                                                    {application.residentialHistoryData.map((residence) => (
                                                        <div key={residence.id} className="bg-[#FAFAFA] rounded-lg border border-gray-200 p-5 space-y-4">
                                                            {/* Address Header */}
                                                            <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-200">
                                                                <h4 className="text-base font-semibold text-gray-900">{residence.address}</h4>
                                                                {residence.status === 'Current' && (
                                                                    <span className="px-2.5 py-1 bg-[#DCFCE7] text-[#16A34A] rounded-md text-xs font-semibold whitespace-nowrap">
                                                                        {residence.status}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Details - Two Column Layout */}
                                                            <div className="space-y-3">
                                                                <div className="flex items-center gap-16">
                                                                    <div className="flex-1">
                                                                        <span className="text-gray-900 font-medium text-sm">Rent or own</span>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <span className="text-gray-900 font-normal text-sm">{residence.rentOrOwn}</span>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <span className="text-gray-900 font-medium text-sm">Move in date</span>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <span className="text-gray-900 font-normal text-sm">{residence.moveInDate}</span>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-16">
                                                                    <div className="flex-1">
                                                                        <span className="text-gray-900 font-medium text-sm">Rent</span>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <span className="text-gray-900 font-normal text-sm">₹{residence.rent.toLocaleString('en-IN')}.00</span>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <span className="text-gray-900 font-medium text-sm">Move out date</span>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <span className="text-gray-900 font-normal text-sm">{residence.moveOutDate}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Landlord */}
                                                            <div className="pt-3 border-t border-gray-200">
                                                                <p className="text-gray-900 font-medium text-sm mb-2">Landlord</p>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-9 h-9 rounded-full bg-[#7ED957] flex items-center justify-center text-white font-semibold text-xs">
                                                                        {residence.landlord.initials}
                                                                    </div>
                                                                    <p className="text-gray-900 font-normal text-sm">{residence.landlord.name}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : section.id === 'incomeHistory' && section.recordCount > 0 ? (
                                                <div className="space-y-4">
                                                    {application.incomeHistoryData.map((income) => (
                                                        <div key={income.id} className="bg-[#FAFAFA] rounded-lg border border-gray-200 p-6 space-y-4">
                                                            {/* Job Header */}
                                                            <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-200">
                                                                <h4 className="text-base font-semibold text-gray-900">{income.jobTitle} at {income.company}</h4>
                                                                {income.status === 'Current' && (
                                                                    <span className="px-2.5 py-1 bg-[#DCFCE7] text-[#16A34A] rounded-md text-xs font-semibold whitespace-nowrap">
                                                                        {income.status}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Details */}
                                                            <div className="space-y-3">
                                                                <div className="flex items-center gap-16">
                                                                    <div className="flex-1">
                                                                        <span className="text-gray-900 font-medium text-sm">Type</span>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <span className="text-gray-900 font-normal text-sm">{income.type}</span>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <span className="text-gray-900 font-medium text-sm">Start date</span>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <span className="text-gray-900 font-normal text-sm">{income.startDate}</span>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-start gap-16">
                                                                    <div className="flex-1">
                                                                        <span className="text-gray-900 font-medium text-sm">Address</span>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <span className="text-gray-900 font-normal text-sm">{income.address}</span>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <span className="text-gray-900 font-medium text-sm">Income/mo</span>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <span className="text-gray-900 font-normal text-sm">₹{income.incomePerMonth.toLocaleString('en-IN')}.00</span>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-16">
                                                                    <div className="flex-1">
                                                                        <span className="text-gray-900 font-medium text-sm">Office #</span>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <span className="text-gray-900 font-normal text-sm">{income.officeNumber}</span>
                                                                    </div>
                                                                    <div className="flex-1"></div>
                                                                    <div className="flex-1"></div>
                                                                </div>

                                                                <div className="flex items-center gap-16">
                                                                    <div className="flex-1">
                                                                        <span className="text-gray-900 font-medium text-sm">Work phone</span>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <span className="text-gray-900 font-normal text-sm">{income.workPhone}</span>
                                                                    </div>
                                                                    <div className="flex-1"></div>
                                                                    <div className="flex-1"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : section.recordCount > 0 ? (
                                                <div className="text-gray-600 text-sm">
                                                    {/* Content would be displayed here based on section type */}
                                                    <p className="text-gray-500 italic">
                                                        {section.recordCount} record(s) available
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 italic text-sm">No records found</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Additional Questions Section */}
                    <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                        <div
                            className="px-6 py-4 flex items-center justify-between cursor-pointer transition-colors"
                            onClick={() => toggleSection('additionalQuestions')}
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <HelpCircle size={20} className="text-gray-500" />
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Additional questions <span className="text-gray-400 text-sm font-medium ml-2">(6 records)</span>
                                </h3>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    className="text-[#7ED957] text-sm font-semibold hover:opacity-80 transition-opacity"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Edit
                                </button>
                                <div className="p-1">
                                    {expandedSections.additionalQuestions ? (
                                        <ChevronUp size={20} className="text-gray-500" />
                                    ) : (
                                        <ChevronDown size={20} className="text-gray-500" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {expandedSections.additionalQuestions && (
                            <div className="px-6 pb-1 bg-white/90 border-t border-[#E5E7EB]">
                                <div className="pt-1 space-y-0 divide-y divide-gray-200">
                                    <div className="flex items-center justify-between py-4">
                                        <p className="text-gray-900 font-normal text-base">Do you or any occupants smoke?</p>
                                        <p className="text-gray-900 font-normal text-base">{application.additionalQuestions.smoke}</p>
                                    </div>
                                    <div className="flex items-center justify-between py-4">
                                        <p className="text-gray-900 font-normal text-base">Are any occupants members in the military?</p>
                                        <p className="text-gray-900 font-normal text-base">{application.additionalQuestions.military}</p>
                                    </div>
                                    <div className="flex items-center justify-between py-4">
                                        <p className="text-gray-900 font-normal text-base">Have you ever been charged or convicted of a crime?</p>
                                        <p className="text-gray-900 font-normal text-base">{application.additionalQuestions.crime}</p>
                                    </div>
                                    <div className="flex items-center justify-between py-4">
                                        <p className="text-gray-900 font-normal text-base">Have you ever filed for bankruptcy?</p>
                                        <p className="text-gray-900 font-normal text-base">{application.additionalQuestions.bankruptcy}</p>
                                    </div>
                                    <div className="flex items-center justify-between py-4">
                                        <p className="text-gray-900 font-normal text-base">Have you ever willfully refused to pay rent when it was due?</p>
                                        <p className="text-gray-900 font-normal text-base">{application.additionalQuestions.refusedRent}</p>
                                    </div>
                                    <div className="flex items-center justify-between py-4">
                                        <p className="text-gray-900 font-normal text-base">Have you ever been evicted or left a tenancy owing money?</p>
                                        <p className="text-gray-900 font-normal text-base">{application.additionalQuestions.evicted}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Attachments Section */}
                    <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                        <div
                            className="px-6 py-4 flex items-center justify-between cursor-pointer transition-colors"
                            onClick={() => toggleSection('attachments')}
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <Paperclip size={20} className="text-gray-500" />
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Attachments <span className="text-gray-400 text-sm font-medium ml-2">({application.attachments} records)</span>
                                </h3>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    className="text-[#7ED957] text-sm font-semibold hover:opacity-80 transition-opacity"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Edit
                                </button>
                                <div className="p-1">
                                    {expandedSections.attachments ? (
                                        <ChevronUp size={20} className="text-gray-500" />
                                    ) : (
                                        <ChevronDown size={20} className="text-gray-500" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {expandedSections.attachments && (
                            <div className="px-6 pb-6 border-t border-[#E5E7EB]">
                                <div className="pt-4">
                                    {application.attachments > 0 ? (
                                        <div className="text-gray-600 text-sm">
                                            <p className="text-gray-500 italic">
                                                {application.attachments} attachment(s) available
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic text-sm">No attachments found</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Terms & Conditions Agreement */}
                    <div className="bg-white p-2 flex items-center gap-3">
                        <ExternalLink size={20} className="text-gray-500" />
                        <p className="text-gray-900 font-normal text-base">
                            {application.applicantName} agreed to <span className="text-[#7ED957] font-medium cursor-pointer hover:underline">Terms & Conditions</span> on {application.termsAccepted.date}.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetail;

