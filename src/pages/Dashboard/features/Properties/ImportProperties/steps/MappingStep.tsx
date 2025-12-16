import React, { useState } from 'react';
import CustomCheckbox from '../../../../../../components/ui/CustomCheckbox';
import CustomDropdown from '../../../../components/CustomDropdown';

const MappingStep: React.FC = () => {
    const [importFirstRow, setImportFirstRow] = useState(true);

    // Mock CSV headers that might come from an uploaded file
    const mockCsvHeaders = [
        'Property Name',
        'Street Address',
        'City',
        'State',
        'Zip Code',
        'Country',
        'Year Built',
        'Number of Units'
    ];

    // Convert to FilterOption format for CustomDropdown
    const csvOptions = mockCsvHeaders.map(header => ({ value: header, label: header }));

    // Mock initial mapping state
    const [fields, setFields] = useState([
        { id: 1, pmsLabel: 'Property Name', fileLabel: 'Property Name' },
        { id: 2, pmsLabel: 'Address', fileLabel: 'Street Address' },
        { id: 3, pmsLabel: 'City', fileLabel: 'City' },
        { id: 4, pmsLabel: 'State/Region', fileLabel: 'State' },
        { id: 5, pmsLabel: 'Zip/Postal Code', fileLabel: 'Zip Code' },
        { id: 6, pmsLabel: 'Country', fileLabel: 'Country' },
        { id: 7, pmsLabel: 'Property Type', fileLabel: '' }, // Unmapped example
        { id: 8, pmsLabel: 'Units', fileLabel: 'Number of Units' },
    ]);

    const handleMappingChange = (id: number, newValue: string) => {
        setFields(fields.map(field =>
            field.id === id ? { ...field, fileLabel: newValue } : field
        ));
    };

    // Get list of currently selected values (excluding the current field's value for the filter logic relative to itself)
    const getAllSelectedValues = () => fields.map(f => f.fileLabel).filter(v => v !== '');

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
                    <h3 className="text-lg font-semibold text-white">PMS Fields</h3>
                    <h3 className="text-lg font-semibold text-white">Uploaded File Header</h3>
                </div>

                <div className="p-8 bg-[#F3F4F6]">
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
                                            {field.pmsLabel} *
                                        </label>
                                        <div className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-600 h-[46px] flex items-center">
                                            {field.pmsLabel}
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
