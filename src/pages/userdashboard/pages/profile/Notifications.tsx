import React, { useState } from "react";
import UserAccountSettingsLayout from "../../components/layout/UserAccountSettingsLayout";
import Toggle from "../../../../components/Toggle";
import { Check, ChevronDown } from "lucide-react";



const Notifications: React.FC = () => {
    // State for main toggles
    const [allNotification, setAllNotification] = useState(true);
    const [emailNotification, setEmailNotification] = useState(true);
    const [moreActivity, setMoreActivity] = useState(true);
    const [rentFrequency, setRentFrequency] = useState("5 days before");
    const [isRentFrequencyKeyOpen, setIsRentFrequencyKeyOpen] = useState(false);
    const rentFrequencyDropdownRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (rentFrequencyDropdownRef.current && !rentFrequencyDropdownRef.current.contains(event.target as Node)) {
                setIsRentFrequencyKeyOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
    const sectionTitleStyle = "text-lg font-medium text-[#1A1A1A]";
    const sectionDescStyle = "text-sm text-gray-500 font-normal mt-0.5";
    const checkboxLabelStyle = "text-base font-medium text-[#1A1A1A]";

    const CustomCheckbox = ({ checked, onChange, label, description }: { checked: boolean, onChange: () => void, label: string, description: string }) => (
        <div className="flex items-start gap-4 py-4">
            <button
                onClick={onChange}
                className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center border transition-colors ${checked ? 'bg-[#7BD747] border-[#7BD747]' : 'bg-white border-black border-[1.5px]'
                    }`}
            >
                {checked && <Check size={16} className="text-white" strokeWidth={3} />}
            </button>
            <div className="flex flex-col gap-0.5">
                <span className={checkboxLabelStyle}>{label}</span>
                <span className={sectionDescStyle}>{description}</span>
            </div>
        </div>
    );

    return (
        <UserAccountSettingsLayout activeTab="Notifications">
            <div className="px-8 pb-10 divide-y divide-[#E5E7EB]">
                {/* All Notification Section */}
                <div className="py-6 flex items-center justify-between">
                    <div>
                        <h2 className={sectionTitleStyle}>All Notification</h2>
                        <p className={sectionDescStyle}>Get notification what's happening right now, you can turn off at any time</p>
                    </div>
                    <Toggle checked={allNotification} onChange={setAllNotification} />
                </div>

                {/* Email Notification Section */}
                <div className="py-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className={sectionTitleStyle}>Email Notification</h2>
                            <p className={sectionDescStyle}>Get notification what's happening right now, you can turn off at any time</p>
                        </div>
                        <Toggle checked={emailNotification} onChange={setEmailNotification} />
                    </div>

                    <div className="space-y-2 mt-6">
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
                <div className="py-8">
                    <h2 className={sectionTitleStyle}>Notify when rent expired</h2>
                    <p className={sectionDescStyle}>Select</p>

                    <div className="mt-4">
                        <div className="relative inline-block w-48" ref={rentFrequencyDropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsRentFrequencyKeyOpen(!isRentFrequencyKeyOpen)}
                                className="w-full flex items-center justify-between bg-white border border-[#E5E7EB] text-gray-700 py-2.5 px-4 rounded-lg focus:outline-none focus:border-[#7BD747] text-sm"
                            >
                                <span>{rentFrequency}</span>
                                <ChevronDown
                                    size={16}
                                    className={`text-gray-500 transition-transform ${isRentFrequencyKeyOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {isRentFrequencyKeyOpen && (
                                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                    {["5 days before", "10 days before", "15 days before"].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setRentFrequency(option);
                                                setIsRentFrequencyKeyOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm ${rentFrequency === option ? "bg-gray-50 text-[#7ED957]" : "text-gray-700"
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* More Activity */}
                <div className="py-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
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
