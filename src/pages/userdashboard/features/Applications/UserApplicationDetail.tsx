import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { useGetApplication, useUpdateApplication } from '../../../../hooks/useApplicationQueries';

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

    // Use react-query hooks
    const { data: backendApplication, isLoading, error, refetch } = useGetApplication(id);
    const updateApplicationMutation = useUpdateApplication();

    // Transform backend data to frontend format
    const application = useMemo<ApplicationData | null>(() => {
        if (!backendApplication) return null;

        const formatDateStr = (d: string | undefined | null) => 
            d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

        const formatPhone = (phoneNumber: string | null | undefined): string => {
            if (!phoneNumber) return '—';
            return phoneNumber;
        };

        const primaryApplicant = backendApplication.applicants?.find(a => a.isPrimary) || backendApplication.applicants?.[0];
        
        // Map Occupants
        const occupantsData = (backendApplication.occupants || []).map((occ, idx) => ({
            id: occ.id || `occ_${idx}`,
            name: occ.name || [occ.firstName, occ.lastName].filter(Boolean).join(' ') || 'Unknown Occupant',
            relationship: occ.relationship,
            dob: formatDateStr(occ.dateOfBirth),
            email: occ.email || '—',
            phone: formatPhone(occ.phoneNumber)
        }));

        // Map Pets
        const petsData = (backendApplication.pets || []).map((pet, idx) => ({
            id: pet.id || `pet_${idx}`,
            name: pet.name,
            type: pet.type,
            breed: pet.breed,
            weight: pet.weight || '—'
        }));

        // Map Vehicles
        const vehiclesData = (backendApplication.vehicles || []).map((veh, idx) => ({
            id: veh.id || `veh_${idx}`,
            make: veh.make,
            model: veh.model,
            year: String(veh.year),
            color: veh.color,
            licensePlate: veh.licensePlate
        }));

        // Map Residences
        const residentialHistoryData: Array<{
            id: number;
            address: string;
            location: string;
            status: 'Current' | 'Previous';
            rentOrOwn: string;
            moveInDate: string;
            moveOutDate: string;
            rent: number;
            landlord: { name: string; initials: string };
        }> = (backendApplication.residenceHistory || []).map((res, idx) => ({
            id: idx + 1,
            address: res.address || [res.city, res.state].filter(Boolean).join(', ') || 'Unknown Address',
            location: res.city || 'Unknown Location',
            status: res.isCurrent ? 'Current' : 'Previous',
            rentOrOwn: res.residenceType === 'RENTED' ? 'Rent' : res.residenceType === 'OWNED' ? 'Own' : 'Family',
            moveInDate: formatDateStr(res.moveInDate),
            moveOutDate: formatDateStr(res.moveOutDate),
            rent: parseFloat(res.monthlyRent || '0') || 0,
            landlord: {
                name: res.landlordName || '—',
                initials: (res.landlordName?.trim() || 'L').split(/\s+/).map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
            }
        }));

        // Map Incomes
        const incomeHistoryData: Array<{
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
        }> = (backendApplication.incomeDetails || []).map((inc, idx) => ({
            id: idx + 1,
            jobTitle: inc.positionTitle || 'Unknown Title',
            company: inc.companyName || 'Unknown Company',
            status: inc.currentEmployment ? 'Current' : 'Previous',
            type: inc.incomeType,
            startDate: formatDateStr(inc.startDate),
            address: inc.officeAddress || '—',
            incomePerMonth: parseFloat(inc.monthlyIncome || '0') || 0,
            officeNumber: inc.office || '—',
            workPhone: inc.companyPhone || '—'
        }));

        // Map Contacts (Emergency + Reference)
        const emergencyContactsData = (backendApplication.emergencyContacts || []).map((contact, idx) => ({
            id: contact.id || `cont_${idx}`,
            name: contact.contactName,
            relationship: contact.relationship,
            phone: formatPhone(contact.phoneNumber),
            email: contact.email || '—',
            type: 'Emergency Contact'
        }));

        const referenceContactsData = (backendApplication.referenceContacts || []).map((contact, idx) => ({
            id: contact.id || `ref_${idx}`,
            name: contact.contactName,
            relationship: contact.relationship,
            phone: formatPhone(contact.phoneNumber),
            email: contact.email || '—',
            type: 'Reference'
        }));

        const contactsData = [...emergencyContactsData, ...referenceContactsData];

        // Calculate total income for rent ratio
        const totalIncome = incomeHistoryData.reduce((acc, curr) => acc + curr.incomePerMonth, 0);
        const currentRent = residentialHistoryData.find((r) => r.status === 'Current')?.rent || 0;

        // Map status
        const statusMap: Record<string, 'Approved' | 'Pending' | 'Rejected' | 'Submitted'> = {
            'APPROVED': 'Approved',
            'REVIEWING': 'Pending',
            'REJECTED': 'Rejected',
            'SUBMITTED': 'Submitted',
            'DRAFT': 'Submitted',
            'CANCELLED': 'Rejected'
        };

        return {
            id: backendApplication.id,
            applicationNumber: backendApplication.id.slice(-7),
            applicantName: primaryApplicant ? `${primaryApplicant.firstName} ${primaryApplicant.lastName}`.trim() : 'Unknown',
            phone: formatPhone(primaryApplicant?.phoneNumber),
            email: primaryApplicant?.email || '—',
            status: statusMap[backendApplication.status] || 'Submitted',
            propertyName: backendApplication.leasing?.property?.propertyName || 'Unknown Property',
            listingContact: backendApplication.leasing?.property?.listingContactName || 'Property Manager',
            applicantInfo: {
                hasDetails: !!primaryApplicant,
                dateOfBirth: formatDateStr(primaryApplicant?.dateOfBirth),
                preferredMoveIn: formatDateStr(backendApplication.moveInDate),
                shortBio: backendApplication.bio || '—',
                rentPerMonth: currentRent,
                householdIncome: totalIncome,
                photo: backendApplication.imageUrl || undefined,
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
                smoke: backendApplication.backgroundQuestions?.smoke ? 'Yes' : 'No',
                military: backendApplication.backgroundQuestions?.militaryMember ? 'Yes' : 'No',
                crime: backendApplication.backgroundQuestions?.criminalRecord ? 'Yes' : 'No',
                bankruptcy: backendApplication.backgroundQuestions?.bankruptcy ? 'Yes' : 'No',
                refuseRent: backendApplication.backgroundQuestions?.refusedRent ? 'Yes' : 'No',
                evicted: backendApplication.backgroundQuestions?.evicted ? 'Yes' : 'No',
                explanations: {}, // Custom background answers would need to be mapped from customBackgroundAnswers
            },
            attachments: 0, // Documents/attachments would need to be handled separately if available
            documentsData: [],
            termsAccepted: {
                date: formatDateStr(backendApplication.applicationDate || backendApplication.createdAt),
            },
        };
    }, [backendApplication]);

    // Check if application is approved (cannot be edited)
    const isApproved = application?.status === 'Approved';

    // Legacy function kept for compatibility - now just triggers refetch
    const loadApplication = useCallback(() => {
        refetch();
    }, [refetch]);

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

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading application...</div>;
    }

    if (error || !application) {
        return (
            <div className="p-8 text-center text-red-500">
                {error ? 'Failed to load application' : 'Application not found'}
            </div>
        );
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
        if (!id || !backendApplication) return;

        const currentOccupants = backendApplication.occupants || [];
        const newOccupant = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email || undefined,
            phoneNumber: data.phoneNumber || undefined,
            dateOfBirth: data.dob ? data.dob.toISOString() : new Date().toISOString(),
            relationship: data.relationship
        };

        updateApplicationMutation.mutate(
            {
                id,
                updateData: {
                    occupants: [...currentOccupants.map(o => ({
                        firstName: o.firstName || undefined,
                        lastName: o.lastName || undefined,
                        name: o.name || undefined,
                        email: o.email || undefined,
                        phoneNumber: o.phoneNumber || undefined,
                        dateOfBirth: o.dateOfBirth,
                        relationship: o.relationship
                    })), newOccupant]
                }
            },
            {
                onSuccess: () => {
                    setIsAddOccupantModalOpen(false);
                    refetch();
                },
                onError: (error: any) => {
                    console.error('Failed to add occupant:', error);
                    alert(error.message || 'Failed to add occupant');
                }
            }
        );
    };

    const handleSavePet = (data: PetFormData) => {
        if (!id || !backendApplication) return;

        const currentPets = backendApplication.pets || [];
        const newPet = {
            type: data.type,
            name: data.name,
            weight: data.weight ? parseFloat(data.weight) : undefined,
            breed: data.breed,
            photoUrl: undefined // TODO: Handle photo upload if needed
        };

        updateApplicationMutation.mutate(
            {
                id,
                updateData: {
                    pets: [...currentPets.map(p => ({
                        type: p.type,
                        name: p.name,
                        weight: p.weight ? parseFloat(p.weight) : undefined,
                        breed: p.breed,
                        photoUrl: p.photoUrl || undefined
                    })), newPet]
                }
            },
            {
                onSuccess: () => {
                    setIsAddPetModalOpen(false);
                    refetch();
                },
                onError: (error: any) => {
                    console.error('Failed to add pet:', error);
                    alert(error.message || 'Failed to add pet');
                }
            }
        );
    };

    const handleSaveVehicle = (data: VehicleFormData) => {
        if (!id || !backendApplication) return;

        const currentVehicles = backendApplication.vehicles || [];
        const newVehicle = {
            type: data.type,
            make: data.make,
            model: data.model,
            year: parseInt(data.year, 10),
            color: data.color,
            licensePlate: data.licensePlate,
            registeredIn: data.registeredIn
        };

        updateApplicationMutation.mutate(
            {
                id,
                updateData: {
                    vehicles: [...currentVehicles.map(v => ({
                        type: v.type,
                        make: v.make,
                        model: v.model,
                        year: v.year,
                        color: v.color,
                        licensePlate: v.licensePlate,
                        registeredIn: v.registeredIn
                    })), newVehicle]
                }
            },
            {
                onSuccess: () => {
                    setIsAddVehicleModalOpen(false);
                    refetch();
                },
                onError: (error: any) => {
                    console.error('Failed to add vehicle:', error);
                    alert(error.message || 'Failed to add vehicle');
                }
            }
        );
    };

    const handleSaveResidence = (data: ResidenceFormData) => {
        if (!id || !backendApplication) return;

        const currentResidences = backendApplication.residenceHistory || [];
        const cityValue = data.city && data.city.trim() !== '' ? data.city.trim() : data.state;
        const residenceType = data.residencyType === 'Rent' ? 'RENTED' : data.residencyType === 'Own' ? 'OWNED' : 'FAMILY';

        const newResidence = {
            residenceType,
            monthlyRent: data.rentAmount ? parseFloat(data.rentAmount) : undefined,
            moveInDate: data.moveInDate ? data.moveInDate.toISOString() : new Date().toISOString(),
            moveOutDate: data.moveOutDate ? data.moveOutDate.toISOString() : undefined,
            isCurrent: data.isCurrent ?? (data.moveOutDate ? false : true),
            landlordName: data.landlordName || 'N/A',
            landlordEmail: undefined,
            landlordPhone: '',
            address: data.address,
            city: cityValue,
            state: data.state,
            zipCode: data.zip,
            country: data.country,
            additionalInfo: undefined
        };

        updateApplicationMutation.mutate(
            {
                id,
                updateData: {
                    residenceHistory: [...currentResidences.map(r => ({
                        residenceType: r.residenceType,
                        monthlyRent: r.monthlyRent ? parseFloat(r.monthlyRent) : undefined,
                        moveInDate: r.moveInDate,
                        moveOutDate: r.moveOutDate || undefined,
                        isCurrent: r.isCurrent,
                        landlordName: r.landlordName,
                        landlordEmail: r.landlordEmail || undefined,
                        landlordPhone: r.landlordPhone,
                        address: r.address,
                        city: r.city,
                        state: r.state,
                        zipCode: r.zipCode,
                        country: r.country,
                        additionalInfo: r.additionalInfo || undefined
                    })), newResidence]
                }
            },
            {
                onSuccess: () => {
                    setIsAddResidenceModalOpen(false);
                    refetch();
                },
                onError: (error: any) => {
                    console.error('Failed to add residence:', error);
                    alert(error.message || 'Failed to add residence');
                }
            }
        );
    };

    const handleSaveIncome = (data: IncomeFormData) => {
        if (!id || !backendApplication) return;

        const currentIncomes = backendApplication.incomeDetails || [];
        const newIncome = {
            incomeType: data.incomeType,
            companyName: data.company,
            positionTitle: data.position,
            startDate: data.startDate ? data.startDate.toISOString() : new Date().toISOString(),
            endDate: data.endDate ? data.endDate.toISOString() : undefined,
            currentEmployment: data.currentEmployment ?? false,
            monthlyIncome: parseFloat(data.monthlyAmount) || 0,
            officeAddress: data.address,
            office: data.office || undefined,
            companyPhone: data.companyPhone || undefined,
            supervisorName: data.supervisorName,
            supervisorPhone: data.supervisorPhone,
            supervisorEmail: data.supervisorEmail || undefined,
            additionalInfo: undefined
        };

        updateApplicationMutation.mutate(
            {
                id,
                updateData: {
                    incomeDetails: [...currentIncomes.map(i => ({
                        incomeType: i.incomeType,
                        companyName: i.companyName,
                        positionTitle: i.positionTitle,
                        startDate: i.startDate,
                        endDate: i.endDate || undefined,
                        currentEmployment: i.currentEmployment,
                        monthlyIncome: parseFloat(i.monthlyIncome || '0'),
                        officeAddress: i.officeAddress,
                        office: i.office || undefined,
                        companyPhone: i.companyPhone || undefined,
                        supervisorName: i.supervisorName,
                        supervisorPhone: i.supervisorPhone,
                        supervisorEmail: i.supervisorEmail || undefined,
                        additionalInfo: i.additionalInfo || undefined
                    })), newIncome]
                }
            },
            {
                onSuccess: () => {
                    setIsAddIncomeModalOpen(false);
                    refetch();
                },
                onError: (error: any) => {
                    console.error('Failed to add income:', error);
                    alert(error.message || 'Failed to add income');
                }
            }
        );
    };

    const handleSaveBackgroundInfo = (data: BackgroundQuestionsData) => {
        if (!id) return;

        updateApplicationMutation.mutate(
            {
                id,
                updateData: {
                    backgroundQuestions: {
                        smoke: data.smoke,
                        militaryMember: data.military,
                        criminalRecord: data.crime,
                        bankruptcy: data.bankruptcy,
                        refusedRent: data.refuseRent,
                        evicted: data.evicted
                    }
                }
            },
            {
                onSuccess: () => {
                    setIsEditBackgroundInfoModalOpen(false);
                    refetch();
                },
                onError: (error: any) => {
                    console.error('Failed to update background info:', error);
                    alert(error.message || 'Failed to update background info');
                }
            }
        );
    };

    const handleSaveReference = (data: ReferenceFormData) => {
        if (!id || !backendApplication) return;

        const currentReferences = backendApplication.referenceContacts || [];
        const newReference = {
            contactName: data.fullName,
            relationship: data.relationship,
            email: data.email,
            phoneNumber: data.phoneNumber,
            yearsKnown: 0 // Default value, could be added to form if needed
        };

        updateApplicationMutation.mutate(
            {
                id,
                updateData: {
                    referenceContacts: [...currentReferences.map(r => ({
                        contactName: r.contactName,
                        relationship: r.relationship,
                        email: r.email,
                        phoneNumber: r.phoneNumber,
                        yearsKnown: r.yearsKnown
                    })), newReference]
                }
            },
            {
                onSuccess: () => {
                    setIsAddReferenceModalOpen(false);
                    refetch();
                },
                onError: (error: any) => {
                    console.error('Failed to add reference:', error);
                    alert(error.message || 'Failed to add reference');
                }
            }
        );
    };

    const handleSaveFile = (_data: FileFormData) => {
        // TODO: Implement file upload to backend if file storage is available
        // For now, just close the modal
        console.warn('File upload not yet implemented - files need to be uploaded to backend storage');
        setIsAddFileModalOpen(false);
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


            {application.additionalQuestions && (
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
                                                className={`text-[#7ED957] font-semibold text-sm transition-opacity ${
                                                    isApproved 
                                                        ? 'opacity-50 cursor-not-allowed' 
                                                        : 'hover:opacity-80'
                                                }`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (!isApproved) {
                                                        handleSectionPrimaryAction(section.id);
                                                    }
                                                }}
                                                disabled={isApproved}
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
                                    className={`text-[#7ED957] text-sm font-semibold transition-opacity ${
                                        isApproved 
                                            ? 'opacity-50 cursor-not-allowed' 
                                            : 'hover:opacity-80'
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isApproved) {
                                            setIsEditBackgroundInfoModalOpen(true);
                                        }
                                    }}
                                    disabled={isApproved}
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

