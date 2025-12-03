import React from 'react';
import { Listbox } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { useListUnitStore } from '../store/listUnitStore';

interface ListingContactProps {
    onSubmit: () => void;
    propertyId?: string;
}

const ListingContact: React.FC<ListingContactProps> = ({ onSubmit, propertyId }) => {
    const { formData, updateFormData } = useListUnitStore();
    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 text-[var(--color-heading)]">
                    Listing contact
                </h2>
                <p className="text-[var(--color-subheading)] text-gray-500">
                    This contact information will be displayed for your potential Pms publicly.
                </p>
            </div>

            <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Contact Name */}
                <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-1 ml-1">
                        Contact*
                    </label>
                    <input
                        type="text"
                        value={formData.contactName || ''}
                        onChange={(e) => updateFormData('contactName', e.target.value)}
                        placeholder="Enter contact name"
                        className="w-full bg-[#84CC16] text-white placeholder-white/80 text-lg font-medium py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#84CC16]"
                    />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-1 ml-1">
                        Phone Number*
                    </label>
                    <div className="relative flex items-center bg-[#84CC16] rounded-full">
                        <div className="relative z-10">
                            <Listbox value={formData.countryCode || '+91'} onChange={(val) => updateFormData('countryCode', val)}>
                                <div className="relative">
                                    <Listbox.Button className="relative w-full cursor-pointer pl-4 pr-8 py-3 text-left focus:outline-none sm:text-sm">
                                        <span className="block truncate text-white font-medium text-lg">{formData.countryCode || '+91'}</span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronDown
                                                className="h-4 w-4 text-white"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </Listbox.Button>
                                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm min-w-[80px]">
                                        {['+1', '+7', '+20', '+27', '+30', '+31', '+32', '+33', '+34', '+36', '+39', '+40', '+41', '+43', '+44', '+45', '+46', '+47', '+48', '+49', '+51', '+52', '+54', '+55', '+57', '+60', '+61', '+62', '+63', '+64', '+65', '+66', '+81', '+82', '+84', '+86', '+90', '+91', '+92', '+93', '+94', '+95', '+98', '+212', '+234', '+351', '+353', '+358', '+380', '+880', '+966', '+971', '+972'].map((code) => (
                                            <Listbox.Option
                                                key={code}
                                                className={({ active }) =>
                                                    `relative rounded-full cursor-default select-none py-2 pl-3 pr-4 ${active ? 'bg-[#E6F4D5] text-[#3D7475]' : 'text-gray-900'
                                                    }`
                                                }
                                                value={code}
                                            >
                                                {({ selected }) => (
                                                    <span
                                                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                            }`}
                                                    >
                                                        {code}
                                                    </span>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </div>
                            </Listbox>
                        </div>
                        <div className="h-6 w-px bg-white/30 mx-1"></div>
                        <input
                            type="text"
                            value={formData.phoneNumber || ''}
                            onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                            placeholder="8659742136"
                            className="w-full bg-transparent text-white placeholder-white/80 text-lg font-medium py-3 px-2 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-1 ml-1">
                        Email*
                    </label>
                    <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        placeholder="Enter your email"
                        className="w-full bg-[#84CC16] text-white placeholder-white/80 text-lg font-medium py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#84CC16]"
                    />
                </div>
            </div>

            {/* Toggle */}
            <div className="w-full max-w-3xl flex items-center gap-3 mb-12">
                <button
                    onClick={() => updateFormData('displayPhonePublicly', !formData.displayPhonePublicly)}
                    className={`relative w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${formData.displayPhonePublicly ? 'bg-[#84CC16]' : 'bg-gray-300'
                        }`}
                >
                    <span
                        className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${formData.displayPhonePublicly ? 'translate-x-6' : 'translate-x-0'
                            }`}
                    />
                </button>
                <span className="text-gray-700 font-medium">
                    Display the phone number publicly in PMS
                </span>
            </div>

            <div className="w-full max-w-xs flex justify-center">
                <button
                    onClick={onSubmit}
                    className="bg-[#3D7475] text-white text-xl font-bold py-3 px-12 rounded-xl shadow-lg hover:bg-[#2c5556] transition-colors w-full"
                >
                    Submit Listing
                </button>
            </div>
        </div>
    );
};

export default ListingContact;
