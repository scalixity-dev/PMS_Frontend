import { useState } from "react";
import { AccountSettingsLayout } from "../../../../components/common/AccountSettingsLayout";

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
      <div className={`w-[52px] h-[28px] rounded-full transition-colors flex items-center px-1 ${checked ? 'bg-[#7CD947]' : 'bg-[#E5E5E5]'}`}>
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
  // Styles based on logic: Green/Filled = Checked, Black/Border/BlackCheck = Unchecked

  const boxClasses = checked
    ? "bg-[#7CD947] border-[#7CD947]"
    : "bg-transparent border-[3px] border-[#333333]";

  const checkColor = checked ? "text-white" : "text-[#333333]";

  return (
    <div className="flex items-start gap-4">
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-10 w-10 min-w-[40px] items-center justify-center rounded-md transition-colors ${boxClasses}`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={checkColor}
        >
          <path
            d="M20 6L9 17L4 12"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="pt-1">
        <p className="text-[16px] font-semibold text-[#1F2933] leading-tight">{label}</p>
        <p className="text-[14px] text-gray-500 mt-1 leading-normal">{description}</p>
      </div>
    </div>
  );
}

export default function NotificationSettings() {
  // State for Toggles
  const [emailNotification, setEmailNotification] = useState(true);
  const [moreActivity, setMoreActivity] = useState(true);

  // State for Checkboxes
  const [newsSettings, setNewsSettings] = useState(true);
  const [notificationChannel, setNotificationChannel] = useState(false); // Default unchecked as per "Black border" request context
  const [feedbackNotification, setFeedbackNotification] = useState(true);
  const [integrationAlert, setIntegrationAlert] = useState(true);

  // State for Dropdown
  const [leadsFrequency, setLeadsFrequency] = useState("frequency");

  return (
    <AccountSettingsLayout activeTab="notifications">
      <div className="px-1 py-2">
        {/* Header */}
        <section className="mb-8 border-b-[0.5px] border-[#201F23] pb-6">
          <h2 className="text-xl font-semibold text-[#1F2933]">Notification</h2>
          <p className="text-sm text-gray-500 mt-1">
            Get notification what&apos;s happening right now, you can turn off at any time
          </p>
        </section>

        <div className="space-y-10">

          {/* Email Notification */}
          <section>
            <div className="mb-3">
              <h3 className="text-[17px] font-semibold text-[#1F2933]">Email Notification</h3>
              <p className="text-[13px] text-gray-500 mt-1">
                Get notification what&apos;s happening right now, you can turn off at any time
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <ToggleSwitch
                checked={emailNotification}
                onChange={() => setEmailNotification(!emailNotification)}
              />
              <span className={`text-sm font-semibold ${emailNotification ? 'text-[#1F2933]' : 'text-[#1F2933]'}`}>
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
              <h3 className="text-[17px] font-semibold text-[#1F2933]">New Leads</h3>
              <p className="text-[13px] text-gray-500 mt-1">
                Notifications about new leads
              </p>
            </div>
            <div className="mt-4">
              <div className="relative inline-block">
                <select
                  value={leadsFrequency}
                  onChange={(e) => setLeadsFrequency(e.target.value)}
                  className="h-10 w-[200px] rounded-md border border-[#E4E4E4] bg-white pl-4 pr-10 text-sm text-gray-500 shadow-sm appearance-none outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947]"
                >
                  <option value="frequency">Frequency</option>
                  <option value="instant">Instant</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* More Activity */}
          <section>
            <div className="mb-3">
              <h3 className="text-[17px] font-semibold text-[#1F2933]">More Activity</h3>
              <p className="text-[13px] text-gray-500 mt-1">
                Get notification what&apos;s happening right now, you can turn off at any time
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <ToggleSwitch
                checked={moreActivity}
                onChange={() => setMoreActivity(!moreActivity)}
              />
              <span className={`text-sm font-semibold ${moreActivity ? 'text-[#1F2933]' : 'text-[#1F2933]'}`}>
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
    </AccountSettingsLayout>
  );
}




