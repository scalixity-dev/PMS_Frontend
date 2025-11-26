import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Building, Loader2 } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { propertyService } from '../../../../../services/property.service';
import type { Property } from '../../../../../services/property.service';

interface PropertySelectionProps {
  data: any;
  updateData: (key: string, value: any) => void;
  onCreateProperty: () => void;
  onEditProperty?: (propertyId: string) => void;
}

const PropertySelection: React.FC<PropertySelectionProps> = ({ data, updateData, onCreateProperty, onEditProperty }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProperties = await propertyService.getAllTransformed();
        // Only set properties if we get a valid array from the API
        // No mock data or fallback - use exactly what the API returns
        setProperties(Array.isArray(fetchedProperties) ? fetchedProperties : []);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err instanceof Error ? err.message : 'Failed to load properties');
        // On error, ensure properties array is empty (no mock data)
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const selectedProperty = properties.find(p => p.id === data.property);

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
    updateData('property', propertyId);
    setIsOpen(false);
  };

  const handleCreateProperty = () => {
    setIsOpen(false);
    onCreateProperty();
  };

  const handleDelete = () => {
    updateData('property', '');
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
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent p-8 rounded-lg w-full flex flex-col items-center">
      {selectedProperty ? (
        // Show Property Card when selected
        <PropertyCard
          property={selectedProperty}
          onDelete={handleDelete}
          onBack={handleDelete} // Reusing handleDelete as it clears selection, which is the desired "Back" behavior for now
          onEdit={onEditProperty ? () => onEditProperty(selectedProperty.id) : undefined}
        />
      ) : (
        // Show Dropdown when no selection
        <div className="w-full max-w-md relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Property</label>

          {/* Dropdown Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <Building size={16} />
              </div>
              <span className="text-gray-500">Select a property</span>
            </div>
            <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="max-h-60 overflow-y-auto">
                {properties.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No properties found in database. Create your first property!
                  </div>
                ) : (
                  properties.map((property) => (
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
                  ))
                )}
              </div>

              {/* Create Property Option */}
              <button
                onClick={handleCreateProperty}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 text-[var(--color-primary)] font-medium border-t border-gray-200 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <Plus size={16} />
                </div>
                Create New Property
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertySelection;
