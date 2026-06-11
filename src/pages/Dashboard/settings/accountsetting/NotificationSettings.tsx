import { useEffect, useState } from "react";
import { AccountSettingsLayout } from "../../../../components/common/AccountSettingsLayout";
import { useGetNotificationSettings, useUpdateNotificationSettings } from "../../../../hooks/useNotificationQueries";
import { usePushNotifications } from "../../../../hooks/usePushNotifications";

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
  const { data: settings, isLoading, isError } = useGetNotificationSettings();
  const updateSettingsMutation = useUpdateNotificationSettings();
  const push = usePushNotifications();

  const [emailNotification, setEmailNotification] = useState(true);
  const [moreActivity, setMoreActivity] = useState(true);
  const [newsSettings, setNewsSettings] = useState(true);
  const [notificationChannel, setNotificationChannel] = useState(false);
  const [feedbackNotification, setFeedbackNotification] = useState(true);
  const [integrationAlert, setIntegrationAlert] = useState(true);
  const [leadsFrequency, setLeadsFrequency] = useState("frequency");

  useEffect(() => {
    if (!settings) return;
    setEmailNotification(settings.emailNotification);
    setMoreActivity(settings.moreActivity);
    setNewsSettings(settings.newsAndUpdates);
    setNotificationChannel(settings.notificationChannel);
    setFeedbackNotification(settings.feedbackNotification);
    setIntegrationAlert(settings.integrationAlert);
    setLeadsFrequency(settings.leadsFrequency);
  }, [settings]);

  const patchSetting = (payload: {
    emailNotification?: boolean;
    moreActivity?: boolean;
    newsAndUpdates?: boolean;
    notificationChannel?: boolean;
    feedbackNotification?: boolean;
    integrationAlert?: boolean;
    leadsFrequency?: "frequency" | "instant" | "hourly" | "daily";
  }) => {
    updateSettingsMutation.mutate(payload);
  };

  return (
    <AccountSettingsLayout activeTab="notifications">
      <div className="px-1 py-2">
        {/* Header */}
        <section className="mb-8 border-b-[0.5px] border-[#201F23] pb-6">
          <h2 className="text-xl font-semibold text-[#1F2933]">Notification</h2>
          <p className="text-sm text-gray-500 mt-1">
            Control app and email alerts for account activity, leads, and integrations.
          </p>
        </section>

        <div className="space-y-10">
          {isLoading && (
            <p className="text-sm text-gray-500">Loading notification settings...</p>
          )}
          {isError && (
            <p className="text-sm text-red-500">Failed to load notification settings.</p>
          )}
          {updateSettingsMutation.isPending && (
            <p className="text-sm text-gray-500">Saving changes...</p>
          )}

          {/* Email Notification */}
          <section>
            <div className="mb-3">
              <h3 className="text-[17px] font-semibold text-[#1F2933]">Email Notification</h3>
              <p className="text-[13px] text-gray-500 mt-1">
                Master switch for all email-based notifications. Turning this off disables email delivery.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <ToggleSwitch
                checked={emailNotification}
                onChange={() => {
                  const next = !emailNotification;
                  setEmailNotification(next);
                  patchSetting({ emailNotification: next });
                }}
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
              description="Product updates, release notes, and feature announcements."
              checked={newsSettings}
              onToggle={() => {
                const next = !newsSettings;
                setNewsSettings(next);
                patchSetting({ newsAndUpdates: next });
              }}
            />

            <CheckboxRow
              label="Notification Channel"
              description="In-app alerts in dashboard feeds and notification center."
              checked={notificationChannel}
              onToggle={() => {
                const next = !notificationChannel;
                setNotificationChannel(next);
                patchSetting({ notificationChannel: next });
              }}
            />

            <CheckboxRow
              label="Feedback notifications"
              description="Updates when feedback is received, reviewed, or actioned."
              checked={feedbackNotification}
              onToggle={() => {
                const next = !feedbackNotification;
                setFeedbackNotification(next);
                patchSetting({ feedbackNotification: next });
              }}
            />
          </section>

          {/* Push notifications (this device) */}
          <section className="border-t-[0.5px] border-[#201F23] pt-8">
            <div className="mb-3">
              <h3 className="text-[17px] font-semibold text-[#1F2933]">Push notifications</h3>
              <p className="text-[13px] text-gray-500 mt-1">
                Get instant alerts on this device — even when the app is closed — for maintenance,
                applications, leases, and payments.
              </p>
            </div>

            {!push.supported ? (
              <p className="text-[13px] text-gray-400 mt-3">
                Push isn't available in this browser{push.permission === 'unsupported' ? '' : ' yet'}.
                Use a supported browser (Chrome, Edge, Firefox) or install the app to your home screen.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={push.enabled}
                    onChange={() => {
                      if (push.busy) return;
                      if (push.enabled) {
                        push.disable();
                      } else {
                        push.enable().then((ok) => {
                          if (ok) {
                            setNotificationChannel(true);
                          }
                        });
                      }
                    }}
                  />
                  <span className="text-sm font-semibold text-[#1F2933]">
                    {push.busy ? 'Working…' : push.enabled ? 'On' : 'Off'}
                  </span>
                  {push.enabled && (
                    <button
                      type="button"
                      onClick={() => push.sendTest()}
                      className="ml-2 rounded-md border border-[#E4E4E4] px-3 py-1.5 text-xs font-semibold text-[#1F2933] hover:bg-gray-50 transition-colors"
                    >
                      Send test
                    </button>
                  )}
                </div>
                {push.permission === 'denied' && (
                  <p className="text-[13px] text-red-500">
                    Notifications are blocked for this site. Allow them in your browser's site
                    settings, then toggle this on again.
                  </p>
                )}
              </div>
            )}
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
                  onChange={(e) => {
                    const next = e.target.value as "frequency" | "instant" | "hourly" | "daily";
                    setLeadsFrequency(next);
                    patchSetting({ leadsFrequency: next });
                  }}
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
                Operational alerts for account security and unusual activity.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <ToggleSwitch
                checked={moreActivity}
                onChange={() => {
                  const next = !moreActivity;
                  setMoreActivity(next);
                  patchSetting({ moreActivity: next });
                }}
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
              description="Connection status changes, token expiry, and integration errors."
              checked={integrationAlert}
              onToggle={() => {
                const next = !integrationAlert;
                setIntegrationAlert(next);
                patchSetting({ integrationAlert: next });
              }}
            />
          </section>

        </div>
      </div>
    </AccountSettingsLayout>
  );
}


