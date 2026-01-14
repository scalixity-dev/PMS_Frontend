import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

// --- Types ---

export interface HeaderPill {
    label: string;
    value: string;
}

export interface DetailField {
    label: string;
    value: string;
}

export interface FinancialRecord {
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
        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 mb-4 relative">
            {/* Actions */}
            <div className="absolute top-4 md:top-6 right-4 md:right-6 flex gap-2 md:gap-3">
                <button onClick={onEdit} className="text-[#3A6D6C] hover:text-[#2c5554] transition-colors">
                    <Edit2 className="w-5 h-5" />
                </button>
                <button onClick={onDelete} className="text-red-500 hover:text-red-700 transition-colors">
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            {/* Header Pills */}
            <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-8 pr-16 md:pr-20">
                {record.headerPills.map((pill, index) => (
                    <div key={index} className="bg-[#82D64D] text-white py-2 md:py-4 px-3 md:px-4 rounded-full flex items-center gap-2 md:gap-3 shadow-sm min-w-[140px] md:min-w-[200px]">
                        <span className="text-xs md:text-sm font-medium">{pill.label}</span>
                        <div className="bg-[#F0F2F5] text-gray-700 px-2 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-bold text-center whitespace-nowrap">
                            {pill.value}
                        </div>
                    </div>))}
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

export default FinancialCard;
