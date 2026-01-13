
export interface FileMetadata {
    name: string;
    size: number;
    type: string;
    lastModified: number;
}

export interface EmergencyContactFormData {
    fullName: string;
    relationship: string;
    email: string;
    phoneNumber: string;
    phoneCountryCode?: string;
    details: string;
}

export interface ResidenceFormData {
    isCurrent: boolean;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    residencyType: 'Rent' | 'Own' | 'Others';
    otherResidencyType?: string;
    moveInDate: Date | undefined;
    moveOutDate: Date | undefined;
    reason: string;
    // Rent specific
    landlordName?: string;
    landlordPhone?: string;
    landlordEmail?: string;
    landlordPhoneCountryCode?: string;
    rentAmount?: string;
}

export interface VehicleFormData {
    type: string;
    make: string; // Backend uses 'make', frontend displays as 'Company name'
    model: string;
    year: string;
    color: string;
    licensePlate: string;
    registeredIn: string;
}

export interface OccupantFormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    phoneCountryCode?: string;
    dob: Date | undefined;
    relationship: string;
}

export interface PetFormData {
    type: string;
    name: string;
    weight: string;
    breed: string;
    photo?: File | null;
    existingPhotoUrl?: string | null;
}

export interface IncomeFormData {
    currentEmployment: boolean;
    incomeType: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    company: string;
    position: string;
    monthlyAmount: string; // "Monthly Income" in UI
    currency?: string; // Currency code (e.g., 'USD', 'EUR', 'INR')
    address: string;
    office: string;
    companyPhone: string;
    supervisorName: string;
    supervisorEmail: string;
    supervisorPhone: string;
}

export interface UserApplicationFormData {
    // Step 1: Property Selection
    propertyId: string;
    unitId: string;

    // Step 1: Applicant Info
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    phoneCountryCode?: string;
    dob: Date | undefined;
    shortBio: string;
    moveInDate: Date | undefined;

    // Step 2: Occupants
    occupants: Array<OccupantFormData & { id: string }>;
    pets: Array<PetFormData & { id: string }>;
    photo: File | null;
    vehicles: Array<VehicleFormData & { id: string }>;
    residences: Array<ResidenceFormData & { id: string }>;
    incomes: Array<IncomeFormData & { id: string }>;
    additionalResidenceInfo: string;
    additionalIncomeInfo: string;
    emergencyContacts: Array<EmergencyContactFormData & { id: string }>;
    backgroundQuestions: Record<string, boolean | null>;
    backgroundExplanations: Record<string, string>;
    customBackgroundAnswers: Array<{ questionId: string; answer: boolean }>;
    documents: FileMetadata[];
    // Runtime-only: actual File objects (not persisted to localStorage)
    documentFiles?: File[];
    documentUrls?: string[]; // URLs of uploaded documents from backend
    photoFile?: File | null;
    photoUrl?: string | null; // URL of uploaded photo from backend
}
