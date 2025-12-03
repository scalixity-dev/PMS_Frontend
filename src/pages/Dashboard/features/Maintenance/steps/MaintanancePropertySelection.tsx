import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Building } from 'lucide-react';

interface Property {
    id: string;
    name: string;
    unit: string;
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    image: string;
}

interface PropertySelectionProps {
    selectedProperty: string | null;
    onSelect: (propertyId: string) => void;
    properties: Property[];
    onNext: () => void;
    onCreateProperty: () => void;
}

const PropertySelection: React.FC<PropertySelectionProps> = ({ selectedProperty, onSelect, properties, onNext, onCreateProperty }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedPropDetails = properties.find(p => p.id === selectedProperty);

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

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
            <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Information</h2>
                <p className="text-gray-500">Select the property and a unit (if applicable) from the list below.</p>
            </div>

            <div className="w-full flex items-end gap-4">
                <div className="flex-1 relative" ref={dropdownRef}>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Property</label>

                    {/* Dropdown Trigger */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-between px-6 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-[#3D7475] transition-all outline-none"
                    >
                        <div className="flex items-center gap-3">
                            {selectedPropDetails ? (
                                <>
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Building size={16} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-900">{selectedPropDetails.name}</p>
                                    </div>
                                </>
                            ) : (
                                <span className="text-gray-400">Search a property</span>
                            )}
                        </div>
                        <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            <div className="max-h-60 overflow-y-auto">
                                {properties.map((property) => (
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
                                                <p className="text-sm font-medium text-gray-900">{property.name}</p>
                                                <p className="text-xs text-gray-500">{property.unit}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Create Property Option */}
                            <button
                                onClick={onCreateProperty}
                                className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 text-[#3D7475] font-medium border-t border-gray-200 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#3D7475]/10 flex items-center justify-center">
                                    <Plus size={16} />
                                </div>
                                Create New Property
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={onNext}
                    disabled={!selectedProperty}
                    className={`
                        bg-[#3D7475] text-white px-8 py-3.5 rounded-lg font-medium transition-all shadow-md h-[50px] flex items-center
                        ${!selectedProperty ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
                    `}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default PropertySelection;
