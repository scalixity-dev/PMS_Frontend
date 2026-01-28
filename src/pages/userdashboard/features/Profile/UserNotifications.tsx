import React, { useState } from "react";
import UserAccountSettingsLayout from "../../components/layout/UserAccountSettingsLayout";
import Toggle from "../../../../components/Toggle";
import { Check } from "lucide-react";
import CustomDropdown from "../../../Dashboard/components/CustomDropdown";



const Notifications: React.FC = () => {
    // State for main toggles
    const [allNotification, setAllNotification] = useState(true);
    const [emailNotification, setEmailNotification] = useState(true);
    const [moreActivity, setMoreActivity] = useState(true);
    const [rentFrequency, setRentFrequency] = useState("5 days before");
    const rentFrequencyOptions = [
        { label: "5 days before", value: "5 days before" },
        { label: "10 days before", value: "10 days before" },
        { label: "15 days before", value: "15 days before" },
    ];

    // State for individual checkboxes
    const [settings, setSettings] = useState({
        newsUpdate: true,
        maintenanceRequest: false,
        feedback: true,
        onlinePayment: false,
        lease: false,
        integrationAlert: true,
    });

    const handleCheckboxChange = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Reusable styles
    const sectionTitleStyle = "text-base sm:text-lg font-medium text-[#1A1A1A]";
    const sectionDescStyle = "text-xs sm:text-sm text-gray-500 font-normal mt-0.5";
    const checkboxLabelStyle = "text-sm sm:text-base font-medium text-[#1A1A1A]";

    const CustomCheckbox = ({ checked, onChange, label, description }: { checked: boolean, onChange: () => void, label: string, description: string }) => (
        <div className="flex items-start gap-3 sm:gap-4 py-3 sm:py-4">
            <button
                onClick={onChange}
                className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center border transition-colors ${checked ? 'bg-[#7BD747] border-[#7BD747]' : 'bg-white border-black border-[1.5px]'
                    }`}
            >
                {checked && <Check size={14} className="sm:w-4 sm:h-4 text-white" strokeWidth={3} />}
            </button>
            <div className="flex flex-col gap-0.5">
                <span className={checkboxLabelStyle}>{label}</span>
                <span className={sectionDescStyle}>{description}</span>
            </div>
        </div>
    );

    return (
        <UserAccountSettingsLayout activeTab="Notifications">
            <div className="px-3 sm:px-4 md:px-8 pb-6 sm:pb-8 md:pb-10 divide-y divide-[#E5E7EB]">
                {/* All Notification Section */}
                <div className="py-4 sm:py-5 md:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                        <h2 className={sectionTitleStyle}>All Notification</h2>
                        <p className={sectionDescStyle}>Get notification what's happening right now, you can turn off at any time</p>
                    </div>
                    <Toggle checked={allNotification} onChange={setAllNotification} />
                </div>

                {/* Email Notification Section */}
                <div className="py-5 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex-1">
                            <h2 className={sectionTitleStyle}>Email Notification</h2>
                            <p className={sectionDescStyle}>Get notification what's happening right now, you can turn off at any time</p>
                        </div>
                        <Toggle checked={emailNotification} onChange={setEmailNotification} />
                    </div>

                    <div className="space-y-1 sm:space-y-2 mt-4 sm:mt-6">
                        <CustomCheckbox
                            checked={settings.newsUpdate}
                            onChange={() => handleCheckboxChange('newsUpdate')}
                            label="News and update settings"
                            description="Get notification what's happening right now, you can turn off at any time"
                        />
                        <CustomCheckbox
                            checked={settings.maintenanceRequest}
                            onChange={() => handleCheckboxChange('maintenanceRequest')}
                            label="Maintenance Request"
                            description="Get notification what's happening right now, you can turn off at any time"
                        />
                        <CustomCheckbox
                            checked={settings.feedback}
                            onChange={() => handleCheckboxChange('feedback')}
                            label="Feedback notifications"
                            description="Get notification what's happening right now, you can turn off at any time"
                        />
                        <CustomCheckbox
                            checked={settings.onlinePayment}
                            onChange={() => handleCheckboxChange('onlinePayment')}
                            label="Online Payment"
                            description="Get notification what's happening right now, you can turn off at any time"
                        />
                        <CustomCheckbox
                            checked={settings.lease}
                            onChange={() => handleCheckboxChange('lease')}
                            label="Lease"
                            description="Get notification what's happening right now, you can turn off at any time"
                        />
                    </div>
                </div>

                {/* Notify when rent expired */}
                <div className="py-5 sm:py-6 md:py-8">
                    <h2 className={sectionTitleStyle}>Notify when rent expired</h2>
                    <p className={sectionDescStyle}>Select</p>

                    <div className="mt-3 sm:mt-4">
                        <CustomDropdown
                            value={rentFrequency}
                            onChange={setRentFrequency}
                            options={rentFrequencyOptions}
                            searchable={false}
                            className="w-full sm:w-64 md:w-48"
                            buttonClassName="border-[#E5E7EB] text-xs sm:text-sm py-2 sm:py-2.5"
                        />
                    </div>
                </div>

                {/* More Activity */}
                <div className="py-5 sm:py-6 md:py-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="flex-1">
                            <h2 className={sectionTitleStyle}>More Activity</h2>
                            <p className={sectionDescStyle}>Get notification what's happening right now, you can turn off at any time</p>
                        </div>
                        <Toggle checked={moreActivity} onChange={setMoreActivity} />
                    </div>

                    <CustomCheckbox
                        checked={settings.integrationAlert}
                        onChange={() => handleCheckboxChange('integrationAlert')}
                        label="Integration Alert"
                        description="Get notification what's happening right now, you can turn off at any time"
                    />
                </div>
            </div>
        </UserAccountSettingsLayout>
    );
};

export default Notifications;
