import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SaveFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
}

const SaveFilterModal: React.FC<SaveFilterModalProps> = ({ isOpen, onClose, onSave }) => {
    const [filterName, setFilterName] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!filterName.trim()) {
            setError('Filter name is required');
            return;
        }
        onSave(filterName);
        setFilterName(''); // Reset after save
        setError('');
        onClose();
    };

    const handleClose = () => {
        setFilterName('');
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 font-outfit">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="bg-[#3A6D6C] p-6 flex items-center justify-between text-white">
                    <h2 className="text-xl font-bold">Save Filter</h2>
                    <button onClick={handleClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filter Name</label>
                        <input
                            type="text"
                            value={filterName}
                            onChange={(e) => {
                                setFilterName(e.target.value);
                                if (error) setError('');
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#3A6D6C] focus:border-[#3A6D6C] outline-none transition-colors"
                            placeholder="Enter Filter Name"
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-[#3A6D6C] text-white font-medium rounded-lg hover:bg-[#2c5251] transition-colors text-sm shadow-sm"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaveFilterModal;
