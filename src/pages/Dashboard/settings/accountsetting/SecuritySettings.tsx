import Button from "../../../../components/common/Button";
import { AccountSettingsLayout } from "../../../../components/common/AccountSettingsLayout";

interface LoginSession {
  location: string;
  device: string;
  ipAddress: string;
  lastActivity: string;
}

const mockSessions: LoginSession[] = [
  {
    location: "New York, USA",
    device: "iPhone 13 Pro",
    ipAddress: "192.168.1.100",
    lastActivity: "2 hours ago",
  },
  {
    location: "San Francisco, USA",
    device: "MacBook Pro",
    ipAddress: "10.0.0.45",
    lastActivity: "1 day ago",
  },
  {
    location: "London, UK",
    device: "Windows PC",
    ipAddress: "172.16.0.25",
    lastActivity: "3 days ago",
  },
];

export default function SecuritySettings() {
  return (
    <AccountSettingsLayout activeTab="security">
      {/* ID Verification Section */}
      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">ID Verification</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#7CD947] bg-[#F0FAE8] border border-[#D7F0C2]">
                In progress
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Identity verification is required to prevent fraud and increase security. TenantCloud works with Stripe
              to conduct identity verification online.
            </p>
            <a href="#" className="text-xs font-medium text-[#1E88E5] hover:underline inline-block">
              Learn more
            </a>
          </div>
          <Button
            type="button"
            variant="primary"
            className="w-full sm:w-auto whitespace-nowrap bg-[#3D7475] border-none"
          >
            Continue
          </Button>
        </div>
      </section>

      {/* Export Data Section */}
      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Export Data</h2>
            <p className="text-xs text-gray-600">
              Identity verification is required to prevent fraud and increase security. TenantCloud works with Stripe
              to conduct identity verification online.
            </p>
            <a href="#" className="text-xs font-medium text-[#1E88E5] hover:underline inline-block">
              Learn more
            </a>
          </div>
          <Button
            type="button"
            variant="primary"
            className="w-full sm:w-auto whitespace-nowrap bg-[#3D7475] border-none"
          >
            Export
          </Button>
        </div>
      </section>

      {/* Two Steps Authentication Section */}
      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Two Steps Authentication</h2>
            <p className="text-xs text-gray-600">
              Identity verification is required to prevent fraud and increase security. TenantCloud works with Stripe
              to conduct identity verification online.
            </p>
            <a href="#" className="text-xs font-medium text-[#1E88E5] hover:underline inline-block">
              Learn more
            </a>
          </div>
          <Button
            type="button"
            variant="primary"
            className="w-full sm:w-auto whitespace-nowrap bg-[#3D7475] border-none"
          >
            Enable
          </Button>
        </div>
      </section>

      {/* Login Sessions Section */}
      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-5 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Login sessions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E8E8]" style={{ backgroundColor: "#7CD947" }}>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white rounded-tl-lg">Location</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Device</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">IP Address</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white rounded-tr-lg">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {mockSessions.map((session, index) => (
                <tr key={index} className="border-b border-[#E8E8E8]">
                  <td className="px-4 py-3 text-sm text-gray-600">{session.location}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{session.device}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{session.ipAddress}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{session.lastActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AccountSettingsLayout>
  );
}


