import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import ServiceBreadCrumb from "../../../../components/ServiceBreadCrumb";
import ServiceTabs from "../../../../components/ServiceTabs";
import SearchableDropdown from "@/components/ui/SearchableDropdown";

interface ToggleSwitchProps {
    checked: boolean;
    onChange: () => void;
}

function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
    return (
        <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={onChange}
            />
            <div className={`w-[52px] h-[28px] rounded-full transition-colors flex items-center px-1 ${checked ? 'bg-[#7BD747]' : 'bg-[#E5E5E5]'}`}>
                <div className={`h-5 w-5 rounded-full bg-white shadow-md transform transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-[0px]'}`} />
            </div>
        </label>
    );
}

interface CheckboxRowProps {
    label: string;
    description: string;
    checked: boolean;
    onToggle: () => void;
}

function CheckboxRow({ label, description, checked, onToggle }: CheckboxRowProps) {
    return (
        <div className="flex items-start gap-4">
            <button
                type="button"
                onClick={onToggle}
                className={`flex h-10 w-10 min-w-[40px] items-center justify-center rounded-md transition-all active:scale-95 border-2 ${checked ? "bg-[#7BD747] border-[#7BD747] text-white" : "bg-white border-gray-200 text-transparent"
                    }`}
            >
                <Check size={20} strokeWidth={3} />
            </button>
            <div className="flex-1">
                <p className="text-base font-bold text-gray-900 leading-snug">{label}</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed max-w-[500px]">{description}</p>
            </div>
        </div>
    );
}

const NotificationSettings = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('notifications');

    // State for Toggles
    const [emailNotification, setEmailNotification] = useState(true);
    const [moreActivity, setMoreActivity] = useState(true);

    // State for Checkboxes
    const [newsSettings, setNewsSettings] = useState(true);
    const [notificationChannel, setNotificationChannel] = useState(false);
    const [feedbackNotification, setFeedbackNotification] = useState(true);
    const [integrationAlert, setIntegrationAlert] = useState(true);

    // State for Dropdown
    const [leadsFrequency, setLeadsFrequency] = useState("");

    const frequencyOptions = [
        "Instant Notification",
        "Hourly Summary",
        "Daily Summary"
    ];

    const handleTabChange = (val: string) => {
        setActiveTab(val);
        if (val === 'profile') navigate('/service-dashboard/settings/profile');
        if (val === 'security') navigate('/service-dashboard/settings/security');
        if (val === 'integrations') navigate('/service-dashboard/settings/integrations');
    };

    return (
        <div className="min-h-screen font-sans w-full max-w-full overflow-x-hidden">
            <div className="w-full">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <ServiceBreadCrumb
                        items={[
                            { label: 'Dashboard', to: '/service-dashboard' },
                            { label: 'Settings', to: '/service-dashboard/settings' },
                            { label: 'Notifications', active: true }
                        ]}
                    />
                </div>

                {/* Main Content Card */}
                <div className="bg-[#F6F6F6] rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-semibold text-gray-800">Account settings</h1>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 px-4 sm:px-6 pt-2">
                        <ServiceTabs
                            tabs={[
                                { label: 'Profile', value: 'profile' },
                                { label: 'Security', value: 'security' },
                                { label: 'Integrations', value: 'integrations' },
                                { label: 'Notifications', value: 'notifications' }
                            ]}
                            activeTab={activeTab}
                            onTabChange={handleTabChange}
                            className="border-none"
                        />
                    </div>

                    <div className="p-4 sm:p-8">
                        <div className="px-1 py-2">
                            {/* Header */}
                            <section className="mb-8 border-b-[0.5px] border-[#201F23] pb-6">
                                <h2 className="text-xl font-bold text-[#1F2933]">Notification</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Get notification what's happening right now, you can turn off at any time
                                </p>
                            </section>

                            <div className="space-y-10">
                                {/* Email Notification */}
                                <section>
                                    <div className="mb-3">
                                        <h3 className="text-[17px] font-bold text-[#1F2933]">Email Notification</h3>
                                        <p className="text-[13px] text-gray-500 mt-1">
                                            Get notification what's happening right now, you can turn off at any time
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 mt-4">
                                        <ToggleSwitch
                                            checked={emailNotification}
                                            onChange={() => setEmailNotification(!emailNotification)}
                                        />
                                        <span className={`text-sm font-semibold text-[#1F2933]`}>
                                            {emailNotification ? 'On' : 'Off'}
                                        </span>
                                    </div>
                                </section>

                                {/* Checkbox Sections */}
                                <section className="space-y-8">
                                    <CheckboxRow
                                        label="News and update settings"
                                        description="Get notification what's happening right now, you can turn off at any time"
                                        checked={newsSettings}
                                        onToggle={() => setNewsSettings(!newsSettings)}
                                    />

                                    <CheckboxRow
                                        label="Notification Channel"
                                        description="Get notification what's happening right now, you can turn off at any time"
                                        checked={notificationChannel}
                                        onToggle={() => setNotificationChannel(!notificationChannel)}
                                    />

                                    <CheckboxRow
                                        label="Feedback notifications"
                                        description="Get notification what's happening right now, you can turn off at any time"
                                        checked={feedbackNotification}
                                        onToggle={() => setFeedbackNotification(!feedbackNotification)}
                                    />
                                </section>

                                {/* New Leads */}
                                <section className="border-t-[0.5px] border-[#201F23] pt-8">
                                    <div className="mb-3">
                                        <h3 className="text-[17px] font-bold text-[#1F2933]">Notify when service expired</h3>
                                        <p className="text-[13px] text-gray-500 mt-1">
                                            Notifications about service expiration
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <SearchableDropdown
                                            value={leadsFrequency}
                                            options={frequencyOptions}
                                            onChange={(val: string) => setLeadsFrequency(val)}
                                            placeholder="Select Frequency"
                                            className="w-full sm:w-[280px]"
                                            buttonClassName="h-11 w-full rounded-xl border border-gray-200 bg-white pl-4 pr-4 text-sm font-semibold text-gray-700 shadow-sm flex items-center justify-between outline-none focus:border-[#7BD747] focus:ring-4 focus:ring-[#7BD747]/10 transition-all"
                                        />
                                    </div>
                                </section>

                                {/* More Activity */}
                                <section>
                                    <div className="mb-3">
                                        <h3 className="text-[17px] font-bold text-[#1F2933]">More Activity</h3>
                                        <p className="text-[13px] text-gray-500 mt-1">
                                            Get notification what's happening right now, you can turn off at any time
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 mt-4">
                                        <ToggleSwitch
                                            checked={moreActivity}
                                            onChange={() => setMoreActivity(!moreActivity)}
                                        />
                                        <span className={`text-sm font-semibold text-[#1F2933]`}>
                                            {moreActivity ? 'On' : 'Off'}
                                        </span>
                                    </div>
                                </section>

                                {/* Integration Alert */}
                                <section className="pb-8">
                                    <CheckboxRow
                                        label="Integration Alert"
                                        description="Get notification what's happening right now, you can turn off at any time"
                                        checked={integrationAlert}
                                        onToggle={() => setIntegrationAlert(!integrationAlert)}
                                    />
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;
