import React from 'react';

export interface TabItem {
    id: string;
    label: string;
}

interface DetailTabsProps {
    tabs: (string | TabItem)[];
    activeTab: string;
    onTabChange: (id: string) => void;
    className?: string;
}

const DetailTabs: React.FC<DetailTabsProps> = ({
    tabs,
    activeTab,
    onTabChange,
    className = ''
}) => {
    const normalizedTabs = tabs.map(tab => {
        if (typeof tab === 'string') {
            return { id: tab.toLowerCase(), label: tab };
        }
        return tab;
    });

    return (
        <div className={`flex justify-center mb-8 ${className}`}>
            <div className="bg-[#F6F6F8] py-4 px-2 rounded-full w-full flex justify-center items-center gap-4 shadow-sm overflow-x-auto">
                {normalizedTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`px-10 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-[#82D64D] text-white shadow-md'
                            : 'bg-[#E0E0E0] text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DetailTabs;
