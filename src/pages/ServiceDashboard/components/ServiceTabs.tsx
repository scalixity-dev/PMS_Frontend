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
        <div className={`flex justify-center md:justify-start items-end border-b border-gray-200 w-full md:flex-1 ${className}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    className={`px-8 py-3 text-lg font-bold rounded-t-2xl transition-all duration-300 relative mx-1 ${activeTab === tab.value
                            ? 'bg-[#7BD747] text-white shadow-[0_10px_20px_rgba(123,215,71,0.4)]'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                    onClick={() => onTabChange(tab.value)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default ServiceTabs;
