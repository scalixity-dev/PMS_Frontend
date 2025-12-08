import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Building, Loader2 } from 'lucide-react';
import { useGetAllProperties } from '../../../../../hooks/usePropertyQueries';

interface MoveInPropertySelectionProps {
    selectedPropertyId: string | null;
    onSelect: (propertyId: string) => void;
    onNext: () => void;
}

const MoveInPropertySelection: React.FC<MoveInPropertySelectionProps> = ({
    selectedPropertyId,
    onSelect,
    onNext
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch all properties (simplified for this use case)
    const {
        data: allProperties = [],
        isLoading: loading,
        error: queryError,
    } = useGetAllProperties(true, false);

    const selectedProperty = allProperties.find(p => p.id === selectedPropertyId);
    const error = queryError ? (queryError instanceof Error ? queryError.message : 'Failed to load properties') : null;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (propertyId: string) => {
        onSelect(propertyId);
        setIsOpen(false);
    };

    if (loading) {
        return (
            <div className="bg-transparent p-8 rounded-lg w-full flex flex-col items-center justify-center min-h-[200px]">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
                <p className="mt-4 text-gray-600">Loading properties...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-transparent p-8 rounded-lg w-full flex flex-col items-center">
                <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2 text-[#374151]">Property information</h2>
                <p className="text-[#6B7280]">Select the property and unit below.</p>
            </div>

            <div className="w-full max-w-md relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-bold">Property</label>

                {/* Dropdown Trigger */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:border-[#3D7475] focus:outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        {!selectedProperty ? (
                            <>
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <Building size={16} />
                                </div>
                                <span className="text-gray-500">Search a property</span>
                            </>
                        ) : (
                            <>
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Building size={16} />
                                </div>
                                <span className="text-gray-900 font-medium">{selectedProperty.propertyName}</span>
                            </>
                        )}

                    </div>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto">
                        {allProperties.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                No properties found.
                            </div>
                        ) : (
                            allProperties.map((property) => (
                                <button
                                    key={property.id}
                                    onClick={() => handleSelect(property.id)}
                                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Building size={16} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-gray-900">{property.propertyName}</p>
                                            <p className="text-xs text-gray-500">{property.address?.city}, {property.address?.stateRegion}</p>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            <div className="w-full max-w-md mt-16 flex justify-center">
                <button
                    onClick={onNext}
                    disabled={!selectedPropertyId}
                    className={`
                    px-12 py-3 rounded-lg font-medium text-white transition-all
                    ${!selectedPropertyId
                            ? 'bg-[#3D7475] opacity-50 cursor-not-allowed'
                            : 'bg-[#3D7475] hover:bg-[#2c5554] shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                        }
                `}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MoveInPropertySelection;
