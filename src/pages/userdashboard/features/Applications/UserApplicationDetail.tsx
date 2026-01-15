import { useState, useEffect } from 'react';
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
    Info,
    FileText
} from 'lucide-react';
import UserEditApplicantInfoModal from './components/UserEditApplicantInfoModal';
import UserAddOccupantModal, { type OccupantFormData } from './components/UserAddOccupantModal';
import UserAddPetModal, { type PetFormData } from './components/UserAddPetModal';
import UserAddVehicleModal, { type VehicleFormData } from './components/UserAddVehicleModal';
import UserAddResidenceModal, { type ResidenceFormData } from './components/UserAddResidenceModal';
import UserAddIncomeModal, { type IncomeFormData } from './components/UserAddIncomeModal';
import UserEditBackgroundQuestionsModal, { type BackgroundQuestionsData } from './components/UserEditBackgroundQuestionsModal';
import UserAddReferenceModal, { type ReferenceFormData } from './components/UserAddReferenceModal';
import UserAddFileModal, { type FileFormData } from './components/UserAddFileModal';

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
        photo?: string;
    };
    additionalOccupants: number;
    occupantsData: Array<{
        id: string;
        name: string;
        relationship: string;
        dob: string;
        email: string;
        phone: string;
    }>;
    pets: number;
    petsData: Array<{
        id: string;
        name: string;
        type: string;
        breed: string;
        weight: string;
    }>;
    vehicles: number;
    vehiclesData: Array<{
        id: string;
        make: string;
        model: string;
        year: string;
        color: string;
        licensePlate: string;
    }>;
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
    contactsData: Array<{
        id: string;
        name: string;
        relationship: string;
        phone: string;
        email: string;
        type: string;
    }>;
    additionalQuestions: {
        smoke: string;
        military: string;
        crime: string;
        bankruptcy: string;
        refuseRent: string;
        evicted: string;
        explanations: Record<string, string>;
    };
    attachments: number;
    documentsData: Array<{
        name: string;
        size: number;
        type: string;
    }>;
    termsAccepted: {
        date: string;
    };
}

const ApplicationDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddOccupantModalOpen, setIsAddOccupantModalOpen] = useState(false);
    const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
    const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
    const [isAddResidenceModalOpen, setIsAddResidenceModalOpen] = useState(false);
    const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] = useState(false);
    const [isEditBackgroundInfoModalOpen, setIsEditBackgroundInfoModalOpen] = useState(false);
    const [isAddReferenceModalOpen, setIsAddReferenceModalOpen] = useState(false);
    const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
    const [application, setApplication] = useState<ApplicationData | null>(null);

    const loadApplication = () => {
        const localApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
        const foundApp = localApps.find((app: any) => String(app.id) === id);

        if (foundApp) {
            const formData = foundApp.formData || {};

            // Helpers
            const formatDateStr = (d: string | undefined | null) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

            // Helper to format phone with country code
            // Country code is stored as "isoCode|phonecode" (e.g., "US|+1")
            const formatPhone = (phoneNumber: string | undefined, phoneCountryCode: string | undefined): string => {
                if (!phoneNumber) return '—';
                if (!phoneCountryCode) return phoneNumber;

                let phonecode = phoneCountryCode;

                // Parse the country code format: "isoCode|phonecode"
                if (phoneCountryCode.includes('|')) {
                    const parts = phoneCountryCode.split('|');
                    if (parts.length > 1 && parts[1]) {
                        phonecode = parts[1];
                    }
                }

                // If the resulting code is just letters (e.g. "US"), it's likely an ISO code without dial code
                // Return just the phone number in this case to avoid "+US"
                if (/^[A-Za-z]+$/.test(phonecode)) {
                    return phoneNumber;
                }

                // Ensure phonecode starts with '+'
                const formattedCode = phonecode.startsWith('+') ? phonecode : `+${phonecode}`;

                return `(${formattedCode}) ${phoneNumber}`;
            };

            // Map Occupants
            const occupantsData = (formData.occupants || []).map((occ: any, idx: number) => ({
                id: occ.id || `occ_${idx}`,
                name: [occ.firstName, occ.lastName].filter(Boolean).join(' ') || 'Unknown Occupant',
                relationship: occ.relationship,
                dob: formatDateStr(occ.dob),
                email: occ.email || '—',
                phone: formatPhone(occ.phoneNumber, occ.phoneCountryCode)
            }));

            // Map Pets
            const petsData = (formData.pets || []).map((pet: any, idx: number) => ({
                id: pet.id || `pet_${idx}`,
                name: pet.name,
                type: pet.type,
                breed: pet.breed,
                weight: pet.weight
            }));

            // Map Vehicles
            const vehiclesData = (formData.vehicles || []).map((veh: any, idx: number) => ({
                id: veh.id || `veh_${idx}`,
                make: veh.make,
                model: veh.model,
                year: veh.year,
                color: veh.color,
                licensePlate: veh.licensePlate
            }));

            // Map Residences
            const residentialHistoryData = (formData.residences || []).map((res: any, idx: number) => ({
                id: idx + 1,
                address: res.address || [res.city, res.state].filter(Boolean).join(', ') || 'Unknown Address',
                location: res.city || 'Unknown Location',
                status: res.isCurrent ? 'Current' : 'Previous',
                rentOrOwn: res.residencyType,
                moveInDate: formatDateStr(res.moveInDate),
                moveOutDate: formatDateStr(res.moveOutDate),
                rent: parseFloat(res.rentAmount || '0') || 0,
                landlord: {
                    name: res.landlordName || '—',
                    initials: (res.landlordName?.trim() || 'L').split(/\s+/).map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                }
            }));

            // Map Incomes
            const incomeHistoryData = (formData.incomes || []).map((inc: any, idx: number) => ({
                id: idx + 1,
                jobTitle: inc.position || 'Unknown Title',
                company: inc.company || 'Unknown Company',
                status: inc.currentEmployment ? 'Current' : 'Previous',
                type: inc.incomeType,
                startDate: formatDateStr(inc.startDate),
                address: inc.address || '—',
                incomePerMonth: parseFloat(inc.monthlyAmount || '0') || 0,
                officeNumber: '—',
                workPhone: inc.companyPhone || '—'
            }));

            // Map Contacts (Emergency)
            const contactsData = (formData.emergencyContacts || []).map((contact: any, idx: number) => ({
                id: contact.id || `cont_${idx}`,
                name: contact.fullName,
                relationship: contact.relationship,
                phone: formatPhone(contact.phoneNumber, contact.phoneCountryCode),
                email: contact.email || '—',
                type: contact.type || 'Emergency Contact'
            }));

            // Calculate total income for rent ratio
            const totalIncome = incomeHistoryData.reduce((acc: number, curr: any) => acc + curr.incomePerMonth, 0);
            const currentRent = residentialHistoryData.find((r: any) => r.status === 'Current')?.rent || 0;

            setApplication({
                id: String(foundApp.id),
                applicationNumber: String(foundApp.id).slice(-7),
                applicantName: foundApp.name,
                phone: formatPhone(foundApp.phone || formData.phoneNumber, formData.phoneCountryCode),
                email: formData.email || 'user@example.com',
                status: foundApp.status,
                propertyName: foundApp.propertyName || 'Property Name',
                listingContact: 'Property Manager', // This could be better if saved in app data
                applicantInfo: {
                    hasDetails: !!formData.firstName,
                    dateOfBirth: formatDateStr(formData.dob),
                    preferredMoveIn: formatDateStr(formData.moveInDate),
                    shortBio: formData.shortBio || '—',
                    rentPerMonth: currentRent,
                    householdIncome: totalIncome,
                    photo: formData.photo,
                },
                additionalOccupants: occupantsData.length,
                occupantsData,
                pets: petsData.length,
                petsData,
                vehicles: vehiclesData.length,
                vehiclesData,
                residentialHistory: residentialHistoryData.length,
                residentialHistoryData,
                incomeHistory: incomeHistoryData.length,
                incomeHistoryData,
                contacts: contactsData.length,
                contactsData,
                additionalQuestions: {
                    smoke: formData.backgroundQuestions?.smoke ? 'Yes' : 'No',
                    military: formData.backgroundQuestions?.military ? 'Yes' : 'No',
                    crime: formData.backgroundQuestions?.crime ? 'Yes' : 'No',
                    bankruptcy: formData.backgroundQuestions?.bankruptcy ? 'Yes' : 'No',
                    refuseRent: formData.backgroundQuestions?.refuseRent ? 'Yes' : 'No',
                    evicted: formData.backgroundQuestions?.evicted ? 'Yes' : 'No',
                    explanations: formData.backgroundExplanations || {},
                },
                attachments: (formData.documents || []).length,
                documentsData: formData.documents || [],
                termsAccepted: {
                    date: formatDateStr(foundApp.appliedDate),
                },
            });
        } else {
            // Return a mock fallback if no app found (preserved generic fallback but minimal)
            setApplication({
                id: id || '00000',
                applicationNumber: '00000',
                applicantName: 'Unknown',
                phone: '—',
                email: '—',
                status: 'Submitted',
                propertyName: 'Unknown Property',
                listingContact: '—',
                applicantInfo: {
                    hasDetails: false,
                    dateOfBirth: '—',
                    preferredMoveIn: '—',
                    shortBio: '—',
                    rentPerMonth: 0,
                    householdIncome: 0,
                },
                additionalOccupants: 0,
                occupantsData: [],
                pets: 0,
                petsData: [],
                vehicles: 0,
                vehiclesData: [],
                residentialHistory: 0,
                residentialHistoryData: [],
                incomeHistory: 0,
                incomeHistoryData: [],
                contacts: 0,
                contactsData: [],
                additionalQuestions: {
                    smoke: 'No',
                    military: 'No',
                    crime: 'No',
                    bankruptcy: 'No',
                    refuseRent: 'No',
                    evicted: 'No',
                    explanations: {},
                },
                attachments: 0,
                documentsData: [],
                termsAccepted: {
                    date: '—',
                },
            });
        }
    };

    useEffect(() => {
        loadApplication();
    }, [id]);

    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (application) {
            setExpandedSections({
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
        }
    }, [application?.id]);

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

    if (!application) {
        return <div className="p-8 text-center text-gray-500">Loading application...</div>;
    }

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
            secondaryActions: [],
        },
        {
            id: 'incomeHistory',
            icon: Briefcase,
            title: 'Income history',
            subtitle: `(${application.incomeHistory} record)`,
            recordCount: application.incomeHistory,
            primaryAction: '+ Add income',
            secondaryActions: [], // ['+ Add additional information']
        },
        {
            id: 'contacts',
            icon: Contact,
            title: 'Contacts',
            subtitle: `(${application.contacts} record)`,
            recordCount: application.contacts,
            primaryAction: '+ Add reference',
            secondaryActions: [], // ['+ Add emergency contact']
        },
        {
            id: 'attachments',
            icon: Paperclip,
            title: 'Attachments',
            subtitle: `(${application.attachments} file${application.attachments !== 1 ? 's' : ''})`,
            recordCount: application.attachments,
            primaryAction: '+ Add file',
            secondaryActions: [],
        },
    ];

    // Handle primary actions for generic sections
    const handleSectionPrimaryAction = (sectionId: string) => {
        switch (sectionId) {
            case 'applicantInfo':
                setIsEditModalOpen(true);
                break;
            case 'additionalOccupants':
                setIsAddOccupantModalOpen(true);
                break;
            case 'pets':
                setIsAddPetModalOpen(true);
                break;
            case 'vehicles':
                setIsAddVehicleModalOpen(true);
                break;
            case 'residentialHistory':
                setIsAddResidenceModalOpen(true);
                break;
            case 'incomeHistory':
                setIsAddIncomeModalOpen(true);
                break;
            case 'contacts':
                setIsAddReferenceModalOpen(true);
                break;
            case 'attachments':
                setIsAddFileModalOpen(true);
                break;
        }
    };



    const handleSaveOccupant = (data: OccupantFormData) => {
        const localApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
        const appIndex = localApps.findIndex((app: any) => String(app.id) === id);

        if (appIndex !== -1) {
            const updatedApp = { ...localApps[appIndex] };
            const currentOccupants = updatedApp.formData.occupants || [];

            const newOccupant = {
                id: `occ_${Date.now()}`,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                phoneCountryCode: data.phoneCountryCode,
                dob: data.dob ? data.dob.toISOString() : null,
                relationship: data.relationship
            };

            updatedApp.formData.occupants = [...currentOccupants, newOccupant];
            localApps[appIndex] = updatedApp;
            localStorage.setItem('user_applications', JSON.stringify(localApps));

            loadApplication();
            setIsAddOccupantModalOpen(false);
        }
    };

    const handleSavePet = (data: PetFormData) => {
        const localApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
        const appIndex = localApps.findIndex((app: any) => String(app.id) === id);

        if (appIndex !== -1) {
            const updatedApp = { ...localApps[appIndex] };
            const currentPets = updatedApp.formData.pets || [];

            const newPet = {
                id: `pet_${Date.now()}`,
                type: data.type,
                name: data.name,
                weight: data.weight,
                breed: data.breed,
                // Handle photo if needed, though local file sync is tricky - assume basic string fields for now or uploaded URL
                // If the PetFormData had a URL or if we upload it first, we'd use that.
                // Assuming simple non-file storage for localStorage demo
            };

            updatedApp.formData.pets = [...currentPets, newPet];
            localApps[appIndex] = updatedApp;
            localStorage.setItem('user_applications', JSON.stringify(localApps));

            loadApplication();
            setIsAddPetModalOpen(false);
        }
    };

    const handleSaveVehicle = (data: VehicleFormData) => {
        const localApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
        const appIndex = localApps.findIndex((app: any) => String(app.id) === id);

        if (appIndex !== -1) {
            const updatedApp = { ...localApps[appIndex] };
            const currentVehicles = updatedApp.formData.vehicles || [];

            const newVehicle = {
                id: `veh_${Date.now()}`,
                type: data.type,
                make: data.make,
                model: data.model,
                year: data.year,
                color: data.color,
                licensePlate: data.licensePlate,
                registeredIn: data.registeredIn
            };

            updatedApp.formData.vehicles = [...currentVehicles, newVehicle];
            localApps[appIndex] = updatedApp;
            localStorage.setItem('user_applications', JSON.stringify(localApps));

            loadApplication();
            setIsAddVehicleModalOpen(false);
        }
    };

    const handleSaveResidence = (data: ResidenceFormData) => {
        const localApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
        const appIndex = localApps.findIndex((app: any) => String(app.id) === id);

        if (appIndex !== -1) {
            const updatedApp = { ...localApps[appIndex] };
            const currentResidences = updatedApp.formData.residences || [];

            const newResidence = {
                // Map ResidenceFormData to structure expected by ApplicationDetail mock logic/storage
                // Note: ApplicantForm and UserAddResidenceModal align mostly but storage format is generic object in local storage
                // We should try to match the fields shown in UserApplicationDetail mapping (lines 194-207)
                isCurrent: data.isCurrent,
                address: data.address,
                city: data.city,
                state: data.state,
                zip: data.zip,
                country: data.country,
                residencyType: data.residencyType === 'Others' ? data.otherResidencyType : data.residencyType,
                moveInDate: data.moveInDate ? data.moveInDate.toISOString() : null,
                moveOutDate: data.moveOutDate ? data.moveOutDate.toISOString() : null,
                rentAmount: data.rentAmount,
                landlordName: data.landlordName,
                // Add other fields as needed by viewing logic
            };

            updatedApp.formData.residences = [...currentResidences, newResidence];
            localApps[appIndex] = updatedApp;
            localStorage.setItem('user_applications', JSON.stringify(localApps));

            loadApplication();
            setIsAddResidenceModalOpen(false);
        }
    };

    const handleSaveIncome = (data: IncomeFormData) => {
        const localApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
        const appIndex = localApps.findIndex((app: any) => String(app.id) === id);

        if (appIndex !== -1) {
            const updatedApp = { ...localApps[appIndex] };
            const currentIncomes = updatedApp.formData.incomes || [];

            const newIncome = {
                // Map IncomeFormData to structure expected by ApplicationDetail mock logic/storage
                currentEmployment: data.currentEmployment,
                incomeType: data.incomeType,
                startDate: data.startDate ? data.startDate.toISOString() : null,
                endDate: data.endDate ? data.endDate.toISOString() : null,
                company: data.company,
                position: data.position,
                monthlyAmount: data.monthlyAmount,
                currency: data.currency,
                address: data.address,
                office: data.office,
                companyPhone: data.companyPhone,
                supervisorName: data.supervisorName,
                supervisorEmail: data.supervisorEmail,
                supervisorPhone: data.supervisorPhone
            };

            updatedApp.formData.incomes = [...currentIncomes, newIncome];
            localApps[appIndex] = updatedApp;
            localStorage.setItem('user_applications', JSON.stringify(localApps));

            loadApplication();
            setIsAddIncomeModalOpen(false);
        }
    };

    const handleSaveBackgroundInfo = (data: BackgroundQuestionsData) => {
        const localApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
        const appIndex = localApps.findIndex((app: any) => String(app.id) === id);

        if (appIndex !== -1) {
            const updatedApp = { ...localApps[appIndex] };

            updatedApp.formData.backgroundQuestions = {
                smoke: data.smoke,
                military: data.military,
                crime: data.crime,
                bankruptcy: data.bankruptcy,
                refuseRent: data.refuseRent,
                evicted: data.evicted
            };
            updatedApp.formData.backgroundExplanations = data.explanations;

            localApps[appIndex] = updatedApp;
            localStorage.setItem('user_applications', JSON.stringify(localApps));

            loadApplication();
            setIsEditBackgroundInfoModalOpen(false);
        }
    };

    const handleSaveReference = (data: ReferenceFormData) => {
        const localApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
        const appIndex = localApps.findIndex((app: any) => String(app.id) === id);

        if (appIndex !== -1) {
            const updatedApp = { ...localApps[appIndex] };
            const currentContacts = updatedApp.formData.emergencyContacts || [];

            const newContact = {
                id: `ref_${Date.now()}`,
                fullName: data.fullName,
                relationship: data.relationship,
                email: data.email,
                phoneNumber: data.phoneNumber,
                phoneCountryCode: data.phoneCountryCode,
                type: 'Reference'
            };

            updatedApp.formData.emergencyContacts = [...currentContacts, newContact];
            localApps[appIndex] = updatedApp;
            localStorage.setItem('user_applications', JSON.stringify(localApps));

            loadApplication();
            setIsAddReferenceModalOpen(false);
        }
    };

    const handleSaveFile = (data: FileFormData) => {
        const localApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
        const appIndex = localApps.findIndex((app: any) => String(app.id) === id);

        if (appIndex !== -1) {
            const updatedApp = { ...localApps[appIndex] };
            const currentDocs = updatedApp.formData.documents || [];

            const newDoc = {
                name: data.name,
                size: data.file ? data.file.size : 0,
                type: data.type.split('/')[1]?.toUpperCase() || 'FILE',
                url: '#'
            };

            updatedApp.formData.documents = [...currentDocs, newDoc];
            localApps[appIndex] = updatedApp;
            localStorage.setItem('user_applications', JSON.stringify(localApps));

            loadApplication();
            setIsAddFileModalOpen(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full min-h-screen bg-white p-4 lg:p-8">
            <UserEditApplicantInfoModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                applicationId={application.id}
                onUpdate={loadApplication}
            />
            <UserAddOccupantModal
                isOpen={isAddOccupantModalOpen}
                onClose={() => setIsAddOccupantModalOpen(false)}
                onSave={handleSaveOccupant}
            />
            <UserAddPetModal
                isOpen={isAddPetModalOpen}
                onClose={() => setIsAddPetModalOpen(false)}
                onSave={handleSavePet}
            />
            <UserAddVehicleModal
                isOpen={isAddVehicleModalOpen}
                onClose={() => setIsAddVehicleModalOpen(false)}
                onSave={handleSaveVehicle}
            />
            <UserAddResidenceModal
                isOpen={isAddResidenceModalOpen}
                onClose={() => setIsAddResidenceModalOpen(false)}
                onSave={handleSaveResidence}
            />
            <UserAddIncomeModal
                isOpen={isAddIncomeModalOpen}
                onClose={() => setIsAddIncomeModalOpen(false)}
                onSave={handleSaveIncome}
            />
            {application && (
                <UserEditBackgroundQuestionsModal
                    isOpen={isEditBackgroundInfoModalOpen}
                    onClose={() => setIsEditBackgroundInfoModalOpen(false)}
                    onSave={handleSaveBackgroundInfo}
                    initialData={{
                        smoke: application.additionalQuestions.smoke === 'Yes',
                        military: application.additionalQuestions.military === 'Yes',
                        crime: application.additionalQuestions.crime === 'Yes',
                        bankruptcy: application.additionalQuestions.bankruptcy === 'Yes',
                        refuseRent: application.additionalQuestions.refuseRent === 'Yes',
                        evicted: application.additionalQuestions.evicted === 'Yes',
                        explanations: application.additionalQuestions.explanations || {}
                    }}
                />
            )}
            <UserAddReferenceModal
                isOpen={isAddReferenceModalOpen}
                onClose={() => setIsAddReferenceModalOpen(false)}
                onSave={handleSaveReference}
            />
            <UserAddFileModal
                isOpen={isAddFileModalOpen}
                onClose={() => setIsAddFileModalOpen(false)}
                onSave={handleSaveFile}
            />

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
                                        {application.applicantInfo.photo ? (
                                            <img
                                                src={application.applicantInfo.photo}
                                                alt={application.applicantName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${application.applicantName}`}
                                                alt={application.applicantName}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
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
                                                className="text-[#7ED957] font-semibold text-sm hover:opacity-80 transition-opacity"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSectionPrimaryAction(section.id);
                                                }}
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
                                            ) : section.id === 'additionalOccupants' && section.recordCount > 0 ? (
                                                <div className="space-y-4">
                                                    {application.occupantsData.map((occupant) => (
                                                        <div key={occupant.id} className="bg-[#FAFAFA] rounded-lg border border-gray-200 p-5 space-y-4">
                                                            <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-200">
                                                                <h4 className="text-base font-semibold text-gray-900">{occupant.name}</h4>
                                                                <span className="text-gray-500 font-medium text-sm">{occupant.relationship}</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-gray-900 font-medium text-sm">Date of Birth</p>
                                                                    <p className="text-gray-900 font-normal text-sm">{occupant.dob}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-900 font-medium text-sm">Phone</p>
                                                                    <p className="text-gray-900 font-normal text-sm">{occupant.phone}</p>
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <p className="text-gray-900 font-medium text-sm">Email</p>
                                                                    <p className="text-gray-900 font-normal text-sm">{occupant.email}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : section.id === 'pets' && section.recordCount > 0 ? (
                                                <div className="space-y-4">
                                                    {application.petsData.map((pet) => (
                                                        <div key={pet.id} className="bg-[#FAFAFA] rounded-lg border border-gray-200 p-5 space-y-4">
                                                            <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-200">
                                                                <h4 className="text-base font-semibold text-gray-900">{pet.name}</h4>
                                                                <span className="text-gray-500 font-medium text-sm">{pet.type}</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-gray-900 font-medium text-sm">Breed</p>
                                                                    <p className="text-gray-900 font-normal text-sm">{pet.breed}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-900 font-medium text-sm">Weight</p>
                                                                    <p className="text-gray-900 font-normal text-sm">{pet.weight}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : section.id === 'vehicles' && section.recordCount > 0 ? (
                                                <div className="space-y-4">
                                                    {application.vehiclesData.map((vehicle) => (
                                                        <div key={vehicle.id} className="bg-[#FAFAFA] rounded-lg border border-gray-200 p-5 space-y-4">
                                                            <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-200">
                                                                <h4 className="text-base font-semibold text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</h4>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-gray-900 font-medium text-sm">Color</p>
                                                                    <p className="text-gray-900 font-normal text-sm">{vehicle.color}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-900 font-medium text-sm">License Plate</p>
                                                                    <p className="text-gray-900 font-normal text-sm">{vehicle.licensePlate}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : section.id === 'contacts' && section.recordCount > 0 ? (
                                                <div className="space-y-4">
                                                    {application.contactsData.map((contact) => (
                                                        <div key={contact.id} className="bg-[#FAFAFA] rounded-lg border border-gray-200 p-5 space-y-4">
                                                            <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-200">
                                                                <h4 className="text-base font-semibold text-gray-900">{contact.name}</h4>
                                                                <span className="text-gray-500 font-medium text-sm">{contact.relationship}</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-gray-900 font-medium text-sm">Type</p>
                                                                    <p className="text-gray-900 font-normal text-sm">{contact.type}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-900 font-medium text-sm">Phone</p>
                                                                    <p className="text-gray-900 font-normal text-sm">{contact.phone}</p>
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <p className="text-gray-900 font-medium text-sm">Email</p>
                                                                    <p className="text-gray-900 font-normal text-sm">{contact.email}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : section.id === 'attachments' ? (
                                                <div className="space-y-4">
                                                    {application.documentsData.length > 0 ? (
                                                        application.documentsData.map((doc, idx) => (
                                                            <div key={idx} className="bg-[#FAFAFA] rounded-lg border border-gray-200 p-5 flex items-center justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                                                                        <FileText size={20} className="text-[#7ED957]" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-sm font-semibold text-gray-900">{doc.name}</h4>
                                                                        <p className="text-xs text-gray-500">{(doc.size / 1024).toFixed(1)} KB • {doc.type}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-gray-500 italic text-sm">No attachments found</p>
                                                    )}
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsEditBackgroundInfoModalOpen(true);
                                    }}
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
                                    <div className="space-y-2 py-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-gray-900 font-normal text-base">Have you ever been charged or convicted of a crime?</p>
                                            <p className="text-gray-900 font-normal text-base">{application.additionalQuestions.crime}</p>
                                        </div>
                                        {application.additionalQuestions.crime === 'Yes' && application.additionalQuestions.explanations.crime && (
                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <p className="text-sm text-gray-600"><span className="font-medium text-gray-900">Explanation:</span> {application.additionalQuestions.explanations.crime}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2 py-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-gray-900 font-normal text-base">Have you ever filed for bankruptcy?</p>
                                            <p className="text-gray-900 font-normal text-base">{application.additionalQuestions.bankruptcy}</p>
                                        </div>
                                        {application.additionalQuestions.bankruptcy === 'Yes' && application.additionalQuestions.explanations.bankruptcy && (
                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <p className="text-sm text-gray-600"><span className="font-medium text-gray-900">Explanation:</span> {application.additionalQuestions.explanations.bankruptcy}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2 py-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-gray-900 font-normal text-base">Have you ever willfully refused to pay rent when it was due?</p>
                                            <p className="text-gray-900 font-normal text-base">{application.additionalQuestions.refuseRent}</p>
                                        </div>
                                        {application.additionalQuestions.refuseRent === 'Yes' && application.additionalQuestions.explanations.refuseRent && (
                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <p className="text-sm text-gray-600"><span className="font-medium text-gray-900">Explanation:</span> {application.additionalQuestions.explanations.refuseRent}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2 py-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-gray-900 font-normal text-base">Have you ever been evicted or left a tenancy owing money?</p>
                                            <p className="text-gray-900 font-normal text-base">{application.additionalQuestions.evicted}</p>
                                        </div>
                                        {application.additionalQuestions.evicted === 'Yes' && application.additionalQuestions.explanations.evicted && (
                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <p className="text-sm text-gray-600"><span className="font-medium text-gray-900">Explanation:</span> {application.additionalQuestions.explanations.evicted}</p>
                                            </div>
                                        )}
                                    </div>
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

