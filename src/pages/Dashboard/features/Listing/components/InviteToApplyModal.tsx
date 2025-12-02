import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';

interface InviteToApplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (data: any) => void;
}

const InviteToApplyModal: React.FC<InviteToApplyModalProps> = ({ isOpen, onClose, onSend }) => {
    const [selectedProperty, setSelectedProperty] = useState('Listed Property');
    const [applicantEmail, setApplicantEmail] = useState('');

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 animate-in fade-in duration-200 font-['Urbanist']">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-slide-in-from-right relative overflow-hidden">
                {/* Header */}
                <div className="bg-[#3D7475] p-6 flex items-center justify-between">
                    <div className="bg-[#82D64D] text-white px-6 py-2 rounded-full text-sm font-medium">
                        Invite applicants to apply online
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6">
                    {/* Select Property */}
                    <div>
                        <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Select property*</label>
                        <div className="relative">
                            <CustomDropdown
                                value={selectedProperty}
                                onChange={(value) => setSelectedProperty(value)}
                                options={[
                                    { value: 'Listed Property', label: 'Listed Property' },
                                    { value: 'Property 1', label: 'Property 1' },
                                    { value: 'Property 2', label: 'Property 2' }
                                ]}
                                placeholder="Select Property"
                                buttonClassName="w-full !bg-[#82d64d] text-white px-6 py-3 !rounded-full text-left font-medium flex items-center justify-between !border-none outline-none"
                                textClassName="text-white font-medium"
                                dropdownClassName="mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                                optionClassName="px-4 py-2 hover:bg-gray-50 text-gray-700 cursor-pointer text-sm"
                                iconClassName="text-white"
                            />
                        </div>
                    </div>

                    {/* Add Applicants */}
                    <div>
                        <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Add applicants*</label>
                        <div className="relative mb-4">
                            <div className="w-full bg-[#82D64D] text-white px-6 py-3 rounded-full flex items-center justify-between">
                                <input
                                    type="text"
                                    value={applicantEmail}
                                    onChange={(e) => setApplicantEmail(e.target.value)}
                                    placeholder="Enter Applicant's email"
                                    className="bg-transparent text-white placeholder-white/80 outline-none w-full font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="bg-[#82D64D] text-white px-8 py-2 rounded-full text-sm font-bold hover:bg-[#71bd42] transition-colors">
                                Save
                            </button>
                            <button className="bg-[#6B7280] text-white px-8 py-2 rounded-full text-sm font-bold hover:bg-[#585f6b] transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 pt-0 flex gap-4 justify-between">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-[#4B5563] text-white py-3 rounded-lg font-bold hover:bg-[#374151] transition-colors text-base"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSend({ property: selectedProperty, email: applicantEmail })}
                        className="flex-1 bg-[#3D7475] text-white py-3 rounded-lg font-bold hover:bg-[#2c5556] transition-colors text-base"
                    >
                        Send invitation
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default InviteToApplyModal;
