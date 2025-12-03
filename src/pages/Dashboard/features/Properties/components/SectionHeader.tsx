import React from 'react';
import { Plus } from 'lucide-react';

interface SectionHeaderProps {
    title: string;
    count: number;
    actionLabel?: string;
    onAction: () => void;
    hideCount?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, count, actionLabel = "Add", onAction, hideCount = false }) => {
    return (
        <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <div className="flex items-center gap-2">
                {!hideCount && (
                    <span className="bg-white border border-[#82D64D] text-gray-600 px-3 pl-1 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-[inset_0px_3.09px_3.09px_0px_rgba(0,0,0,0.25),inset_0_0_0_2px_#82D64D]">
                        <span className="bg-[#7BD747] text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px]">{count}</span>
                        Records
                    </span>
                )}
                <button
                    onClick={onAction}
                    className="bg-white border border-[#82D64D] text-gray-600 px-3 py-2 rounded-full text-xs font-bold flex items-center gap-1 shadow-[inset_0px_3.09px_3.09px_0px_rgba(0,0,0,0.25)]"
                >
                    {actionLabel}
                    <span className='w-4 h-4 rounded-full flex items-center justify-center text-[#2E6819] text-[10px] border border-[#2E6819] border-2'>
                        <Plus className="w-3 h-3 text-[#2E6819]" />
                    </span>
                </button>
            </div>
        </div>
    );
};

export default SectionHeader;
