import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface AddDoorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: {
        doorType: string;
        lockType: string;
        insideDoorColor: string;
        exteriorDoorColor: string;
        screenDoorAttached: boolean;
    }) => void;
}

const AddDoorModal: React.FC<AddDoorModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [doorType, setDoorType] = useState('');
    const [lockType, setLockType] = useState('');
    const [insideDoorColor, setInsideDoorColor] = useState('');
    const [exteriorDoorColor, setExteriorDoorColor] = useState('');
    const [screenDoorAttached, setScreenDoorAttached] = useState(false);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleAdd = () => {
        const newErrors: { [key: string]: string } = {};

        if (!doorType.trim()) newErrors.doorType = 'Door type is required';
        if (!lockType.trim()) newErrors.lockType = 'Lock type is required';
        if (!insideDoorColor.trim()) newErrors.insideDoorColor = 'Inside door color is required';
        if (!exteriorDoorColor.trim()) newErrors.exteriorDoorColor = 'Exterior door color is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onAdd({
            doorType: doorType.trim(),
            lockType: lockType.trim(),
            insideDoorColor: insideDoorColor.trim(),
            exteriorDoorColor: exteriorDoorColor.trim(),
            screenDoorAttached
        });

        // Reset and close
        setDoorType('');
        setLockType('');
        setInsideDoorColor('');
        setExteriorDoorColor('');
        setScreenDoorAttached(false);
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    const inputClasses = "w-full p-3 rounded-lg border border-gray-200 outline-none text-gray-700 placeholder-gray-400 font-medium focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all bg-white";

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#dfe5e3] rounded-[1.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between">
                    <h2 className="text-white text-lg font-medium">Add a new door</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            You can add, store and track the information about the property doors. You can add up to 15 doors.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="font-bold text-[#2c3e50]">New Door</div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Door Type */}
                            <div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={doorType}
                                        onChange={(e) => {
                                            setDoorType(e.target.value);
                                            if (errors.doorType) setErrors({ ...errors, doorType: '' });
                                        }}
                                        className={`${inputClasses} ${errors.doorType ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                                        placeholder="Door type *"
                                    />
                                    <div className="absolute right-3 top-3 pointer-events-none text-red-500">
                                        {!doorType && <span>*</span>}
                                    </div>
                                </div>
                                {errors.doorType && <p className="text-red-600 text-xs mt-1 ml-1">{errors.doorType}</p>}
                            </div>

                            {/* Lock Type */}
                            <div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={lockType}
                                        onChange={(e) => {
                                            setLockType(e.target.value);
                                            if (errors.lockType) setErrors({ ...errors, lockType: '' });
                                        }}
                                        className={`${inputClasses} ${errors.lockType ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                                        placeholder="Lock type *"
                                    />
                                    <div className="absolute right-3 top-3 pointer-events-none text-red-500">
                                        {!lockType && <span>*</span>}
                                    </div>
                                </div>
                                {errors.lockType && <p className="text-red-600 text-xs mt-1 ml-1">{errors.lockType}</p>}
                            </div>

                            {/* Inside Door Color */}
                            <div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={insideDoorColor}
                                        onChange={(e) => {
                                            setInsideDoorColor(e.target.value);
                                            if (errors.insideDoorColor) setErrors({ ...errors, insideDoorColor: '' });
                                        }}
                                        className={`${inputClasses} ${errors.insideDoorColor ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                                        placeholder="Inside door color *"
                                    />
                                    <div className="absolute right-3 top-3 pointer-events-none text-red-500">
                                        {!insideDoorColor && <span>*</span>}
                                    </div>
                                </div>
                                {errors.insideDoorColor && <p className="text-red-600 text-xs mt-1 ml-1">{errors.insideDoorColor}</p>}
                            </div>

                            {/* Exterior Door Color */}
                            <div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={exteriorDoorColor}
                                        onChange={(e) => {
                                            setExteriorDoorColor(e.target.value);
                                            if (errors.exteriorDoorColor) setErrors({ ...errors, exteriorDoorColor: '' });
                                        }}
                                        className={`${inputClasses} ${errors.exteriorDoorColor ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                                        placeholder="Exterior door color *"
                                    />
                                    <div className="absolute right-3 top-3 pointer-events-none text-red-500">
                                        {!exteriorDoorColor && <span>*</span>}
                                    </div>
                                </div>
                                {errors.exteriorDoorColor && <p className="text-red-600 text-xs mt-1 ml-1">{errors.exteriorDoorColor}</p>}
                            </div>
                        </div>

                        {/* Screen Door Toggle */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setScreenDoorAttached(!screenDoorAttached)}
                                className={`w-12 h-7 rounded-full transition-colors relative ${screenDoorAttached ? 'bg-[#5F8B8A]' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${screenDoorAttached ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                            <span className="text-[#2c3e50] font-medium">Screen door attached</span>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4">
                        <button
                            onClick={onClose}
                            className="w-full sm:flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            className="w-full sm:flex-1 bg-[#3A6D6C] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddDoorModal;
