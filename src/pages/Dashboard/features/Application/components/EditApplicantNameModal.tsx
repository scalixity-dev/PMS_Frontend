import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';


interface EditApplicantNameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { firstName: string; middleName?: string; lastName: string }) => Promise<void>;
    initialData: {
        firstName: string;
        middleName?: string;
        lastName: string;
    };
}

const EditApplicantNameModal: React.FC<EditApplicantNameModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
}) => {
    const [firstName, setFirstName] = useState(initialData.firstName);
    const [middleName, setMiddleName] = useState(initialData.middleName || '');
    const [lastName, setLastName] = useState(initialData.lastName);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFirstName(initialData.firstName);
            setMiddleName(initialData.middleName || '');
            setLastName(initialData.lastName);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSave({ firstName, middleName, lastName });
            onClose();
        } catch (error) {
            console.error('Failed to update name:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div className="bg-[#EAEAEA] rounded-3xl w-full max-w-[400px] shadow-2xl animate-in zoom-in-95 duration-200 relative">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-4 flex items-center justify-between text-white rounded-t-3xl">
                    <div className="w-8"></div> {/* Spacer for centering if needed, or back button */}
                    <h2 className="text-lg font-medium">Edit Name</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-3">
                    {/* First Name */}
                    <div>
                        <label className="block text-xs font-semibold text-[#2c3e50] mb-1 ml-1">First Name</label>
                        <input
                            type="text"
                            placeholder="Enter First Name"
                            className="w-full bg-white p-2.5 rounded-lg outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm border-none"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    {/* Middle Name */}
                    <div>
                        <label className="block text-xs font-semibold text-[#2c3e50] mb-1 ml-1">Middle Name</label>
                        <input
                            type="text"
                            placeholder="Enter Middle Name (Optional)"
                            className="w-full bg-white p-2.5 rounded-lg outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm border-none"
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-xs font-semibold text-[#2c3e50] mb-1 ml-1">Last Name</label>
                        <input
                            type="text"
                            placeholder="Enter Last Name"
                            className="w-full bg-white p-2.5 rounded-lg outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm border-none"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-8 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-md bg-[#3A6D6C] text-white hover:bg-[#2c5251] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditApplicantNameModal;
