import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';

interface AddResidenceInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (info: string) => void;
    initialValue?: string;
}

const AddResidenceInfoModal: React.FC<AddResidenceInfoModalProps> = ({ isOpen, onClose, onSave, initialValue = '' }) => {
    const [info, setInfo] = useState(initialValue);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setInfo(initialValue);
        } else {
            document.body.style.overflow = 'unset';
            setInfo('');
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialValue]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200 p-4">
            <div className="bg-[#EAEAEA] rounded-[2rem] w-full max-w-4xl shadow-2xl animate-slide-in-from-right relative flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-6 flex items-center justify-between text-white rounded-t-[2rem]">
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <ChevronLeft size={28} />
                    </button>
                    <h2 className="text-2xl font-medium">Additional residence history information</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <X size={28} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar relative flex flex-col h-full">
                    <p className="text-gray-600 mb-6 font-medium">
                        Include any details from residential history that may be relevant for this application.
                    </p>

                    <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 min-h-[300px]">
                        <textarea
                            placeholder="Type here..."
                            className="w-full h-full min-h-[250px] bg-white border-none outline-none resize-none text-gray-700 placeholder-gray-400 font-medium text-lg"
                            value={info}
                            onChange={(e) => setInfo(e.target.value)}
                        />
                    </div>

                    <div className="pt-8 flex justify-end">
                        <button
                            onClick={() => {
                                onSave(info);
                                onClose();
                            }}
                            className="bg-[#3A6D6C] text-white px-10 py-3 rounded-xl font-medium hover:bg-[#2c5251] transition-colors shadow-lg"
                        >
                            Save Information
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddResidenceInfoModal;
