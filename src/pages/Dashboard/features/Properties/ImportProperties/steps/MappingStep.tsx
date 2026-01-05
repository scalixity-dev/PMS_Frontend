import React, { useState, useEffect } from 'react';
import CustomCheckbox from '../../../../../../components/ui/CustomCheckbox';
import CustomDropdown from '../../../../components/CustomDropdown';
import { propertyService } from '../../../../../../services/property.service';

interface MappingStepProps {
    fileHeaders?: string[];
}

const MappingStep: React.FC<MappingStepProps> = ({ fileHeaders = [] }) => {
    const [importFirstRow, setImportFirstRow] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [fields, setFields] = useState<Array<{ id: number; SmartTenantAILabel: string; fileLabel: string; required: boolean }>>([]);

    // Fetch system fields from backend
    useEffect(() => {
        const fetchSystemFields = async () => {
            try {
                setIsLoading(true);
                const response = await propertyService.getImportFields();
                
                // Auto-map fields based on exact match or similar names
                const mappedFields = response.fields.map((field, index) => {
                    // Try to find exact match first
                    let mappedHeader = fileHeaders.find(h => 
                        h.toLowerCase() === field.key.toLowerCase() ||
                        h.toLowerCase() === field.label.toLowerCase()
                    );
                    
                    // If no exact match, try partial match for common fields
                    if (!mappedHeader) {
                        const keyLower = field.key.toLowerCase();
                        if (keyLower.includes('street') || keyLower.includes('address')) {
                            mappedHeader = fileHeaders.find(h => h.toLowerCase().includes('address') || h.toLowerCase().includes('street'));
                        } else if (keyLower.includes('zip') || keyLower.includes('postal')) {
                            mappedHeader = fileHeaders.find(h => h.toLowerCase().includes('zip') || h.toLowerCase().includes('postal'));
                        } else if (keyLower.includes('state') || keyLower.includes('region')) {
                            mappedHeader = fileHeaders.find(h => h.toLowerCase().includes('state') || h.toLowerCase().includes('region'));
                        }
                    }
                    
                    return {
                        id: index + 1,
                        SmartTenantAILabel: field.label,
                        fileLabel: mappedHeader || '',
                        required: field.required,
                    };
                });
                
                setFields(mappedFields);
            } catch (error) {
                console.error('Failed to fetch system fields:', error);
                // Fallback to empty fields
                setFields([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (fileHeaders.length > 0) {
            fetchSystemFields();
        } else {
            setIsLoading(false);
        }
    }, [fileHeaders]);

    // Use actual file headers
    const csvHeaders = fileHeaders.length > 0 ? fileHeaders : [];

    // Convert to FilterOption format for CustomDropdown
    const csvOptions = csvHeaders.map(header => ({ value: header, label: header }));

    const handleMappingChange = (id: number, newValue: string) => {
        setFields(fields.map(field =>
            field.id === id ? { ...field, fileLabel: newValue } : field
        ));
    };

    // Get list of currently selected values (excluding the current field's value for the filter logic relative to itself)
    const getAllSelectedValues = () => fields.map(f => f.fileLabel).filter(v => v !== '');

    if (isLoading) {
        return (
            <div className="w-full max-w-4xl mx-auto px-4">
                <div className="text-center py-8">
                    <p className="text-gray-600">Loading field definitions...</p>
                </div>
            </div>
        );
    }

    if (csvHeaders.length === 0) {
        return (
            <div className="w-full max-w-4xl mx-auto px-4">
                <div className="text-center py-8">
                    <p className="text-red-600">No file headers found. Please upload a valid Excel file.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Fields Mapping</h2>
            <p className="text-center text-gray-600 mb-6">
                Map the columns' title with the system requirements.{' '}
                <a href="#" className="text-[#3A6D6C] font-semibold hover:underline">Learn more</a>
            </p>

            <div className="flex justify-center mb-8">
                <CustomCheckbox
                    label="Import the first row"
                    checked={importFirstRow}
                    onChange={setImportFirstRow}
                />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#3A6D6C] px-6 py-4 flex justify-between">
                    <h3 className="text-lg font-semibold text-white">SmartTenantAI Fields</h3>
                    <h3 className="text-lg font-semibold text-white">Uploaded File Header</h3>
                </div>

                <div className="p-8 bg-[#F3F4F6] max-h-[600px] overflow-y-auto">
                    <div className="grid grid-cols-[1fr_20px_1fr] gap-4 w-full items-end">
                        {fields.map((field) => {
                            // Calculate options available for this specific field
                            // Available = All Options - (Selected by others)
                            const otherSelectedValues = getAllSelectedValues().filter(val => val !== field.fileLabel);
                            const availableOptions = csvOptions.filter(opt => !otherSelectedValues.includes(opt.value));

                            return (
                                <React.Fragment key={field.id}>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            {field.SmartTenantAILabel} {field.required && <span className="text-red-500">*</span>}
                                        </label>
                                        <div className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-600 h-[46px] flex items-center">
                                            {field.SmartTenantAILabel}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center h-[46px] text-gray-400">
                                        →
                                    </div>
                                    <div>
                                        <CustomDropdown
                                            label="Map to"
                                            value={field.fileLabel}
                                            onChange={(val) => handleMappingChange(field.id, val)}
                                            options={availableOptions}
                                            placeholder="-- Select Column --"
                                        />
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MappingStep;
