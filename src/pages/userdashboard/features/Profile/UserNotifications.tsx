import React, { useState, useEffect } from "react";
import UserAccountSettingsLayout from "../../components/layout/UserAccountSettingsLayout";
import Toggle from "../../../../components/Toggle";
import { Check, Loader2 } from "lucide-react";
import CustomDropdown from "../../../Dashboard/components/CustomDropdown";
import { useGetNotificationSettings, useUpdateNotificationSettings } from "../../../../hooks/useNotificationQueries";

const Notifications: React.FC = () => {
    const { data: settings, isLoading } = useGetNotificationSettings();
    const updateSettingsMutation = useUpdateNotificationSettings();

    // Local state mirrors API data; synced via useEffect
    const [allNotification, setAllNotification] = useState(true);
    const [emailNotification, setEmailNotification] = useState(true);
    const [moreActivity, setMoreActivity] = useState(true);
    const [rentFrequency, setRentFrequency] = useState<'frequency' | 'instant' | 'hourly' | 'daily'>('frequency');

    const [newsUpdate, setNewsUpdate] = useState(true);
    const [feedback, setFeedback] = useState(true);
    const [integrationAlert, setIntegrationAlert] = useState(true);

    // Sync API data → local state
    useEffect(() => {
        if (settings) {
            setAllNotification(settings.notificationChannel);
            setEmailNotification(settings.emailNotification);
            setMoreActivity(settings.moreActivity);
            setNewsUpdate(settings.newsAndUpdates);
            setFeedback(settings.feedbackNotification);
            setIntegrationAlert(settings.integrationAlert);
            setRentFrequency(settings.leadsFrequency);
        }
    }, [settings]);

    const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    const persist = async (patch: Partial<{
        notificationChannel: boolean;
        emailNotification: boolean;
        moreActivity: boolean;
        newsAndUpdates: boolean;
        feedbackNotification: boolean;
        integrationAlert: boolean;
        leadsFrequency: 'frequency' | 'instant' | 'hourly' | 'daily';
    }>) => {
        try {
            await updateSettingsMutation.mutateAsync(patch);
            setSaveStatus({ type: 'success', msg: 'Saved' });
            setTimeout(() => setSaveStatus(null), 1500);
        } catch (err: any) {
            setSaveStatus({ type: 'error', msg: err?.message || 'Save failed' });
        }
    };

    const rentFrequencyOptions = [
        { label: "Instant", value: "instant" },
        { label: "Hourly", value: "hourly" },
        { label: "Daily", value: "daily" },
        { label: "Frequency", value: "frequency" },
    ];

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

    if (isLoading) {
        return (
            <UserAccountSettingsLayout activeTab="Notifications">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#7BD747]" />
                    <span className="ml-3 text-gray-600">Loading settings...</span>
                </div>
            </UserAccountSettingsLayout>
        );
    }

    return (
        <UserAccountSettingsLayout activeTab="Notifications">
            {saveStatus && (
                <div className={`mx-4 md:mx-8 mb-4 rounded-md p-3 text-sm flex items-center justify-between ${saveStatus.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    <span>{saveStatus.msg}</span>
                </div>
            )}
            <div className="px-3 sm:px-4 md:px-8 pb-6 sm:pb-8 md:pb-10 divide-y divide-[#E5E7EB]">
                {/* All Notification Section */}
                <div className="py-4 sm:py-5 md:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                        <h2 className={sectionTitleStyle}>All Notification</h2>
                        <p className={sectionDescStyle}>Get notification what's happening right now, you can turn off at any time</p>
                    </div>
                    <Toggle checked={allNotification} onChange={(v) => { setAllNotification(v); persist({ notificationChannel: v }); }} />
                </div>

                {/* Email Notification Section */}
                <div className="py-5 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex-1">
                            <h2 className={sectionTitleStyle}>Email Notification</h2>
                            <p className={sectionDescStyle}>Get notification what's happening right now, you can turn off at any time</p>
                        </div>
                        <Toggle checked={emailNotification} onChange={(v) => { setEmailNotification(v); persist({ emailNotification: v }); }} />
                    </div>

                    <div className="space-y-1 sm:space-y-2 mt-4 sm:mt-6">
                        <CustomCheckbox
                            checked={newsUpdate}
                            onChange={() => { const v = !newsUpdate; setNewsUpdate(v); persist({ newsAndUpdates: v }); }}
                            label="News and update settings"
                            description="Get notification what's happening right now, you can turn off at any time"
                        />
                        <CustomCheckbox
                            checked={feedback}
                            onChange={() => { const v = !feedback; setFeedback(v); persist({ feedbackNotification: v }); }}
                            label="Feedback notifications"
                            description="Get notification what's happening right now, you can turn off at any time"
                        />
                    </div>
                </div>

                {/* Notify when rent expired */}
                <div className="py-5 sm:py-6 md:py-8">
                    <h2 className={sectionTitleStyle}>Notification Frequency</h2>
                    <p className={sectionDescStyle}>Select</p>

                    <div className="mt-3 sm:mt-4">
                        <CustomDropdown
                            value={rentFrequency}
                            onChange={(v) => { const vv = v as 'frequency' | 'instant' | 'hourly' | 'daily'; setRentFrequency(vv); persist({ leadsFrequency: vv }); }}
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
                        <Toggle checked={moreActivity} onChange={(v) => { setMoreActivity(v); persist({ moreActivity: v }); }} />
                    </div>

                    <CustomCheckbox
                        checked={integrationAlert}
                        onChange={() => { const v = !integrationAlert; setIntegrationAlert(v); persist({ integrationAlert: v }); }}
                        label="Integration Alert"
                        description="Get notification what's happening right now, you can turn off at any time"
                    />
                </div>
            </div>
        </UserAccountSettingsLayout>
    );
};

export default Notifications;
