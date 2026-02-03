import React from 'react';

interface Tab {
    label: string;
    value: string;
}

interface ServiceTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (value: any) => void;
    className?: string;
}

const ServiceTabs: React.FC<ServiceTabsProps> = ({ tabs, activeTab, onTabChange, className = '' }) => {
    return (
        <div className={`w-full max-w-full overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide ${className}`}>
            <div className="flex items-end border-b border-gray-200 min-w-max px-2 sm:px-0">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        className={`flex-shrink-0 px-3.5 sm:px-8 py-2 sm:py-3 text-[13px] sm:text-lg font-bold rounded-t-lg sm:rounded-t-2xl transition-all duration-300 relative mx-0 sm:mx-1 ${activeTab === tab.value
                            ? 'bg-[#7BD747] text-white shadow-[0_5px_15px_rgba(123,215,71,0.3)]'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                        onClick={() => onTabChange(tab.value)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ServiceTabs;
