import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import SectionHeader from './SectionHeader';

// --- Types ---

interface HeaderPill {
    label: string;
    value: string;
}

interface DetailField {
    label: string;
    value: string;
}

interface FinancialRecord {
    id: number;
    headerPills: HeaderPill[];
    details: DetailField[];
}

// --- Components ---

interface FinancialCardProps {
    record: FinancialRecord;
    onEdit?: () => void;
    onDelete?: () => void;
}

const FinancialCard: React.FC<FinancialCardProps> = ({ record, onEdit, onDelete }) => {
    return (
        <div className="bg-[#F0F0F6] rounded-[2rem] p-6 mb-4 relative">
            {/* Actions */}
            <div className="absolute top-6 right-6 flex gap-3">
                <button onClick={onEdit} className="text-[#3A6D6C] hover:text-[#2c5554] transition-colors">
                    <Edit2 className="w-5 h-5" />
                </button>
                <button onClick={onDelete} className="text-red-500 hover:text-red-700 transition-colors">
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            {/* Header Pills */}
            <div className="flex flex-wrap gap-4 mb-8 pr-20">
                {record.headerPills.map((pill, index) => (
                    <div key={index} className="bg-[#82D64D] text-white  py-4 px-4 rounded-full flex items-center gap-3 shadow-sm min-w-[200px]">
                        <span className="text-sm font-medium">{pill.label}</span>
                        <div className="bg-[#F0F0F6] text-gray-700 px-4 py-1.5 rounded-full text-sm font-bold flex-1 text-center">
                            {pill.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                {record.details.map((detail, index) => (
                    <div key={index} className="flex items-center bg-[#E3EBDE] rounded-full px-4 py-2 shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)]">
                        <span className="text-xs font-medium text-gray-600 w-1/3 truncate" title={detail.label}>{detail.label}</span>
                        <span className="text-sm text-gray-800 font-medium w-2/3 truncate pl-2" title={detail.value}>{detail.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FinancialsTab: React.FC = () => {
    // Mock Data
    const insurances: FinancialRecord[] = [
        {
            id: 1,
            headerPills: [
                { label: 'Effective date', value: '27 Nov, 2025' },
                { label: 'Expiration date', value: '30 Nov, 2025' },
                { label: 'Price', value: '₹15,55.00' },
            ],
            details: [
                { label: 'Company name', value: 'jay' },
                { label: 'Email notification due to expiration', value: '-' },
                { label: 'Phone number', value: '+91 78541 23698' },
                { label: 'Website', value: 'www.jay343@gmail.com' },
                { label: 'Policy', value: '12563' },
                { label: 'Details', value: '-' },
                { label: 'Agent', value: 'vedh' },
                { label: 'Email', value: 'afsaft@gmail.com' },
            ]
        }
    ];

    const loans: FinancialRecord[] = [
        {
            id: 1,
            headerPills: [
                { label: 'Loan start date', value: '27 Nov, 2025' },
                { label: 'Loan amount', value: '₹65,555.00' },
                { label: 'Current loan balance', value: '₹65,555.00' },
            ],
            details: [
                { label: 'Annual interest %', value: '5' },
                { label: 'Email', value: '-' },
                { label: 'Phone number', value: '+91 78541 23698' },
                { label: 'Payments due', value: 'monthly' },
                { label: 'Loan period in years', value: '3' },
                { label: 'Loan type', value: 'Private' },
                { label: 'Bank name', value: 'sbi' },
                { label: 'Contact person', value: 'sam' },
            ]
        }
    ];

    const purchases: FinancialRecord[] = [
        {
            id: 1,
            headerPills: [
                { label: 'Start date', value: '27 Nov, 2025' },
                { label: 'Purchase price', value: '₹25,555.00' },
            ],
            details: [
                { label: 'Down payment', value: '₹999.00' },
                { label: 'Annual depreciation', value: '₹999.00' },
                { label: 'Phone number', value: '+91 78541 23698' },
                { label: 'Depreciable years', value: '27.5' },
                { label: 'Land value', value: '₹25999.00' },
                { label: 'Loan type', value: 'Private' },
                { label: 'Details', value: 'ccvcdvvv.' },
            ]
        }
    ];

    return (
        <div className="space-y-8">
            {/* Insurances Section */}
            <div className="bg-[#E9E9E9] shadow-lg rounded-[2rem] p-6">
                <SectionHeader
                    title="Insurances"
                    count={insurances.length}
                    onAction={() => console.log('Add Insurance')}
                />
                <div>
                    {insurances.map(record => (
                        <FinancialCard
                            key={record.id}
                            record={record}
                            onEdit={() => console.log('Edit Insurance', record.id)}
                            onDelete={() => console.log('Delete Insurance', record.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Loans Section */}
            <div className="bg-[#E9E9E9] shadow-lg rounded-[2rem] p-6">
                <SectionHeader
                    title="Loans"
                    count={loans.length}
                    onAction={() => console.log('Add Loan')}
                />
                <div>
                    {loans.map(record => (
                        <FinancialCard
                            key={record.id}
                            record={record}
                            onEdit={() => console.log('Edit Loan', record.id)}
                            onDelete={() => console.log('Delete Loan', record.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Purchase Section */}
            <div className="bg-[#E9E9E9] shadow-lg rounded-[2rem] p-6">
                <SectionHeader
                    title="Purchase"
                    count={purchases.length}
                    onAction={() => console.log('Add Purchase')}
                />
                <div>
                    {purchases.map(record => (
                        <FinancialCard
                            key={record.id}
                            record={record}
                            onEdit={() => console.log('Edit Purchase', record.id)}
                            onDelete={() => console.log('Delete Purchase', record.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FinancialsTab;
