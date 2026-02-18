import { useState, useEffect, useMemo } from 'react';
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
    FileText,
    Pencil,
    Trash2
} from 'lucide-react';
import DeleteConfirmationModal from '@/components/common/modals/DeleteConfirmationModal';
import { Country } from 'country-state-city';
import UserEditApplicantInfoModal from './components/UserEditApplicantInfoModal';
import UserAddOccupantModal from './components/UserAddOccupantModal';
import UserAddPetModal from './components/UserAddPetModal';
import UserAddVehicleModal from './components/UserAddVehicleModal';
import UserAddResidenceModal from './components/UserAddResidenceModal';
import UserAddIncomeModal from './components/UserAddIncomeModal';
import UserEditBackgroundQuestionsModal, { type BackgroundQuestionsData } from './components/UserEditBackgroundQuestionsModal';
import UserAddReferenceModal, { type ReferenceFormData } from './components/UserAddReferenceModal';
import UserAddEmergencyContactModal from './components/UserAddEmergencyContactModal';
import UserAddFileModal from './components/UserAddFileModal';
import {
    type EmergencyContactFormData,
    type OccupantFormData,
    type PetFormData,
    type VehicleFormData,
    type ResidenceFormData,
    type IncomeFormData,
} from './store/types';
import { type FormData as ApplicantFormData } from './components/forms/ApplicantForm';
import { useGetApplication, useUpdateApplication } from '../../../../hooks/useApplicationQueries';
import {
    type BackendApplication,
    type BackendApplicant,
    type BackendOccupant,
    type BackendPet,
    type BackendVehicle,
    type BackendResidenceHistory,
    type BackendIncomeDetail,
    type BackendEmergencyContact,
    type BackendReferenceContact
} from '../../../../services/application.service';


const handleConfirmDeleteGeneric = async (
    type: 'occupant' | 'pet' | 'vehicle' | 'residence' | 'income' | 'emergencyContact' | 'reference' | 'attachment',
    id: string | number,
    backendApplication: BackendApplication,
    currentId: string,
    updateMutation: any,
    refetch: () => void,
    onClose: () => void
) => {
    if (!backendApplication) return;

    const updateData: Record<string, any> = {};
    let field = '';

    switch (type) {
        case 'occupant':
            field = 'occupants';
            updateData[field] = (backendApplication.occupants || []).filter((o: BackendOccupant) => o.id !== id);
            break;
        case 'vehicle':
            field = 'vehicles';
            updateData[field] = (backendApplication.vehicles || []).filter((v: BackendVehicle) => v.id !== id);
            break;
        case 'pet':
            field = 'pets';
            updateData[field] = (backendApplication.pets || []).filter((p: BackendPet) => p.id !== id);
            break;
        case 'residence':
            field = 'residenceHistory';
            updateData[field] = (backendApplication.residenceHistory || []).filter((r: BackendResidenceHistory) => r.id !== id);
            break;
        case 'income':
            field = 'incomeDetails';
            updateData[field] = (backendApplication.incomeDetails || []).filter((i: BackendIncomeDetail) => i.id !== id);
            break;
        case 'emergencyContact':
            field = 'emergencyContacts';
            updateData[field] = (backendApplication.emergencyContacts || []).filter((c: BackendEmergencyContact) => c.id !== id);
            break;
        case 'reference':
            field = 'referenceContacts';
            updateData[field] = (backendApplication.referenceContacts || []).filter((r: BackendReferenceContact) => r.id !== id);
            break;
    }

    if (!field) return;

    updateMutation.mutate(
        { id: currentId, updateData },
        {
            onSuccess: () => {
                refetch();
                onClose();
            },
            onError: (err: any) => {
                alert(err.message || `Failed to delete ${type}`);
            }
        }
    );
};
// Helper to format phone number with country code
const formatPhoneNumberForBackend = (phoneNumber: string, countryCode?: string): string => {
    if (!phoneNumber) return '';
    if (!countryCode) return phoneNumber;

    // Parse country code format: "isoCode|phonecode" (e.g., "US|1" or "IN|91")
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

    // If the phone number already starts with a '+' or the formattedCode, don't prepend again
    if (phoneNumber.trim().startsWith('+')) {
        return phoneNumber.trim();
    }

    return `${formattedCode} ${phoneNumber.trim()}`;
};

// Helper to split phone number into code and number
const getPhonePartsForInitialData = (fullNumber: string | null | undefined): { phoneNumber: string; phoneCountryCode: string } => {
    if (!fullNumber) return { phoneNumber: '', phoneCountryCode: 'IN|91' };

    let strNum = String(fullNumber).trim();
    let detectedIsoCode = 'IN';
    let detectedPhoneCode = '91';

    const countries = Country.getAllCountries().sort((a, b) => b.phonecode.length - a.phonecode.length);

    let foundMatch = true;
    while (foundMatch && strNum.startsWith('+')) {
        foundMatch = false;
        for (const country of countries) {
            const prefix = `+${country.phonecode}`;
            if (strNum.startsWith(prefix)) {
                detectedIsoCode = country.isoCode;
                detectedPhoneCode = country.phonecode;
                strNum = strNum.substring(prefix.length).trim();
                foundMatch = true;
                break;
            }
        }
        if (!foundMatch) {
            // If it starts with + but no country matches, maybe it's just one +
            const match = strNum.match(/^\+(\d+)\s*(.*)$/);
            if (match) {
                detectedPhoneCode = match[1];
                strNum = match[2].trim();
                foundMatch = true;
            } else {
                break;
            }
        }
    }

    return {
        phoneNumber: strNum,
        phoneCountryCode: `${detectedIsoCode}|${detectedPhoneCode}`
    };
};

const RentIncomePercentage = ({ rentPerMonth, householdIncome }: { rentPerMonth: number, householdIncome: number }) => {
    const rentIncomeRatio = householdIncome > 0 ? rentPerMonth / householdIncome : 0;
    const percentage = Math.round(rentIncomeRatio * 100);
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference * (1 - rentIncomeRatio);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 w-full lg:w-auto min-w-[280px]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 font-semibold text-base">Rent-Income Percentage</h3>
                <Info size={18} className="text-gray-400" />
            </div>
            <div className="flex items-center justify-between">
                <div className="space-y-4">
                    <div>
                        <p className="text-2xl font-semibold text-gray-900">${rentPerMonth.toLocaleString('en-US')}.00</p>
                        <p className="text-gray-500 text-sm font-medium">Rent/mo</p>
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-gray-900">${householdIncome.toLocaleString('en-US')}.00</p>
                        <p className="text-gray-500 text-sm font-medium">Household Income</p>
                    </div>
                </div>
                <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                        <circle
                            cx="48" cy="48" r="40" stroke="#7ED957" strokeWidth="8" fill="none"
                            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-[#7ED957]">
                            {householdIncome > 0 ? `${percentage}%` : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ResidenceCard = ({ residence, idx, isApproved, onEdit, onDelete }: any) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 relative group">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#7ED957]/10 flex items-center justify-center text-[#5AB935]">
                    <Home size={20} />
                </div>
                <div>
                    <h4 className="text-base font-bold text-gray-900 leading-tight">{residence.address}</h4>
                    <p className="text-xs text-gray-500 font-medium">{residence.location}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${residence.status === 'Current' ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-gray-100 text-gray-500'}`}>
                    {residence.status}
                </span>
                {!isApproved && (
                    <div className="flex gap-1">
                        <button onClick={(e) => { e.stopPropagation(); onEdit(idx); }} className="p-1.5 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all border border-gray-100 shadow-sm"><Pencil size={15} /></button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(idx); }} className="p-1.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border border-gray-100 shadow-sm"><Trash2 size={15} /></button>
                    </div>
                )}
            </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
            <div className="space-y-1"><p className="text-[11px] font-medium text-gray-400 uppercase tracking-tight">Rent or Own</p><p className="text-sm font-semibold text-gray-700">{residence.rentOrOwn}</p></div>
            <div className="space-y-1"><p className="text-[11px] font-medium text-gray-400 uppercase tracking-tight">Monthly Rent</p><p className="text-sm font-bold text-gray-900">${residence.rent.toLocaleString('en-US')}.00</p></div>
            <div className="space-y-1"><p className="text-[11px] font-medium text-gray-400 uppercase tracking-tight">Move In</p><p className="text-sm font-semibold text-gray-700">{residence.moveInDate}</p></div>
            <div className="space-y-1"><p className="text-[11px] font-medium text-gray-400 uppercase tracking-tight">Move Out</p><p className="text-sm font-semibold text-gray-700">{residence.moveOutDate || '—'}</p></div>
        </div>
        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-[10px]">{residence.landlord.initials}</div>
                <div><p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight leading-none mb-1">Landlord</p><p className="text-sm font-semibold text-gray-700 leading-none">{residence.landlord.name}</p></div>
            </div>
        </div>
    </div>
);

const IncomeCard = ({ income, idx, isApproved, onEdit, onDelete }: any) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 relative group">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#7ED957]/10 flex items-center justify-center text-[#5AB935]"><Briefcase size={20} /></div>
                <div><h4 className="text-base font-bold text-gray-900 leading-tight">{income.jobTitle}</h4><p className="text-xs text-gray-500 font-medium">{income.company}</p></div>
            </div>
            <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${income.status === 'Current' ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-gray-100 text-gray-500'}`}>{income.status}</span>
                {!isApproved && (
                    <div className="flex gap-1">
                        <button onClick={(e) => { e.stopPropagation(); onEdit(idx); }} className="p-1.5 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all border border-gray-100 shadow-sm"><Pencil size={15} /></button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(idx); }} className="p-1.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border border-gray-100 shadow-sm"><Trash2 size={15} /></button>
                    </div>
                )}
            </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
            <div className="space-y-1"><p className="text-[11px] font-medium text-gray-400 uppercase tracking-tight">Income Type</p><p className="text-sm font-semibold text-gray-700">{income.type}</p></div>
            <div className="space-y-1"><p className="text-[11px] font-medium text-gray-400 uppercase tracking-tight">Monthly Income</p><p className="text-sm font-bold text-gray-900">${income.incomePerMonth.toLocaleString('en-US')}.00</p></div>
            <div className="space-y-1"><p className="text-[11px] font-medium text-gray-400 uppercase tracking-tight">Start Date</p><p className="text-sm font-semibold text-gray-700">{income.startDate}</p></div>
            <div className="space-y-1"><p className="text-[11px] font-medium text-gray-400 uppercase tracking-tight">Office #</p><p className="text-sm font-semibold text-gray-700">{income.officeNumber || '—'}</p></div>
        </div>
        <div className="pt-4 border-t border-gray-50 flex flex-wrap gap-x-8 gap-y-2">
            <div className="flex flex-col"><p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight mb-0.5">Work Phone</p><p className="text-sm font-semibold text-gray-700">{income.workPhone || '—'}</p></div>
            <div className="flex flex-col"><p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight mb-0.5">Address</p><p className="text-sm font-semibold text-gray-700">{income.address}</p></div>
        </div>
    </div>
);

const OccupantCard = ({ occupant, idx, isApproved, onEdit, onDelete }: any) => (
    <div key={occupant.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex gap-4 relative group">
        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#7ED957] flex-shrink-0"><Users size={24} /></div>
        <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
                <h4 className="text-base font-bold text-gray-900 truncate pr-16">{occupant.name}</h4>
                <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider">{occupant.relationship}</span>
                    {!isApproved && (
                        <>
                            <button onClick={() => onEdit(idx)} className="p-1 text-gray-400 hover:text-[#7ED957] hover:bg-gray-50 rounded-lg transition-colors"><Pencil size={14} /></button>
                            <button onClick={() => onDelete(occupant)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                        </>
                    )}
                </div>
            </div>
            <div className="space-y-3 mt-3 pt-3 border-t border-gray-50">
                <div className="grid grid-cols-2 gap-2">
                    <div><p className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">Birth Date</p><p className="text-sm font-semibold text-gray-700">{occupant.dob}</p></div>
                    <div><p className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">Phone</p><p className="text-sm font-semibold text-gray-700">{occupant.phone || '—'}</p></div>
                </div>
                <div><p className="text-[10px] font-medium text-gray-400 uppercase tracking-tight mb-0.5">Email</p><p className="text-sm font-semibold text-gray-700 truncate">{occupant.email || '—'}</p></div>
            </div>
        </div>
    </div>
);

const PetCard = ({ pet, idx, isApproved, onEdit, onDelete }: any) => (
    <div key={pet.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 flex gap-4 relative group">
        <div className="w-20 h-20 rounded-lg bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
            {pet.photoUrl ? <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" /> : <PawPrint size={32} className="text-[#7ED957] opacity-60" />}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
                <h4 className="text-lg font-bold text-gray-900 truncate pr-8">{pet.name}</h4>
                {!isApproved && (
                    <div className="absolute top-4 right-4 flex gap-1">
                        <button onClick={(e) => { e.stopPropagation(); onEdit(idx); }} className="p-1.5 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all border border-gray-100 shadow-sm"><Pencil size={15} /></button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(idx); }} className="p-1.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border border-gray-100 shadow-sm"><Trash2 size={15} /></button>
                    </div>
                )}
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-0.5 rounded-full bg-[#7ED957]/10 text-[#5AB935] text-[10px] font-bold uppercase tracking-wider">{pet.type}</span>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">{pet.weight}</span>
            </div>
            <div className="space-y-0.5"><p className="text-[11px] font-medium text-gray-400 uppercase tracking-tight leading-none">Breed</p><p className="text-sm font-semibold text-gray-700 truncate">{pet.breed}</p></div>
        </div>
    </div>
);

const VehicleCard = ({ vehicle, idx, isApproved, onEdit, onDelete }: any) => (
    <div key={vehicle.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 relative group">
        <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-[#7ED957] flex-shrink-0"><Car size={24} /></div>
            <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-gray-900 truncate">{vehicle.year} {vehicle.make} {vehicle.model}</h4>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider leading-none mt-1">{vehicle.licensePlate}</p>
            </div>
            {!isApproved && (
                <div className="flex items-center gap-1">
                    <button onClick={() => onEdit(idx)} className="p-1.5 text-gray-400 hover:text-[#7ED957] hover:bg-gray-50 rounded-lg transition-colors"><Pencil size={18} /></button>
                    <button onClick={() => onDelete(vehicle)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                </div>
            )}
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
            <div className="space-y-0.5"><p className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">Color</p><p className="text-sm font-semibold text-gray-700">{vehicle.color}</p></div>
            <div className="space-y-0.5"><p className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">Plate #</p><p className="text-sm font-semibold text-gray-700">{vehicle.licensePlate}</p></div>
        </div>
    </div>
);

const ContactCard = ({ contact, idx, isApproved, onEdit, onDelete }: any) => (
    <div key={contact.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex gap-4 relative group">
        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#7ED957] flex-shrink-0"><Contact size={24} /></div>
        <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
                <h4 className="text-base font-bold text-gray-900 truncate pr-8">{contact.name}</h4>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#7ED957]/10 text-[#5AB935] text-[10px] font-bold uppercase tracking-wider">{contact.relationship}</span>
                    {!isApproved && (
                        <div className="flex gap-1">
                            <button onClick={(e) => { e.stopPropagation(); onEdit(idx, contact.type); }} className="p-1.5 bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all shadow-sm border border-gray-100"><Pencil size={14} /></button>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(idx, contact); }} className="p-1.5 bg-gray-50 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shadow-sm border border-gray-100"><Trash2 size={14} /></button>
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-2 mt-3 pt-3 border-t border-gray-50">
                <div className="flex items-center justify-between"><p className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">Type</p><p className="text-sm font-semibold text-gray-700">{contact.type}</p></div>
                <div className="flex items-center justify-between"><p className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">Phone</p><p className="text-sm font-semibold text-gray-700">{contact.phone || '—'}</p></div>
                <div className="flex flex-col mt-1"><p className="text-[10px] font-medium text-gray-400 uppercase tracking-tight mb-0.5">Email</p><p className="text-sm font-semibold text-gray-700 truncate">{contact.email || '—'}</p></div>
            </div>
        </div>
    </div>
);

const SummaryHeader = ({ application, navigate, getStatusColor }: any) => (
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
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
                    <div className="p-1 rounded-full border border-gray-900">
                        <User size={16} className="text-gray-900" />
                    </div>
                    <span>Applicant</span>
                </div>

                <div className="flex items-start justify-between pl-1">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-[#2E6819] bg-[#E4F2E2] text-xl font-bold shadow-md overflow-hidden">
                            {application.applicantName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <p className="text-xl font-semibold text-gray-900">
                                    {application.applicantName}
                                </p>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(application.status)}`}>
                                    {application.status}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <a href={`tel:${application.phone}`} className="text-gray-500 font-medium hover:opacity-80 transition-opacity">{application.phone}</a>
                                <a href={`mailto:${application.email}`} className="text-gray-500 font-medium hover:opacity-80 transition-opacity">{application.email}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
);

const AdditionalQuestionsContent = ({ questions }: any) => (
    <div className="space-y-4 pt-4">
        {[
            { key: 'smoke', label: 'Do you or any occupants smoke?', icon: <Info size={18} /> },
            { key: 'military', label: 'Are any occupants members in the military?', icon: <Info size={18} /> },
            { key: 'crime', label: 'Have you ever been charged or convicted of a crime?', icon: <Info size={18} /> },
            { key: 'bankruptcy', label: 'Have you ever filed for bankruptcy?', icon: <Info size={18} /> },
            { key: 'refuseRent', label: 'Have you ever willfully refused to pay rent when it was due?', icon: <Info size={18} /> },
            { key: 'evicted', label: 'Have you ever been evicted or left a tenancy owing money?', icon: <Info size={18} /> }
        ].map((q) => (
            <div key={q.key} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100/80">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                        <div className="mt-0.5 text-gray-400">{q.icon}</div>
                        <p className="text-sm font-medium text-gray-700 leading-relaxed">{q.label}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${questions[q.key] === 'Yes' ? 'bg-red-50 text-red-600' : 'bg-[#DCFCE7] text-[#16A34A]'}`}>
                        {String(questions[q.key])}
                    </span>
                </div>
                {questions[q.key] === 'Yes' && questions.explanations[q.key] && (
                    <div className="mt-3 pl-11">
                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight mb-1">Explanation</p>
                            <p className="text-sm text-gray-700 leading-relaxed italic">"{questions.explanations[q.key]}"</p>
                        </div>
                    </div>
                )}
            </div>
        ))}
    </div>
);

const Breadcrumbs = ({ applicationNumber }: { applicationNumber: string }) => (
    <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-base font-medium">
            <li>
                <Link to="/userdashboard" className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Dashboard</Link>
            </li>
            <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
            <li>
                <Link to="/userdashboard/applications" className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Applications</Link>
            </li>
            <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
            <li className="text-[#1A1A1A] font-medium" aria-current="page">No.{applicationNumber}</li>
        </ol>
    </nav>
);

const formatDateStr = (date: any) => {
    if (!date) return '—';
    try {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch {
        return '—';
    }
};

const formatPhone = (phone: any) => {
    if (!phone) return '—';
    const s = String(phone).replace(/\D/g, '');
    if (s.length === 10) {
        return `(${s.substring(0, 3)}) ${s.substring(3, 6)}-${s.substring(6)}`;
    }
    return phone;
};

const mapBackendToUI = (backendApplication: any) => {
    if (!backendApplication) return null;

    const primaryApplicant = backendApplication.applicants?.find((a: any) => a.isPrimary) || backendApplication.applicants?.[0];

    // Map Occupants
    const occupantsData = (backendApplication.occupants || []).map((occ: any, idx: number) => ({
        id: occ.id || `occ_${idx}`,
        name: occ.name || [occ.firstName, occ.lastName].filter(Boolean).join(' ') || 'Unknown',
        relationship: occ.relationship || 'Occupant',
        dob: formatDateStr(occ.dateOfBirth),
        phone: formatPhone(occ.phoneNumber),
        email: occ.email || ''
    }));

    // Map Pets
    const petsData = (backendApplication.pets || []).map((pet: any, idx: number) => {
        const wStr = String(pet.weight || '');
        let displayWeight = wStr + 'kg';
        if (wStr === '5') {
            displayWeight = 'Under 5kg';
        } else if (wStr === '10') {
            displayWeight = '5-10kg';
        } else if (wStr === '20') {
            displayWeight = '10-20kg';
        } else if (wStr === '30') {
            displayWeight = 'Above 20kg';
        } else if (wStr.includes('<')) {
            displayWeight = wStr.replace('<', 'Under');
        } else if (wStr.includes('>')) {
            displayWeight = wStr.replace('>', 'Above');
        }

        return {
            id: pet.id || `pet_${idx}`,
            name: pet.name,
            type: pet.type,
            breed: pet.breed,
            weight: displayWeight,
            photoUrl: pet.photoUrl || null
        };
    });

    // Map Vehicles
    const vehiclesData = (backendApplication.vehicles || []).map((veh: any, idx: number) => ({
        id: veh.id || `veh_${idx}`,
        make: veh.make,
        model: veh.model,
        year: String(veh.year),
        color: veh.color,
        licensePlate: veh.licensePlate
    }));

    // Map Residences
    const residentialHistoryData = (backendApplication.residenceHistory || []).map((res: any, idx: number) => ({
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
    const incomeHistoryData = (backendApplication.incomeDetails || []).map((inc: any, idx: number) => ({
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

    // Map Contacts
    const emergencyContactsData = (backendApplication.emergencyContacts || []).map((contact: any, idx: number) => ({
        id: contact.id || `cont_${idx}`,
        name: contact.contactName,
        relationship: contact.relationship,
        phone: formatPhone(contact.phoneNumber),
        email: contact.email || '—',
        type: 'Emergency Contact'
    }));

    const referenceContactsData = (backendApplication.referenceContacts || []).map((contact: any, idx: number) => ({
        id: contact.id || `ref_${idx}`,
        name: contact.contactName,
        relationship: contact.relationship,
        phone: formatPhone(contact.phoneNumber),
        email: contact.email || '—',
        type: 'Reference'
    }));

    const contactsData = [...emergencyContactsData, ...referenceContactsData];
    const totalIncome = incomeHistoryData.reduce((acc: number, curr: any) => acc + curr.incomePerMonth, 0);
    const currentRent = residentialHistoryData.find((r: any) => r.status === 'Current')?.rent || 0;

    // Get property name - check multiple sources
    const property = backendApplication.leasing?.property;
    const beds = property?.leasing?.singleUnitDetail?.beds ?? property?.leasing?.unit?.beds ??
        backendApplication.leasing?.singleUnitDetail?.beds ?? backendApplication.leasing?.unit?.beds ?? null;

    // Check for listing title in multiple places (listing vs listings)
    const listingTitle = (property as any)?.listing?.title ||
        ((property as any)?.listings && (property as any).listings.length > 0
            ? (property as any).listings[0]?.title
            : null);

    const propertyName = property?.propertyName || listingTitle ||
        (beds !== null ? `${beds} Bedroom ${property?.propertyType === 'SINGLE' ? 'Property' : 'Unit'}` : null) ||
        'Unknown Property';

    const statusMap: Record<string, string> = {
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
        propertyName: propertyName,
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
            explanations: (backendApplication.backgroundQuestions as any)?.explanations || {},
        },
        attachments: 0,
        documentsData: [],
        termsAccepted: {
            date: formatDateStr(backendApplication.applicationDate || backendApplication.createdAt),
        },
    };
};

const ApplicationDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Use react-query hooks
    const { data: backendApplication, isLoading, error, refetch } = useGetApplication(id);
    const updateApplicationMutation = useUpdateApplication();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddOccupantModalOpen, setIsAddOccupantModalOpen] = useState(false);
    const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
    const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
    const [isAddResidenceModalOpen, setIsAddResidenceModalOpen] = useState(false);
    const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] = useState(false);
    const [isAddEmergencyContactModalOpen, setIsAddEmergencyContactModalOpen] = useState(false);
    const [isAddReferenceModalOpen, setIsAddReferenceModalOpen] = useState(false);
    const [isEditBackgroundInfoModalOpen, setIsEditBackgroundInfoModalOpen] = useState(false);
    const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);

    const [editingOccupantIndex, setEditingOccupantIndex] = useState<number | null>(null);
    const [editingPetIndex, setEditingPetIndex] = useState<number | null>(null);
    const [editingVehicleIndex, setEditingVehicleIndex] = useState<number | null>(null);
    const [editingResidenceIndex, setEditingResidenceIndex] = useState<number | null>(null);
    const [editingIncomeIndex, setEditingIncomeIndex] = useState<number | null>(null);
    const [editingContactIndex, setEditingContactIndex] = useState<number | null>(null);
    const [editingEmergencyContactIndex, setEditingEmergencyContactIndex] = useState<number | null>(null);

    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        type: 'occupant' | 'pet' | 'vehicle' | 'residence' | 'income' | 'emergencyContact' | 'reference' | 'attachment';
        id: string | number;
        title: string;
        itemName: string;
    }>({
        isOpen: false,
        type: 'occupant',
        id: '',
        title: '',
        itemName: '',
    });

    // Transform backend data to frontend format
    const application = useMemo(() => mapBackendToUI(backendApplication), [backendApplication]);

    // Check if application is approved (cannot be edited)
    const isApproved = application?.status === 'Approved';

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
    }, [application]);

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

    const applicationSections = useMemo(() => {
        if (!application) return [];
        return [
            { id: 'applicantInfo', icon: User, title: 'Applicant information', subtitle: application.applicantInfo.hasDetails ? '(Details)' : '(0 records)', recordCount: application.applicantInfo.hasDetails ? 1 : 0, primaryAction: 'Edit' },
            { id: 'additionalOccupants', icon: Users, title: 'Additional occupants', subtitle: `(${application.additionalOccupants} records)`, recordCount: application.additionalOccupants, primaryAction: '+ Add occupant' },
            { id: 'pets', icon: PawPrint, title: 'Pets', subtitle: `(${application.pets} records)`, recordCount: application.pets, primaryAction: '+ Add pet' },
            { id: 'vehicles', icon: Car, title: 'Vehicles', subtitle: `(${application.vehicles} records)`, recordCount: application.vehicles, primaryAction: '+ Add vehicle' },
            { id: 'residentialHistory', icon: Home, title: 'Residential history', subtitle: `(${application.residentialHistory} record)`, recordCount: application.residentialHistory, primaryAction: '+ Add residence' },
            { id: 'incomeHistory', icon: Briefcase, title: 'Income history', subtitle: `(${application.incomeHistory} record)`, recordCount: application.incomeHistory, primaryAction: '+ Add income' },
            { id: 'contacts', icon: Contact, title: 'Contacts', subtitle: `(${application.contacts} record)`, recordCount: application.contacts, primaryAction: '+ Add reference' },
            { id: 'attachments', icon: Paperclip, title: 'Attachments', subtitle: `(${application.attachments} file${application.attachments !== 1 ? 's' : ''})`, recordCount: application.attachments, primaryAction: '+ Add file' },
        ];
    }, [application]);

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

    const handleSectionPrimaryAction = (sectionId: string) => {
        const modalSetters: Record<string, (val: boolean) => void> = {
            applicantInfo: setIsEditModalOpen,
            additionalOccupants: setIsAddOccupantModalOpen,
            pets: setIsAddPetModalOpen,
            vehicles: setIsAddVehicleModalOpen,
            residentialHistory: setIsAddResidenceModalOpen,
            incomeHistory: setIsAddIncomeModalOpen,
            contacts: setIsAddEmergencyContactModalOpen,
            attachments: setIsAddFileModalOpen,
        };
        modalSetters[sectionId]?.(true);
    };


    const handleSaveApplicantInfo = (data: ApplicantFormData) => {
        if (!id || !backendApplication) return;

        const primaryApplicant = backendApplication.applicants?.find((a: any) => a.isPrimary) || backendApplication.applicants?.[0];

        const applicantsToUpdate = (backendApplication.applicants || []).map((a: BackendApplicant) => {
            // Update the primary applicant (or the first one if no primary marked)
            if (a.id === primaryApplicant?.id) {
                return {
                    firstName: data.firstName,
                    middleName: data.middleName || undefined,
                    lastName: data.lastName,
                    email: data.email,
                    phoneNumber: formatPhoneNumberForBackend(data.phoneNumber, data.phoneCountryCode),
                    dateOfBirth: data.dob ? data.dob.toISOString() : undefined,
                    isPrimary: !!a.isPrimary,
                };
            }
            return {
                firstName: a.firstName,
                middleName: a.middleName,
                lastName: a.lastName,
                email: a.email,
                phoneNumber: a.phoneNumber,
                dateOfBirth: a.dateOfBirth,
                isPrimary: !!a.isPrimary,
            };
        });

        // If no applicants exist, create one? (Corner case)

        updateApplicationMutation.mutate(
            {
                id,
                updateData: {
                    applicants: applicantsToUpdate,
                    bio: data.shortBio,
                    moveInDate: data.moveInDate ? data.moveInDate.toISOString() : undefined,
                    // Note: Photo upload handling would likely go here or separate API
                }
            },
            {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    refetch();
                },
                onError: (error: any) => {
                    console.error('Failed to update applicant info:', error);
                    alert(error.message || 'Failed to update applicant info');
                }
            }
        );
    };

    const handleSaveOccupant = (data: OccupantFormData) => {
        if (!id || !backendApplication) return;

        const currentOccupants = backendApplication.occupants || [];
        const occupantPayload = {
            firstName: data.firstName,
            lastName: data.lastName,
            name: [data.firstName, data.lastName].filter(Boolean).join(' ') || '',
            email: data.email || undefined,
            phoneNumber: formatPhoneNumberForBackend(data.phoneNumber, data.phoneCountryCode),
            dateOfBirth: data.dob ? data.dob.toISOString() : new Date().toISOString(),
            relationship: data.relationship
        };

        const updatedOccupants = currentOccupants.map((occ: any, idx: number) => {
            const isEditing = editingOccupantIndex === idx;
            const source = isEditing ? occupantPayload : occ;

            return {
                firstName: source.firstName || undefined,
                lastName: source.lastName || undefined,
                name: source.name || [source.firstName, source.lastName].filter(Boolean).join(' ') || '',
                email: source.email || undefined,
                phoneNumber: isEditing ? source.phoneNumber : (source.phoneNumber || undefined),
                dateOfBirth: source.dateOfBirth,
                relationship: source.relationship
            };
        });

        if (editingOccupantIndex === null) {
            updatedOccupants.push(occupantPayload);
        }

        updateApplicationMutation.mutate(
            {
                id,
                updateData: {
                    occupants: updatedOccupants
                }
            },
            {
                onSuccess: () => {
                    setIsAddOccupantModalOpen(false);
                    setEditingOccupantIndex(null);
                    refetch();
                },
                onError: (error: any) => {
                    console.error('Failed to save occupant:', error);
                    alert(error.message || 'Failed to save occupant');
                }
            }
        );
    };

    const handleSavePet = (data: PetFormData) => {
        if (!id || !backendApplication) return;

        const currentPets = backendApplication.pets || [];
        const parseWeight = (w: any): number => {
            if (typeof w === 'number') return w;
            const s = String(w);
            if (s.includes('<') || s.includes('Under')) return 5;
            if (s === '5-10kg') return 10;
            if (s === '10-20kg') return 20;
            if (s.includes('>') || s.includes('Above')) return 30;
            const match = s.match(/\d+/);
            return match ? parseInt(match[0], 10) : 0;
        };

        const petPayload = {
            type: data.type,
            name: data.name,
            weight: parseWeight(data.weight),
            breed: data.breed,
            photoUrl: data.existingPhotoUrl || undefined
        };

        const updatedPets = currentPets.map((p: any, idx: number) => {
            const isEditing = editingPetIndex === idx;
            const source = isEditing ? petPayload : p;

            return {
                type: source.type,
                name: source.name,
                weight: parseWeight(source.weight),
                breed: source.breed,
                photoUrl: source.photoUrl || undefined
            };
        }) as any[];

        if (editingPetIndex === null) {
            updatedPets.push(petPayload);
        }

        updateApplicationMutation.mutate(
            {
                id,
                updateData: {
                    pets: updatedPets
                }
            },
            {
                onSuccess: () => {
                    setIsAddPetModalOpen(false);
                    setEditingPetIndex(null);
                    refetch();
                },
                onError: (error: any) => {
                    console.error('Failed to save pet:', error);
                    alert(error.message || 'Failed to save pet');
                }
            }
        );
    };

    const handleSaveVehicle = (data: VehicleFormData) => {
        if (!id || !backendApplication) return;

        const currentVehicles = backendApplication.vehicles || [];
        const vehiclePayload = {
            type: data.type,
            make: data.make,
            model: data.model,
            year: parseInt(data.year, 10),
            color: data.color,
            licensePlate: data.licensePlate,
            registeredIn: data.registeredIn
        };

        const updatedVehicles = currentVehicles.map((veh: any, idx: number) => {
            const isEditing = editingVehicleIndex === idx;
            const source = isEditing ? vehiclePayload : veh;

            return {
                type: source.type,
                make: source.make,
                model: source.model,
                year: Number(source.year),
                color: source.color,
                licensePlate: source.licensePlate,
                registeredIn: source.registeredIn
            };
        });

        if (editingVehicleIndex === null) {
            updatedVehicles.push(vehiclePayload);
        }

        updateApplicationMutation.mutate(
            {
                id,
                updateData: {
                    vehicles: updatedVehicles
                }
            },
            {
                onSuccess: () => {
                    setIsAddVehicleModalOpen(false);
                    setEditingVehicleIndex(null);
                    refetch();
                },
                onError: (error: any) => {
                    console.error('Failed to save vehicle:', error);
                    alert(error.message || 'Failed to save vehicle');
                }
            }
        );
    };

    const handleSaveResidence = (data: ResidenceFormData) => {
        if (!id || !backendApplication) return;

        const currentResidences = backendApplication.residenceHistory || [];
        const cityValue = data.city && data.city.trim() !== '' ? data.city.trim() : data.state;
        const residenceType = (data.residencyType === 'Rent' ? 'RENTED' : data.residencyType === 'Own' ? 'OWNED' : 'FAMILY') as 'RENTED' | 'OWNED' | 'FAMILY';

        const residencePayload = {
            residenceType,
            monthlyRent: data.rentAmount ? parseFloat(data.rentAmount) : undefined,
            moveInDate: data.moveInDate ? data.moveInDate.toISOString() : new Date().toISOString(),
            moveOutDate: data.moveOutDate ? data.moveOutDate.toISOString() : undefined,
            isCurrent: data.isCurrent ?? (data.moveOutDate ? false : true),
            landlordName: data.landlordName || 'N/A',
            landlordEmail: data.landlordEmail || undefined,
            landlordPhone: data.landlordPhone || '',
            address: data.address,
            city: cityValue,
            state: data.state,
            zipCode: data.zip,
            country: data.country,
            additionalInfo: undefined
        };

        const updatedResidences = currentResidences.map((res: any, idx: number) => {
            const isEditing = editingResidenceIndex === idx;
            const source = isEditing ? residencePayload : res;

            const clean: any = {
                residenceType: source.residenceType || 'RENTED',
                monthlyRent: typeof source.monthlyRent === 'number' ? source.monthlyRent : parseFloat(String(source.monthlyRent || '0')),
                moveInDate: source.moveInDate,
                isCurrent: !!source.isCurrent,
                landlordName: source.landlordName || 'N/A',
                landlordPhone: source.landlordPhone || '',
                address: source.address,
                city: source.city,
                state: source.state,
                zipCode: source.zipCode || source.zip,
                country: source.country
            };

            if (source.moveOutDate) clean.moveOutDate = source.moveOutDate;
            if (source.landlordEmail) clean.landlordEmail = source.landlordEmail;
            if (source.additionalInfo) clean.additionalInfo = source.additionalInfo;

            return clean;
        });

        if (editingResidenceIndex === null) {
            updatedResidences.push(residencePayload);
        }

        updateApplicationMutation.mutate(
            {
                id,
                updateData: {
                    residenceHistory: updatedResidences
                }
            },
            {
                onSuccess: () => {
                    setIsAddResidenceModalOpen(false);
                    setEditingResidenceIndex(null);
                    refetch();
                },
                onError: (error: any) => {
                    console.error('Failed to save residence:', error);
                    alert(error.message || 'Failed to save residence');
                }
            }
        );
    };

    const handleSaveIncome = (data: IncomeFormData) => {
        if (!id || !backendApplication) return;

        const currentIncomes = backendApplication.incomeDetails || [];

        const incomePayload = {
            incomeType: data.incomeType,
            companyName: data.company,
            positionTitle: data.position,
            startDate: data.startDate ? data.startDate.toISOString() : new Date().toISOString(),
            endDate: data.endDate ? data.endDate.toISOString() : undefined,
            currentEmployment: !!data.currentEmployment,
            monthlyIncome: data.monthlyAmount || '0',
            officeAddress: data.address,
            office: data.office || undefined,
            companyPhone: data.companyPhone || undefined,
            supervisorName: data.supervisorName,
            supervisorPhone: data.supervisorPhone,
            supervisorEmail: data.supervisorEmail || undefined,
            additionalInfo: undefined
        };

        const updatedIncomes = currentIncomes.map((inc: any, idx: number) => {
            const isEditing = editingIncomeIndex === idx;
            const source = isEditing ? incomePayload : inc;

            const clean: any = {
                incomeType: source.incomeType,
                companyName: source.companyName,
                positionTitle: source.positionTitle,
                startDate: source.startDate,
                currentEmployment: !!source.currentEmployment,
                monthlyIncome: String(source.monthlyIncome || '0'),
                officeAddress: source.officeAddress,
                supervisorName: source.supervisorName,
                supervisorPhone: source.supervisorPhone
            };

            if (source.endDate) clean.endDate = source.endDate;
            if (source.office) clean.office = source.office;
            if (source.companyPhone) clean.companyPhone = source.companyPhone;
            if (source.supervisorEmail) clean.supervisorEmail = source.supervisorEmail;
            if (source.additionalInfo) clean.additionalInfo = source.additionalInfo;

            return clean;
        });

        if (editingIncomeIndex === null) {
            updatedIncomes.push(incomePayload);
        }

        updateApplicationMutation.mutate(
            {
                id,
                updateData: {
                    incomeDetails: updatedIncomes
                }
            },
            {
                onSuccess: () => {
                    setIsAddIncomeModalOpen(false);
                    setEditingIncomeIndex(null);
                    refetch();
                },
                onError: (error: any) => {
                    console.error('Failed to save income:', error);
                    alert(error.message || 'Failed to save income');
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
                        evicted: data.evicted,
                        explanations: data.explanations
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
        const referencePayload = {
            contactName: data.fullName,
            relationship: data.relationship,
            email: data.email,
            phoneNumber: data.phoneNumber,
            yearsKnown: 0
        };

        const updatedReferences = currentReferences.map((ref: any, idx: number) => {
            const isEditing = editingContactIndex === idx;
            const source = isEditing ? referencePayload : ref;

            return {
                contactName: source.contactName,
                relationship: source.relationship,
                email: source.email,
                phoneNumber: isEditing ? formatPhoneNumberForBackend(source.phoneNumber, (data as any).phoneCountryCode) : source.phoneNumber,
                yearsKnown: source.yearsKnown || 0
            };
        });

        if (editingContactIndex === null) {
            updatedReferences.push(referencePayload);
        }

        updateApplicationMutation.mutate(
            {
                id,
                updateData: {
                    referenceContacts: updatedReferences
                }
            },
            {
                onSuccess: () => {
                    setIsAddReferenceModalOpen(false);
                    setEditingContactIndex(null);
                    refetch();
                },
                onError: (error: any) => {
                    console.error('Failed to save reference:', error);
                    alert(error.message || 'Failed to save reference');
                }
            }
        );
    };

    const handleSaveEmergencyContact = (data: EmergencyContactFormData) => {
        if (!id || !backendApplication) return;

        const currentContacts = backendApplication.emergencyContacts || [];
        const contactPayload = {
            contactName: data.fullName,
            phoneNumber: data.phoneNumber,
            email: data.email,
            relationship: data.relationship,
            details: data.details
        };

        const updatedContacts = currentContacts.map((c: any, idx: number) => {
            const isEditing = editingEmergencyContactIndex === idx;
            const source = isEditing ? contactPayload : c;

            return {
                contactName: source.contactName,
                phoneNumber: isEditing ? formatPhoneNumberForBackend(source.phoneNumber, (data as any).phoneCountryCode) : source.phoneNumber,
                email: source.email,
                relationship: source.relationship,
                details: source.details || ''
            };
        });

        if (editingEmergencyContactIndex === null) {
            updatedContacts.push(contactPayload);
        }

        updateApplicationMutation.mutate(
            {
                id,
                updateData: {
                    emergencyContacts: updatedContacts
                }
            },
            {
                onSuccess: () => {
                    setIsAddEmergencyContactModalOpen(false);
                    setEditingEmergencyContactIndex(null);
                    refetch();
                },
                onError: (error: any) => {
                    console.error('Failed to save emergency contact:', error);
                    alert(error.message || 'Failed to save emergency contact');
                }
            }
        );
    };

    const handleSaveFile = () => {
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
                initialData={(() => {
                    if (!backendApplication) return undefined;
                    const primaryApplicant = backendApplication.applicants?.find((a: any) => a.isPrimary) || backendApplication.applicants?.[0];
                    const { phoneNumber, phoneCountryCode } = getPhonePartsForInitialData(primaryApplicant?.phoneNumber);
                    return {
                        firstName: primaryApplicant?.firstName,
                        middleName: primaryApplicant?.middleName || '',
                        lastName: primaryApplicant?.lastName,
                        email: primaryApplicant?.email,
                        phoneNumber: phoneNumber,
                        phoneCountryCode: phoneCountryCode,
                        dob: primaryApplicant?.dateOfBirth ? new Date(primaryApplicant.dateOfBirth) : undefined,
                        shortBio: backendApplication.bio || '',
                        moveInDate: backendApplication.moveInDate ? new Date(backendApplication.moveInDate) : undefined,
                        photo: backendApplication.imageUrl || null,
                    };
                })()}
                onSave={handleSaveApplicantInfo}
            />
            <UserAddOccupantModal
                isOpen={isAddOccupantModalOpen}
                onClose={() => {
                    setIsAddOccupantModalOpen(false);
                    setEditingOccupantIndex(null);
                }}
                onSave={handleSaveOccupant}
                initialData={(() => {
                    if (editingOccupantIndex === null || !backendApplication?.occupants?.[editingOccupantIndex]) return undefined;
                    const occ = backendApplication.occupants[editingOccupantIndex];
                    const { phoneNumber, phoneCountryCode } = getPhonePartsForInitialData(occ.phoneNumber);
                    return {
                        firstName: occ.firstName || '',
                        lastName: occ.lastName || '',
                        email: occ.email || '',
                        phoneNumber: phoneNumber,
                        phoneCountryCode: phoneCountryCode,
                        dob: occ.dateOfBirth ? new Date(occ.dateOfBirth) : undefined,
                        relationship: occ.relationship || ''
                    };
                })()}
            />
            <UserAddEmergencyContactModal
                isOpen={isAddEmergencyContactModalOpen}
                onClose={() => {
                    setIsAddEmergencyContactModalOpen(false);
                    setEditingEmergencyContactIndex(null);
                }}
                onSave={handleSaveEmergencyContact}
                initialData={(() => {
                    if (editingEmergencyContactIndex === null || !backendApplication?.emergencyContacts?.[editingEmergencyContactIndex]) return undefined;
                    const contact = backendApplication.emergencyContacts[editingEmergencyContactIndex];
                    const { phoneNumber, phoneCountryCode } = getPhonePartsForInitialData(contact.phoneNumber);
                    return {
                        fullName: contact.contactName || '',
                        relationship: contact.relationship || '',
                        email: contact.email || '',
                        phoneNumber: phoneNumber,
                        phoneCountryCode: phoneCountryCode,
                        details: contact.details || ''
                    };
                })()}
            />
            <UserAddPetModal
                isOpen={isAddPetModalOpen}
                onClose={() => {
                    setIsAddPetModalOpen(false);
                    setEditingPetIndex(null);
                }}
                onSave={handleSavePet}
                initialData={(() => {
                    if (editingPetIndex === null || !backendApplication?.pets?.[editingPetIndex]) return undefined;
                    const pet = backendApplication.pets[editingPetIndex];
                    return {
                        type: pet.type,
                        name: pet.name,
                        weight: String(pet.weight || ''),
                        breed: pet.breed,
                        existingPhotoUrl: pet.photoUrl
                    };
                })()}
            />
            <UserAddVehicleModal
                isOpen={isAddVehicleModalOpen}
                onClose={() => {
                    setIsAddVehicleModalOpen(false);
                    setEditingVehicleIndex(null);
                }}
                onSave={handleSaveVehicle}
                initialData={editingVehicleIndex !== null ? {
                    type: backendApplication?.vehicles?.[editingVehicleIndex]?.type || '',
                    make: backendApplication?.vehicles?.[editingVehicleIndex]?.make || '',
                    model: backendApplication?.vehicles?.[editingVehicleIndex]?.model || '',
                    year: String(backendApplication?.vehicles?.[editingVehicleIndex]?.year || ''),
                    color: backendApplication?.vehicles?.[editingVehicleIndex]?.color || '',
                    licensePlate: backendApplication?.vehicles?.[editingVehicleIndex]?.licensePlate || '',
                    registeredIn: backendApplication?.vehicles?.[editingVehicleIndex]?.registeredIn || ''
                } : undefined}
            />

            {deleteConfirmation.isOpen && (
                <DeleteConfirmationModal
                    isOpen={deleteConfirmation.isOpen}
                    onClose={() => setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })}
                    onConfirm={() => {
                        if (backendApplication) {
                            handleConfirmDeleteGeneric(
                                deleteConfirmation.type,
                                deleteConfirmation.id,
                                backendApplication,
                                id!,
                                updateApplicationMutation,
                                refetch,
                                () => setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })
                            );
                        }
                    }}
                    title={deleteConfirmation.title}
                    itemName={deleteConfirmation.itemName}
                />
            )}
            <UserAddResidenceModal
                isOpen={isAddResidenceModalOpen}
                onClose={() => {
                    setIsAddResidenceModalOpen(false);
                    setEditingResidenceIndex(null);
                }}
                onSave={handleSaveResidence}
                initialData={(() => {
                    if (editingResidenceIndex === null || !backendApplication?.residenceHistory?.[editingResidenceIndex]) return undefined;
                    const res = backendApplication.residenceHistory[editingResidenceIndex];
                    return {
                        isCurrent: res.isCurrent,
                        address: res.address || '',
                        city: res.city || '',
                        state: res.state || '',
                        zip: res.zipCode || '',
                        country: res.country || '',
                        residencyType: (res.residenceType === 'RENTED' ? 'Rent' : res.residenceType === 'OWNED' ? 'Own' : 'Others') as any,
                        moveInDate: res.moveInDate ? new Date(res.moveInDate) : undefined,
                        moveOutDate: res.moveOutDate ? new Date(res.moveOutDate) : undefined,
                        reason: '',
                        rentAmount: res.monthlyRent ? String(res.monthlyRent) : '',
                        landlordName: res.landlordName || '',
                        landlordPhone: res.landlordPhone || '',
                        landlordEmail: res.landlordEmail || '',
                    };
                })()}
            />
            <UserAddIncomeModal
                isOpen={isAddIncomeModalOpen}
                onClose={() => {
                    setIsAddIncomeModalOpen(false);
                    setEditingIncomeIndex(null);
                }}
                onSave={handleSaveIncome}
                initialData={(() => {
                    if (editingIncomeIndex === null || !backendApplication?.incomeDetails?.[editingIncomeIndex]) return undefined;
                    const inc = backendApplication.incomeDetails[editingIncomeIndex];
                    return {
                        currentEmployment: inc.currentEmployment,
                        incomeType: inc.incomeType,
                        startDate: inc.startDate ? new Date(inc.startDate) : undefined,
                        endDate: inc.endDate ? new Date(inc.endDate) : undefined,
                        company: inc.companyName,
                        position: inc.positionTitle,
                        monthlyAmount: inc.monthlyIncome ? String(inc.monthlyIncome) : '',
                        address: inc.officeAddress || '',
                        office: inc.office || '',
                        companyPhone: inc.companyPhone || '',
                        supervisorName: inc.supervisorName || '',
                        supervisorEmail: inc.supervisorEmail || '',
                        supervisorPhone: inc.supervisorPhone || '',
                        currency: 'USD'
                    };
                })()}
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
                onClose={() => {
                    setIsAddReferenceModalOpen(false);
                    setEditingContactIndex(null);
                }}
                onSave={handleSaveReference}
                initialData={(() => {
                    if (editingContactIndex === null || !backendApplication?.referenceContacts?.[editingContactIndex]) return undefined;
                    const ref = backendApplication.referenceContacts[editingContactIndex];
                    const { phoneNumber, phoneCountryCode } = getPhonePartsForInitialData(ref.phoneNumber);
                    return {
                        fullName: ref.contactName,
                        relationship: ref.relationship,
                        email: ref.email,
                        phoneNumber: phoneNumber,
                        phoneCountryCode: phoneCountryCode
                    };
                })()}
            />
            <UserAddFileModal
                isOpen={isAddFileModalOpen}
                onClose={() => setIsAddFileModalOpen(false)}
                onSave={handleSaveFile}
            />


            <Breadcrumbs applicationNumber={application.applicationNumber} />

            <div className="max-w-7xl mx-auto w-full space-y-6">
                <SummaryHeader application={application} navigate={navigate} getStatusColor={getStatusColor} />

                <div className="border-b border-[#F1F1F1]">
                    <div className="flex flex-wrap gap-4">
                        <button className="px-4 py-2 font-semibold text-[15px] transition-all relative text-white bg-[#7ED957] rounded-t-lg -mb-[1px]">
                            Application
                            <div className="absolute -bottom-4 left-0 right-0 h-4 bg-[#7ED957] blur-lg opacity-20 -z-10"></div>
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Application details</h2>

                    {applicationSections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <div key={section.id} className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                                <div className="px-6 py-4 flex items-center justify-between cursor-pointer transition-colors" onClick={() => toggleSection(section.id)}>
                                    <div className="flex items-center gap-3 flex-1">
                                        <Icon size={20} className="text-gray-500" />
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {section.title} <span className="text-gray-400 text-sm font-medium ml-2">{section.subtitle}</span>
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {section.primaryAction && (
                                            <button
                                                className={`text-[#7ED957] font-semibold text-sm transition-opacity ${isApproved ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (!isApproved) handleSectionPrimaryAction(section.id);
                                                }}
                                                disabled={isApproved}
                                            >
                                                {section.primaryAction}
                                            </button>
                                        )}
                                        <div className="p-1">
                                            {expandedSections[section.id] ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                                        </div>
                                    </div>
                                </div>

                                {expandedSections[section.id] && (
                                    <div className="px-6 pb-6 border-t border-[#E5E7EB]">
                                        <div className="pt-4">
                                            {section.id === 'applicantInfo' && section.recordCount > 0 ? (
                                                <div className="flex flex-col xl:flex-row items-start justify-between gap-8">
                                                    <div className="flex-1 w-full space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                                                <p className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-wide">Date of birth</p>
                                                                <p className="text-lg font-bold text-gray-900">{application.applicantInfo.dateOfBirth}</p>
                                                            </div>
                                                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                                                <p className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-wide">Preferred move-in</p>
                                                                <p className="text-lg font-bold text-gray-900">{application.applicantInfo.preferredMoveIn}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-900 font-bold text-base mb-2">Short bio</p>
                                                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-gray-700 leading-relaxed">{application.applicantInfo.shortBio}</div>
                                                        </div>
                                                    </div>
                                                    <RentIncomePercentage rentPerMonth={application.applicantInfo.rentPerMonth} householdIncome={application.applicantInfo.householdIncome} />
                                                </div>
                                            ) : section.id === 'residentialHistory' && section.recordCount > 0 ? (
                                                <div className="space-y-4">
                                                    {application.residentialHistoryData.map((residence: any, idx: number) => (
                                                        <ResidenceCard key={residence.id} residence={residence} idx={idx} isApproved={isApproved} onEdit={(index: number) => { setEditingResidenceIndex(index); setIsAddResidenceModalOpen(true); }} onDelete={(index: number) => { if (!backendApplication?.residenceHistory) return; setDeleteConfirmation({ isOpen: true, type: 'residence', id: backendApplication.residenceHistory[index].id, title: 'Delete Residence', itemName: residence.address }); }} />
                                                    ))}
                                                </div>
                                            ) : section.id === 'incomeHistory' && section.recordCount > 0 ? (
                                                <div className="space-y-4">
                                                    {application.incomeHistoryData.map((income: any, idx: number) => (
                                                        <IncomeCard key={income.id} income={income} idx={idx} isApproved={isApproved} onEdit={(index: number) => { setEditingIncomeIndex(index); setIsAddIncomeModalOpen(true); }} onDelete={(index: number) => { if (!backendApplication?.incomeDetails) return; setDeleteConfirmation({ isOpen: true, type: 'income', id: backendApplication.incomeDetails[index].id, title: 'Delete Income', itemName: income.company }); }} />
                                                    ))}
                                                </div>
                                            ) : section.id === 'additionalOccupants' && section.recordCount > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {application.occupantsData.map((occupant: any, idx: number) => (
                                                        <OccupantCard key={occupant.id} occupant={occupant} idx={idx} isApproved={isApproved} onEdit={(index: number) => { setEditingOccupantIndex(index); setIsAddOccupantModalOpen(true); }} onDelete={(data: any) => setDeleteConfirmation({ isOpen: true, type: 'occupant', id: data.id, title: 'Delete Occupant', itemName: data.name })} />
                                                    ))}
                                                </div>
                                            ) : section.id === 'pets' && section.recordCount > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {application.petsData.map((pet: any, idx: number) => (
                                                        <PetCard key={pet.id} pet={pet} idx={idx} isApproved={isApproved} onEdit={(index: number) => { setEditingPetIndex(index); setIsAddPetModalOpen(true); }} onDelete={(index: number) => { if (!backendApplication?.pets) return; setDeleteConfirmation({ isOpen: true, type: 'pet', id: backendApplication.pets[index].id, title: 'Delete Pet', itemName: pet.name }); }} />
                                                    ))}
                                                </div>
                                            ) : section.id === 'vehicles' && section.recordCount > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {application.vehiclesData.map((vehicle: any, idx: number) => (
                                                        <VehicleCard key={vehicle.id} vehicle={vehicle} idx={idx} isApproved={isApproved} onEdit={(index: number) => { setEditingVehicleIndex(index); setIsAddVehicleModalOpen(true); }} onDelete={(v: any) => setDeleteConfirmation({ isOpen: true, type: 'vehicle', id: v.id, title: 'Delete Vehicle', itemName: `${v.year} ${v.make} ${v.model}` })} />
                                                    ))}
                                                </div>
                                            ) : section.id === 'contacts' && section.recordCount > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {application.contactsData.map((contact: any, idx: number) => (
                                                        <ContactCard key={contact.id} contact={contact} idx={idx} isApproved={isApproved} onEdit={(index: number, type: string) => { if (type === 'Reference') { const refIdx = index - (application.contactsData.filter(c => c.type === 'Emergency Contact').length); setEditingContactIndex(refIdx); setIsAddReferenceModalOpen(true); } else { setEditingEmergencyContactIndex(index); setIsAddEmergencyContactModalOpen(true); } }} onDelete={(index: number, data: any) => { const isRef = data.type === 'Reference'; const ct = isRef ? backendApplication?.referenceContacts : backendApplication?.emergencyContacts; const realIdx = isRef ? index - (application.contactsData.filter((c: any) => c.type === 'Emergency Contact').length) : index; if (!ct || !ct[realIdx]) return; setDeleteConfirmation({ isOpen: true, type: isRef ? 'reference' : 'emergencyContact', id: ct[realIdx].id, title: `Delete ${data.type}`, itemName: data.name }); }} />
                                                    ))}
                                                </div>
                                            ) : section.id === 'attachments' ? (
                                                <div className="space-y-4">
                                                    {application.documentsData.length > 0 ? (
                                                        application.documentsData.map((doc: any, idx: number) => (
                                                            <div key={idx} className="bg-[#FAFAFA] rounded-lg border border-gray-200 p-5 flex items-center justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="p-2 bg-white rounded-lg border border-gray-200"><FileText size={20} className="text-[#7ED957]" /></div>
                                                                    <div><h4 className="text-sm font-semibold text-gray-900">{doc.name}</h4><p className="text-xs text-gray-500">{(doc.size / 1024).toFixed(1)} KB • {doc.type}</p></div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (<p className="text-gray-500 italic text-sm">No attachments found</p>)}
                                                </div>
                                            ) : (<p className="text-gray-500 italic text-sm">No records found</p>)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                        <div className="px-6 py-4 flex items-center justify-between cursor-pointer transition-colors" onClick={() => toggleSection('additionalQuestions')}>
                            <div className="flex items-center gap-3 flex-1">
                                <HelpCircle size={20} className="text-gray-500" />
                                <h3 className="text-xl font-semibold text-gray-900">Additional questions <span className="text-gray-400 text-sm font-medium ml-2">(6 records)</span></h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className={`text-[#7ED957] text-sm font-semibold transition-opacity ${isApproved ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`} onClick={(e) => { e.stopPropagation(); if (!isApproved) setIsEditBackgroundInfoModalOpen(true); }} disabled={isApproved}>Edit</button>
                                <div className="p-1">
                                    {expandedSections.additionalQuestions ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                                </div>
                            </div>
                        </div>
                        {expandedSections.additionalQuestions && (
                            <div className="px-6 pb-6 bg-white/90 border-t border-[#E5E7EB]">
                                <AdditionalQuestionsContent questions={application.additionalQuestions} />
                            </div>
                        )}
                    </div>

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
