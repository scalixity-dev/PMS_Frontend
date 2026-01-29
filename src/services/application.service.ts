import { API_ENDPOINTS } from '../config/api.config';
import type { ApplicationFormData } from '../pages/Dashboard/features/Application/store/applicationStore';
import type { UserApplicationFormData } from '../pages/userdashboard/features/Applications/store/types';

// Backend Application Types
export interface BackendApplication {
  id: string;
  leasingId: string;
  invitedById?: string | null;
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEWING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  applicationDate: string;
  moveInDate: string;
  bio?: string | null;
  additionalResidenceInfo?: string | null;
  additionalIncomeInfo?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  applicants: BackendApplicant[];
  occupants: BackendOccupant[];
  pets: BackendPet[];
  vehicles: BackendVehicle[];
  residenceHistory: BackendResidenceHistory[];
  incomeDetails: BackendIncomeDetail[];
  emergencyContacts: BackendEmergencyContact[];
  referenceContacts?: BackendReferenceContact[];
  leasing?: {
    id: string;
    monthlyRent?: string | number;
    onlineRentalApplication?: boolean;
    property?: {
      id: string;
      propertyName?: string;
      propertyType?: 'SINGLE' | 'MULTI';
      listingContactName?: string | null;
      listingEmail?: string | null;
      listingPhoneCountryCode?: string | null;
      listingPhoneNumber?: string | null;
      address?: {
        streetAddress?: string;
        city?: string;
        stateRegion?: string;
        zipCode?: string;
        country?: string;
      };
    };
    unit?: {
      id: string;
      unitName?: string;
    };
    singleUnitDetail?: {
      id: string;
    };
  };
  backgroundQuestions?: {
    smoke: boolean;
    militaryMember: boolean;
    criminalRecord: boolean;
    bankruptcy: boolean;
    refusedRent: boolean;
    evicted: boolean;
  } | null;
}

export interface BackendApplicant {
  id: string;
  applicationId: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  isPrimary: boolean;
}

export interface BackendOccupant {
  id: string;
  applicationId: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  dateOfBirth: string;
  relationship: string;
}

export interface BackendPet {
  id: string;
  applicationId: string;
  type: string;
  name: string;
  weight?: string | null;
  breed: string;
  photoUrl?: string | null;
}

export interface BackendVehicle {
  id: string;
  applicationId: string;
  type: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  registeredIn: string;
}

export interface BackendResidenceHistory {
  id: string;
  applicationId: string;
  residenceType: 'RENTED' | 'OWNED' | 'FAMILY';
  monthlyRent?: string | null;
  moveInDate: string;
  moveOutDate?: string | null;
  isCurrent: boolean;
  landlordName: string;
  landlordEmail: string;
  landlordPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  additionalInfo?: string | null;
}

export interface BackendIncomeDetail {
  id: string;
  applicationId: string;
  incomeType: string;
  companyName: string;
  positionTitle: string;
  startDate: string;
  endDate?: string | null;
  currentEmployment: boolean;
  monthlyIncome: string;
  officeAddress: string;
  office?: string | null;
  companyPhone?: string | null;
  supervisorName: string;
  supervisorPhone: string;
  supervisorEmail?: string | null;
  additionalInfo?: string | null;
}

export interface BackendEmergencyContact {
  id: string;
  applicationId: string;
  contactName: string;
  phoneNumber: string;
  email: string;
  relationship: string;
  details?: string | null;
}

export interface BackendReferenceContact {
  id: string;
  applicationId: string;
  contactName: string;
  phoneNumber: string;
  email: string;
  relationship: string;
  yearsKnown: number;
}

// DTOs for creating/updating
export interface CreateApplicationDto {
  leasingId: string;
  invitedById?: string;
  status?: 'DRAFT' | 'SUBMITTED' | 'REVIEWING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  moveInDate: string;
  bio?: string;
  additionalResidenceInfo?: string;
  additionalIncomeInfo?: string;
  imageUrl?: string;
  applicants: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    isPrimary?: boolean;
  }[];
  occupants?: {
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    dateOfBirth: string;
    relationship: string;
  }[];
  pets?: {
    type: string;
    name: string;
    weight?: number;
    breed: string;
    photoUrl?: string;
  }[];
  vehicles?: {
    type: string;
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
    registeredIn: string;
  }[];
  residenceHistory?: {
    residenceType: 'RENTED' | 'OWNED' | 'FAMILY';
    monthlyRent?: number;
    moveInDate: string;
    moveOutDate?: string;
    isCurrent?: boolean;
    landlordName: string;
    landlordEmail?: string;
    landlordPhone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    additionalInfo?: string;
  }[];
  incomeDetails?: {
    incomeType: string;
    companyName: string;
    positionTitle: string;
    startDate: string;
    endDate?: string;
    currentEmployment?: boolean;
    monthlyIncome: number;
    officeAddress: string;
    office?: string;
    companyPhone?: string;
    supervisorName: string;
    supervisorPhone: string;
    supervisorEmail?: string;
    additionalInfo?: string;
  }[];
  emergencyContacts?: {
    contactName: string;
    phoneNumber: string;
    email: string;
    relationship: string;
    details?: string;
  }[];
  referenceContacts?: {
    contactName: string;
    phoneNumber: string;
    email: string;
    relationship: string;
    yearsKnown: number;
  }[];
  backgroundQuestions?: {
    smoke: boolean;
    militaryMember: boolean;
    criminalRecord: boolean;
    bankruptcy: boolean;
    refusedRent: boolean;
    evicted: boolean;
  };
  customBackgroundAnswers?: {
    questionId: string;
    answer: boolean;
  }[];
}

class ApplicationService {
  /**
   * Transform frontend form data to backend DTO format
   */
  private transformFormDataToDto(formData: ApplicationFormData, leasingId: string): CreateApplicationDto {
    return {
      leasingId,
      status: 'SUBMITTED',
      moveInDate: formData.moveInDate instanceof Date
        ? formData.moveInDate.toISOString()
        : (typeof formData.moveInDate === 'string' ? formData.moveInDate : new Date().toISOString()),
      bio: formData.shortBio || undefined,
      additionalResidenceInfo: formData.additionalResidenceInfo || undefined,
      additionalIncomeInfo: formData.additionalIncomeInfo || undefined,
      imageUrl: (formData as any).photoUrl || undefined, // Use uploaded photo URL if available
      applicants: [
        {
          firstName: formData.firstName,
          middleName: formData.middleName || undefined,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dob instanceof Date
            ? formData.dob.toISOString()
            : (typeof formData.dob === 'string' ? formData.dob : new Date().toISOString()),
          isPrimary: true,
        },
      ],
      occupants: formData.occupants.map((o) => ({
        firstName: o.firstName,
        lastName: o.lastName,
        email: o.email,
        phoneNumber: o.phoneNumber,
        dateOfBirth: o.dob instanceof Date
          ? o.dob.toISOString()
          : (typeof o.dob === 'string' ? o.dob : new Date().toISOString()),
        relationship: o.relationship,
      })),
      pets: formData.pets.map((p) => ({
        type: p.type,
        name: p.name,
        weight: p.weight ? parseFloat(p.weight) : undefined,
        breed: p.breed,
        photoUrl: undefined, // TODO: Handle photo upload if needed
      })),
      vehicles: formData.vehicles.map((v) => ({
        type: v.type,
        make: v.make,
        model: v.model,
        year: parseInt(v.year, 10),
        color: v.color,
        licensePlate: v.licensePlate,
        registeredIn: v.registeredIn,
      })),
      residenceHistory: formData.residences.map((r) => {
        // Handle moveInDate: could be Date object or string
        let moveInDateStr: string;
        if (r.moveInDate instanceof Date) {
          moveInDateStr = r.moveInDate.toISOString();
        } else if (typeof r.moveInDate === 'string') {
          moveInDateStr = r.moveInDate;
        } else {
          moveInDateStr = new Date().toISOString();
        }

        // Handle moveOutDate: could be Date object, string, or undefined
        let moveOutDateStr: string | undefined;
        if (r.moveOutDate instanceof Date) {
          moveOutDateStr = r.moveOutDate.toISOString();
        } else if (typeof r.moveOutDate === 'string') {
          moveOutDateStr = r.moveOutDate;
        } else {
          moveOutDateStr = undefined;
        }

        // Use state as city if city is not provided (for countries without cities)
        const cityValue = r.city && r.city.trim() !== '' ? r.city : r.state;

        return {
          residenceType: r.residencyType === 'Rent' ? 'RENTED' : 'OWNED',
          monthlyRent: r.rentAmount ? parseFloat(r.rentAmount) : undefined,
          moveInDate: moveInDateStr,
          moveOutDate: moveOutDateStr,
          isCurrent: r.isCurrent,
          landlordName: r.landlordName || 'N/A',
          landlordPhone: r.landlordPhone || '',
          address: r.address,
          city: cityValue,
          state: r.state,
          zipCode: r.zip,
          country: r.country,
          additionalInfo: r.reason || undefined,
        };
      }),
      incomeDetails: formData.incomes.map((i) => {
        // Handle startDate: could be Date object or string
        let startDateStr: string;
        if (i.startDate instanceof Date) {
          startDateStr = i.startDate.toISOString();
        } else if (typeof i.startDate === 'string') {
          startDateStr = i.startDate;
        } else {
          startDateStr = new Date().toISOString();
        }

        // Handle endDate: could be Date object, string, or undefined
        let endDateStr: string | undefined;
        if (i.endDate instanceof Date) {
          endDateStr = i.endDate.toISOString();
        } else if (typeof i.endDate === 'string') {
          endDateStr = i.endDate;
        } else {
          endDateStr = undefined;
        }

        return {
          incomeType: i.incomeType,
          companyName: i.company,
          positionTitle: i.position,
          startDate: startDateStr,
          endDate: endDateStr,
          currentEmployment: i.currentEmployment,
          monthlyIncome: parseFloat(i.monthlyAmount) || 0,
          officeAddress: i.address,
          office: i.office,
          companyPhone: i.companyPhone,
          supervisorName: i.supervisorName,
          supervisorPhone: i.supervisorPhone,
          supervisorEmail: i.supervisorEmail,
          additionalInfo: undefined,
        };
      }),
      emergencyContacts: formData.emergencyContacts.map((c) => ({
        contactName: c.fullName,
        phoneNumber: c.phoneNumber,
        email: c.email,
        relationship: c.relationship,
        details: c.details || undefined,
      })),
      backgroundQuestions: formData.backgroundQuestions && Object.keys(formData.backgroundQuestions).length > 0 ? {
        smoke: formData.backgroundQuestions.smoke === true,
        militaryMember: formData.backgroundQuestions.military === true,
        criminalRecord: formData.backgroundQuestions.crime === true,
        bankruptcy: formData.backgroundQuestions.bankruptcy === true,
        refusedRent: formData.backgroundQuestions.refuseRent === true,
        evicted: formData.backgroundQuestions.evicted === true
      } : undefined,
      customBackgroundAnswers: (formData as any).customBackgroundAnswers && (formData as any).customBackgroundAnswers.length > 0
        ? (formData as any).customBackgroundAnswers
        : undefined,
    };
  }

  /**
   * Transform user application form data to backend DTO format
   */
  private transformUserFormDataToDto(formData: UserApplicationFormData, leasingId: string): CreateApplicationDto {
    // Helper to format phone number with country code
    const formatPhoneNumber = (phoneNumber: string, countryCode?: string): string => {
      if (!phoneNumber) return '';
      if (!countryCode) return phoneNumber;

      // Parse country code format: "isoCode|phonecode" (e.g., "US|+1")
      let phonecode = countryCode;
      if (countryCode.includes('|')) {
        const parts = countryCode.split('|');
        if (parts.length > 1 && parts[1]) {
          phonecode = parts[1];
        }
      }

      // If phonecode is just letters (ISO code), return phone number without code
      if (/^[A-Za-z]+$/.test(phonecode)) {
        return phoneNumber;
      }

      // Ensure phonecode starts with '+'
      const formattedCode = phonecode.startsWith('+') ? phonecode : `+${phonecode}`;
      return `${formattedCode} ${phoneNumber}`;
    };

    // Helper to format date
    const formatDate = (date: Date | undefined): string => {
      if (!date) return new Date().toISOString();
      if (date instanceof Date) {
        return date.toISOString();
      }
      return typeof date === 'string' ? date : new Date().toISOString();
    };

    return {
      leasingId,
      status: 'SUBMITTED',
      moveInDate: formatDate(formData.moveInDate),
      bio: formData.shortBio || undefined,
      additionalResidenceInfo: formData.additionalResidenceInfo || undefined,
      additionalIncomeInfo: formData.additionalIncomeInfo || undefined,
      imageUrl: formData.photoUrl || undefined,
      applicants: [
        {
          firstName: formData.firstName,
          middleName: formData.middleName || undefined,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formatPhoneNumber(formData.phoneNumber, formData.phoneCountryCode),
          dateOfBirth: formatDate(formData.dob),
          isPrimary: true,
        },
      ],
      occupants: formData.occupants?.length > 0 ? formData.occupants.map((o) => ({
        firstName: o.firstName || undefined,
        lastName: o.lastName || undefined,
        email: o.email || undefined,
        phoneNumber: o.phoneNumber ? formatPhoneNumber(o.phoneNumber, o.phoneCountryCode) : undefined,
        dateOfBirth: formatDate(o.dob),
        relationship: o.relationship,
      })) : undefined,
      pets: formData.pets?.length > 0 ? formData.pets.map((p) => ({
        type: p.type,
        name: p.name,
        weight: p.weight ? parseFloat(p.weight) : undefined,
        breed: p.breed,
        photoUrl: p.existingPhotoUrl || undefined,
      })) : undefined,
      vehicles: formData.vehicles?.length > 0 ? formData.vehicles.map((v) => ({
        type: v.type,
        make: v.make,
        model: v.model,
        year: parseInt(v.year, 10),
        color: v.color,
        licensePlate: v.licensePlate,
        registeredIn: v.registeredIn,
      })) : undefined,
      residenceHistory: formData.residences?.length > 0 ? formData.residences.map((r) => {
        const cityValue = r.city && r.city.trim() !== '' ? r.city.trim() : r.state;

        return {
          residenceType: r.residencyType === 'Rent' ? 'RENTED' : r.residencyType === 'Own' ? 'OWNED' : 'FAMILY',
          monthlyRent: r.rentAmount ? parseFloat(r.rentAmount) : undefined,
          moveInDate: formatDate(r.moveInDate),
          moveOutDate: r.moveOutDate ? formatDate(r.moveOutDate) : undefined,
          isCurrent: r.isCurrent,
          landlordName: r.landlordName || 'N/A',
          landlordEmail: r.landlordEmail || undefined,
          landlordPhone: r.landlordPhone || '',
          address: r.address,
          city: cityValue,
          state: r.state,
          zipCode: r.zip,
          country: r.country,
          additionalInfo: r.reason || undefined,
        };
      }) : undefined,
      incomeDetails: formData.incomes?.length > 0 ? formData.incomes.map((i) => ({
        incomeType: i.incomeType,
        companyName: i.company,
        positionTitle: i.position,
        startDate: formatDate(i.startDate),
        endDate: i.endDate ? formatDate(i.endDate) : undefined,
        currentEmployment: i.currentEmployment ?? false,
        monthlyIncome: parseFloat(i.monthlyAmount) || 0,
        officeAddress: i.address,
        office: i.office || undefined,
        companyPhone: i.companyPhone || undefined,
        supervisorName: i.supervisorName,
        supervisorPhone: i.supervisorPhone,
        supervisorEmail: i.supervisorEmail || undefined,
        additionalInfo: undefined,
      })) : undefined,
      emergencyContacts: formData.emergencyContacts?.length > 0 ? formData.emergencyContacts.map((c) => ({
        contactName: c.fullName,
        phoneNumber: formatPhoneNumber(c.phoneNumber, c.phoneCountryCode),
        email: c.email,
        relationship: c.relationship,
        details: c.details || undefined,
      })) : undefined,
      backgroundQuestions: formData.backgroundQuestions && Object.keys(formData.backgroundQuestions).length > 0 ? {
        smoke: formData.backgroundQuestions.smoke === true,
        militaryMember: formData.backgroundQuestions.military === true,
        criminalRecord: formData.backgroundQuestions.crime === true,
        bankruptcy: formData.backgroundQuestions.bankruptcy === true,
        refusedRent: formData.backgroundQuestions.refuseRent === true,
        evicted: formData.backgroundQuestions.evicted === true
      } : undefined,
      customBackgroundAnswers: formData.customBackgroundAnswers && formData.customBackgroundAnswers.length > 0
        ? formData.customBackgroundAnswers
        : undefined,
    };
  }

  /**
   * Create a new application
   */
  async create(formData: ApplicationFormData, leasingId: string): Promise<BackendApplication> {
    const dto = this.transformFormDataToDto(formData, leasingId);

    const response = await fetch(API_ENDPOINTS.APPLICATION.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create application';
      let errorMessages: string[] = [];
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessages = errorData.message;
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessages = [errorData.message];
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessages = [errorData.error];
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to create application: ${response.statusText}`;
        errorMessages = [errorMessage];
      }
      const error = new Error(errorMessage) as Error & { messages?: string[] };
      error.messages = errorMessages;
      throw error;
    }

    return response.json();
  }

  /**
   * Create a new application from user application form data
   */
  async createUserApplication(formData: UserApplicationFormData, leasingId: string): Promise<BackendApplication> {
    const dto = this.transformUserFormDataToDto(formData, leasingId);

    const response = await fetch(API_ENDPOINTS.APPLICATION.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create application';
      let errorMessages: string[] = [];
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessages = errorData.message;
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessages = [errorData.message];
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessages = [errorData.error];
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to create application: ${response.statusText}`;
        errorMessages = [errorMessage];
      }
      const error = new Error(errorMessage) as Error & { messages?: string[] };
      error.messages = errorMessages;
      throw error;
    }

    return response.json();
  }

  /**
   * Get all applications
   */
  async getAll(): Promise<BackendApplication[]> {
    const response = await fetch(API_ENDPOINTS.APPLICATION.GET_ALL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch applications';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to fetch applications: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get application by ID
   */
  async getOne(id: string): Promise<BackendApplication> {
    const response = await fetch(API_ENDPOINTS.APPLICATION.GET_ONE(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch application';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to fetch application: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get applications by leasing ID
   */
  async getByLeasingId(leasingId: string): Promise<BackendApplication[]> {
    const response = await fetch(API_ENDPOINTS.APPLICATION.GET_BY_LEASING(leasingId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch applications for leasing';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to fetch applications: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Update an application
   */
  async update(id: string, updateData: Partial<CreateApplicationDto>): Promise<BackendApplication> {
    const response = await fetch(API_ENDPOINTS.APPLICATION.UPDATE(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update application';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to update application: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Send invitation to apply for a property (supports multiple emails, max 5)
   */
  async inviteToApply(emails: string[], propertyId: string): Promise<{
    message: string;
    successful: number;
    failed: number;
    existingEmails: string[];
    nonExistingEmails: string[];
    propertyName: string;
    propertyManagerName: string;
  }> {
    const response = await fetch(API_ENDPOINTS.APPLICATION.INVITE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ emails, propertyId }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to send invitation';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to send invitation: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }
  /**
   * Delete an application
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.APPLICATION.DELETE(id), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = "Failed to delete application";
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join(". ");
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to delete application: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
  }
}


export const applicationService = new ApplicationService();

