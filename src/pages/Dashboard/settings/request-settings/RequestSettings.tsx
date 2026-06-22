import { RequestSettingsLayout } from "../../../../components/common/RequestSettingsLayout";
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";
import { useEffect, useState } from "react";
import { useGetSettingsSection, useUpdateSettingsSection } from "../../../../hooks/useSettingsQueries";
import { useTeamPermissions } from "../../../../context/TeamPermissionContext";

interface RequestSettingsValues {
  recurringDays: string;
  oneTimeFee: boolean;
  dailyFee: boolean;
  communicationEnabled: boolean;
}

export default function RequestSettings() {
  const { isTeamMember, canManage } = useTeamPermissions();
  const canEdit = !isTeamMember || canManage('settings');
  const { data } = useGetSettingsSection<RequestSettingsValues>("request_settings");
  const updateSettings = useUpdateSettingsSection<RequestSettingsValues>("request_settings");

  const [form, setForm] = useState<RequestSettingsValues>({
    recurringDays: "Days",
    oneTimeFee: true,
    dailyFee: false,
    communicationEnabled: true,
  });

  useEffect(() => {
    if (data?.values) {
      setForm({
        recurringDays: data.values.recurringDays ?? "Days",
        oneTimeFee: Boolean(data.values.oneTimeFee),
        dailyFee: Boolean(data.values.dailyFee),
        communicationEnabled: Boolean(data.values.communicationEnabled),
      });
    }
  }, [data]);

  const save = (next: RequestSettingsValues = form) => {
    updateSettings.mutate(next);
  };

  return (
    <RequestSettingsLayout activeTab="request-settings">
      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-semibold text-[#273F3B] mb-2">Recurring service settings</h2>
          <p className="text-[15px] text-[#525252] leading-relaxed max-w-2xl mb-1">
            Set the default number of days early to post the recurring transactions before the invoice due date.
          </p>
          <a href="#" className="text-[#3A6D65] text-sm font-medium hover:underline mb-6 inline-block">Learn more</a>

          <div className="mt-4 space-y-4">
            <div className="w-48">
              <select
                value={form.recurringDays}
                onChange={(e) => canEdit && setForm((prev) => ({ ...prev, recurringDays: e.target.value }))}
                disabled={!canEdit}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#7CD947] bg-white disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option>Days</option>
                <option>1 Day</option>
                <option>2 Days</option>
                <option>3 Days</option>
                <option>7 Days</option>
              </select>
            </div>
            {canEdit && <PrimaryActionButton text="Update" onClick={() => save()} />}
          </div>
        </section>

        <section className="pt-6 border-t-[0.5px] border-[#201F23]">
          <h2 className="text-xl font-semibold text-[#273F3B] mb-2">Global Rent Late Fee Settings</h2>
          <p className="text-[15px] text-[#525252] leading-relaxed max-w-3xl mb-1">
            The system will automatically generate the following late fee once the tenant's grace period has expired. Both fees may be simultaneously enabled which will cause the daily fee to begin including on the day following the monthly fee.
          </p>
          <a href="#" className="text-[#3A6D65] text-sm font-medium hover:underline mb-6 inline-block">Learn more</a>

          <div className="mt-4 space-y-6">
            <div className="flex items-center gap-3">
              <label className={`relative inline-flex items-center ${canEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={form.oneTimeFee}
                  disabled={!canEdit}
                  onChange={() => {
                    if (!canEdit) return;
                    const next = { ...form, oneTimeFee: !form.oneTimeFee };
                    setForm(next);
                    save(next);
                  }}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7CD947]"></div>
              </label>
              <span className="text-sm font-medium text-[#273F3B]">One Time Rent Late Fee</span>
            </div>

            <div className="flex items-center gap-3">
              <label className={`relative inline-flex items-center ${canEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={form.dailyFee}
                  disabled={!canEdit}
                  onChange={() => {
                    if (!canEdit) return;
                    const next = { ...form, dailyFee: !form.dailyFee };
                    setForm(next);
                    save(next);
                  }}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7CD947]"></div>
              </label>
              <span className="text-sm font-medium text-[#273F3B]">Daily Rent Late Fee</span>
            </div>

            {canEdit && <PrimaryActionButton text="Update" onClick={() => save()} />}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#273F3B] mb-2">Communication settings</h2>
          <p className="text-[15px] text-[#525252] leading-relaxed max-w-3xl mb-1">
            Enable or disable communication automation for request lifecycle updates.
          </p>
          <a href="#" className="text-[#3A6D65] text-sm font-medium hover:underline mb-6 inline-block">Learn more</a>

          <div className="mt-4 space-y-6">
            <div className="flex items-center gap-3">
              <label className={`relative inline-flex items-center ${canEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={form.communicationEnabled}
                  disabled={!canEdit}
                  onChange={() => {
                    if (!canEdit) return;
                    const next = { ...form, communicationEnabled: !form.communicationEnabled };
                    setForm(next);
                    save(next);
                  }}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7CD947]"></div>
              </label>
              <span className="text-sm font-medium text-[#273F3B]">Communication Automation</span>
            </div>

            {canEdit && <PrimaryActionButton text="Update" onClick={() => save()} />}
          </div>
        </section>
      </div>
    </RequestSettingsLayout>
  );
}
