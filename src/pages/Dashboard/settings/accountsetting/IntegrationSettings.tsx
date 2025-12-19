import Button from "../../../../components/common/Button";
import { AccountSettingsLayout } from "../../../../components/common/AccountSettingsLayout";

export default function IntegrationSettings() {
  return (
    <AccountSettingsLayout activeTab="integrations">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Connected apps</h2>
        <p className="text-xs text-gray-600">
          Connect property management tools, accounting platforms, and communication apps to keep everything in sync.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            name: "Google Calendar",
            description: "Sync tasks and reminders with your Google Calendar.",
          },
        ].map((item) => (
          <div
            key={item.name}
            className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-4 flex items-start justify-between gap-3"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900">{item.name}</p>
              <p className="text-xs text-gray-600 mt-1">{item.description}</p>
            </div>
            <Button
              type="button"
              variant="Active"
              size="sm"
              className="mt-1 rounded-full !bg-[#7CD947] text-xs shadow-[0_4px_10px_rgba(124,217,71,0.45)] border-none hover:bg-[#6BC53B]"
            >
              Connect
            </Button>
          </div>
        ))}
      </div>
    </AccountSettingsLayout>
  );
}


