import React, { useState } from 'react';
import { Pencil, Trash2, Check } from 'lucide-react';
import CustomCheckbox from '../../../../../../components/ui/CustomCheckbox';

const ValidationStep: React.FC = () => {
    // Mock validation data with realistic examples
    const rows = [
        { id: 1, status: 'Valid', title: 'Sunset Apartments', street: '123 Sunset Blvd', city: 'Los Angeles', rent: '$2,500' },
        { id: 2, status: 'Valid', title: 'Downtown Lofts', street: '456 Main St', city: 'New York', rent: '$4,200' },
        { id: 3, status: 'Valid', title: 'Cozy Cottage', street: '789 Oak Ln', city: 'Austin', rent: '$1,800' },
        { id: 4, status: 'Valid', title: 'Seaside Villa', street: '321 Beach Rd', city: 'Miami', rent: '$3,500' },
        { id: 5, status: 'Valid', title: 'Mountain Retreat', street: '654 Pine Dr', city: 'Denver', rent: '$2,100' },
    ];

    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(rows.map(r => r.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleToggleRow = (id: number) => {
        if (selectedRows.includes(id)) {
            setSelectedRows(prev => prev.filter(rowId => rowId !== id));
        } else {
            setSelectedRows(prev => [...prev, id]);
        }
    };

    const isAllSelected = rows.length > 0 && selectedRows.length === rows.length;

    return (
        <div className="w-full max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Validation Errors</h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                Your properties are being validated. Once the validation is completed,
                correct errors and complete the import.{' '}
                <a href="#" className="text-[#3A6D6C] font-semibold hover:underline">Learn more</a>
            </p>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#3A6D6C] px-6 py-4 grid grid-cols-[50px_60px_100px_1fr_1fr_1fr_100px_80px] gap-2 items-center">
                    <div className="flex items-center justify-center">
                        <CustomCheckbox
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            className="" // Override default styling if needed to fit header
                        />
                    </div>
                    <span className="text-lg font-semibold text-white">#</span>
                    <span className="text-white font-medium">Status</span>
                    <span className="text-white font-medium">Title</span>
                    <span className="text-white font-medium">Street</span>
                    <span className="text-white font-medium">City</span>
                    <span className="text-white font-medium">Rent</span>
                </div>

                <div className="bg-[#F3F4F6] p-4 space-y-3">
                    {rows.map((row) => (
                        <div key={row.id} className="bg-white rounded-lg p-3 grid grid-cols-[50px_60px_100px_1fr_1fr_1fr_100px_80px] gap-2 items-center shadow-sm">
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={() => handleToggleRow(row.id)}
                                    className="flex items-center justify-center"
                                >
                                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedRows.includes(row.id) ? 'bg-[#7BD747]' : 'bg-gray-200'}`}>
                                        {selectedRows.includes(row.id) && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                </button>
                            </div>
                            <span className="text-gray-800 font-medium">{row.id}</span>
                            <span className="text-[#2E6819] font-medium">{row.status}</span>
                            <span className="text-[#2E6819] font-medium">{row.title}</span>
                            <span className="text-[#2E6819]">{row.street}</span>
                            <span className="text-[#2E6819]">{row.city}</span>
                            <span className="text-[#2E6819] font-bold">{row.rent}</span>
                            <div className="flex items-center gap-2">
                                <button className="text-[#3A6D6C] hover:text-[#2c5251]">
                                    <Pencil size={18} />
                                </button>
                                <button className="text-red-500 hover:text-red-700">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ValidationStep;
