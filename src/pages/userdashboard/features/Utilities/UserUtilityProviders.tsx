import React, { useMemo } from "react";
import { PlugZap, Droplets, FlameKindling, Loader2 } from "lucide-react";
import { useGetCurrentUser } from "../../../../hooks/useAuthQueries";
import { useGetLeasesByTenant } from "../../../../hooks/useLeaseQueries";

interface UtilityProviderItem {
  id: string;
  name: string;
  payer: string;
}

const getPayerLabel = (payer: string): string => {
  const lower = payer.toLowerCase();
  if (lower === "landlord") return "Paid by landlord";
  if (lower === "tenant") return "Paid by you";
  return "Shared responsibility";
};

const getPayerDotClass = (payer: string): string => {
  const lower = payer.toLowerCase();
  if (lower === "landlord") return "bg-emerald-500";
  if (lower === "tenant") return "bg-blue-500";
  return "bg-purple-500";
};

const getUtilityIcon = (name: string): React.ReactElement => {
  const lower = name.toLowerCase();

  if (lower.includes("water")) {
    return <Droplets className="w-5 h-5 text-[#3A7D76]" />;
  }

  if (lower.includes("gas")) {
    return <FlameKindling className="w-5 h-5 text-[#3A7D76]" />;
  }

  return <PlugZap className="w-5 h-5 text-[#3A7D76]" />;
};

const UtilityProviders: React.FC = () => {
  const { data: currentUser, isLoading: isUserLoading, error: userError } = useGetCurrentUser();
  const tenantId = currentUser?.userId ?? null;
  const { data: leases = [], isLoading: isLeasesLoading, error: leasesError } = useGetLeasesByTenant(
    tenantId,
    !!tenantId
  );

  const utilities = useMemo<UtilityProviderItem[]>(() => {
    const list: UtilityProviderItem[] = [];
    for (const lease of leases) {
      const leaseUtilities = lease.utilities ?? [];
      for (const u of leaseUtilities) {
        list.push({
          id: u.id,
          name: u.utility,
          payer: u.payer,
        });
      }
    }
    return list;
  }, [leases]);

  const isLoading = isUserLoading || (!!tenantId && isLeasesLoading);
  const error = userError ?? leasesError;
  const hasUtilities = utilities.length > 0;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-white px-4 py-6 md:px-8 md:py-10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#3A7D76]" />
          <p className="text-sm text-gray-600">Loading utilities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-white px-4 py-6 md:px-8 md:py-10 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
          <p className="text-red-800 text-sm">
            {error instanceof Error ? error.message : "Failed to load utilities. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white px-4 py-6 md:px-8 md:py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Utilities &amp; Responsibilities
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl">
            See which utilities are connected to your home and who is responsible for paying
            each one. This information comes from your lease and is view-only.
          </p>
        </div>

        {hasUtilities ? (
          <div className="bg-[#F4F4F4] rounded-2xl p-6 md:p-8 border border-[#E5E7EB] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {utilities.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-[#E3EBDE] flex items-center justify-center">
                        {getUtilityIcon(item.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getPayerLabel(item.payer)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${getPayerDotClass(item.payer)}`}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span className="font-medium text-gray-600">Legend:</span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Paid by landlord
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Paid by you
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                Shared responsibility
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-[#F4F4F4] rounded-2xl p-8 min-h-[260px] flex items-center justify-center">
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl px-10 py-8 max-w-md text-center shadow-sm">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-gray-50 p-3">
                <PlugZap className="w-6 h-6 text-[#3A7D76]" />
              </div>
              <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                No utilities configured yet
              </h2>
              <p className="text-sm text-gray-500">
                Your landlord has not added any utility providers to your lease. If you have
                questions about what is included, please contact them directly.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UtilityProviders;


