import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import SearchableDropdown from '../../../../../components/ui/SearchableDropdown';

const MOCK_TEAM_MEMBERS = [
    'John Doe',
    'Jane Smith',
    'Robert Johnson',
    'Sarah Williams',
    'Michael Brown',
    'Emily Davis',
    'David Miller',
    'Jessica Wilson'
];

interface AssignTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (selectedIds: string[]) => void;
    propertyDetails: {
        name: string;
        address: string;
        image?: string | null;
    };
}

const AssignTeamModal: React.FC<AssignTeamModalProps> = ({ isOpen, onClose, onUpdate, propertyDetails }) => {
    const [selectedMember, setSelectedMember] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#dfe5e3] rounded-[1.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between shrink-0">
                    <h2 className="text-white text-lg font-medium">Assign team members</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6 flex-1 overflow-y-auto custom-scrollbar transition-all duration-300">
                    {/* Property Info Block */}
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm bg-gray-100 flex items-center justify-center">
                            {propertyDetails.image ? (
                                <img src={propertyDetails.image} alt={propertyDetails.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xl">🏠</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-gray-900 font-bold text-base sm:text-lg">{propertyDetails.name}</h3>
                            <p className="text-gray-500 text-xs sm:text-sm">{propertyDetails.address}</p>
                        </div>
                    </div>

                    {/* Search Interaction */}
                    <div className={`mb-8 transition-all duration-300 ${isDropdownOpen ? 'mb-64' : ''}`}>
                        <SearchableDropdown
                            label="Search team member"
                            value={selectedMember}
                            onChange={setSelectedMember}
                            onToggle={setIsDropdownOpen}
                            options={MOCK_TEAM_MEMBERS}
                            placeholder="Type to search..."
                            className="w-full"
                            buttonClassName="w-full flex items-center justify-between bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm hover:bg-gray-50 transition-colors text-left text-base sm:text-sm"
                        />
                    </div>

                    {/* Spacer removed as margin handles it now */}

                    {/* Spacer to simulate layout from image if needed, or list results here */}
                    <div className="h-10"></div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4 border-t border-gray-100 mt-auto">
                        <button
                            onClick={onClose}
                            className="w-full sm:flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (selectedMember) {
                                    onUpdate([selectedMember]);
                                }
                                onClose();
                            }}
                            className="w-full sm:flex-1 bg-[#3A6D6C] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AssignTeamModal;
