import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import SearchableDropdown from '../../../../../components/ui/SearchableDropdown';
import { useGetAllProperties } from '../../../../../hooks/usePropertyQueries';
import { useGetUnitsByProperty } from '../../../../../hooks/useUnitQueries';
import type { BackendProperty } from '../../../../../services/property.service';
import type { BackendUnit } from '../../../../../services/unit.service';

interface EditPropertyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (propertyId: string, unitId: string) => Promise<void>;
    initialPropertyId?: string;
    initialUnitId?: string;
}

const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialPropertyId,
    initialUnitId,
}) => {
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>(initialPropertyId);
    const [selectedUnitId, setSelectedUnitId] = useState<string | undefined>(initialUnitId);
    const [isLoading, setIsLoading] = useState(false);

    // Queries
    const { data: properties = [] } = useGetAllProperties(isOpen);
    const { data: units = [] } = useGetUnitsByProperty(selectedPropertyId, !!selectedPropertyId && isOpen);

    // Options for dropdowns
    const propertyOptions = useMemo(() => properties.map((p: BackendProperty) => p.propertyName), [properties]);

    const unitOptions = useMemo(() => units.map((u: BackendUnit) => u.unitName), [units]);

    // Helpers to find ID by Name and Vice Versa
    const getPropertyName = (id?: string) => properties.find((p: BackendProperty) => p.id === id)?.propertyName || '';
    const getUnitName = (id?: string) => units.find((u: BackendUnit) => u.id === id)?.unitName || '';

    const handlePropertyChange = (name: string) => {
        const property = properties.find((p: BackendProperty) => p.propertyName === name);
        if (property && property.id !== selectedPropertyId) {
            setSelectedPropertyId(property.id);
            setSelectedUnitId(undefined); // Reset unit when property changes
        }
    };

    const handleUnitChange = (name: string) => {
        const unit = units.find((u: BackendUnit) => u.unitName === name);
        if (unit) {
            setSelectedUnitId(unit.id);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setSelectedPropertyId(initialPropertyId);
            setSelectedUnitId(initialUnitId);
        }
    }, [isOpen, initialPropertyId, initialUnitId]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPropertyId || !selectedUnitId) return;

        setIsLoading(true);
        try {
            await onSave(selectedPropertyId, selectedUnitId);
            onClose();
        } catch (error) {
            console.error('Failed to update property:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div className="bg-[#EAEAEA] rounded-3xl w-full max-w-[400px] shadow-2xl animate-in zoom-in-95 duration-200 relative">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-4 flex items-center justify-between text-white rounded-t-3xl">
                    <div className="w-8"></div>
                    <h2 className="text-lg font-medium">Edit Property</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Property Selection */}
                    <div>
                        <SearchableDropdown
                            label="Property"
                            value={getPropertyName(selectedPropertyId)}
                            options={propertyOptions}
                            onChange={handlePropertyChange}
                            placeholder="Select Property"
                            buttonClassName="w-full bg-white p-2.5 rounded-lg outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm border-none flex justify-between items-center"
                        />
                    </div>

                    {/* Unit Selection */}
                    <div>
                        <SearchableDropdown
                            label="Unit"
                            value={getUnitName(selectedUnitId)}
                            options={unitOptions}
                            onChange={handleUnitChange}
                            placeholder={selectedPropertyId ? "Select Unit" : "Select Property First"}
                            buttonClassName={`w-full bg-white p-2.5 rounded-lg outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm border-none flex justify-between items-center ${!selectedPropertyId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading || !selectedPropertyId || !selectedUnitId}
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

export default EditPropertyModal;
