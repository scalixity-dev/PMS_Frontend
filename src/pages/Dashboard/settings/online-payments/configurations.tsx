import { useState, useEffect } from "react";
import { OnlinePaymentsSettingsLayout } from "../../../../components/common/OnlinePaymentsSettingsLayout";
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";
import SearchableDropdown from "../../../../components/ui/SearchableDropdown";
import { useGetSettingsSection, useUpdateSettingsSection } from "../../../../hooks/useSettingsQueries";

export default function Configurations() {
    const [country, setCountry] = useState("");
    const [publicApiKey, setPublicApiKey] = useState("");
    const [secretApiKey, setSecretApiKey] = useState("");
    const countries = ["United States", "Canada", "United Kingdom"];

    const { data: onlinePaymentsSettings } = useGetSettingsSection<{
        country: string;
        publicApiKey: string;
        secretApiKey: string;
        isConnected: boolean;
    }>('online_payments');
    const updateSettings = useUpdateSettingsSection('online_payments');

    useEffect(() => {
        if (onlinePaymentsSettings?.values) {
            setCountry((onlinePaymentsSettings.values.country as string) || "");
            setPublicApiKey((onlinePaymentsSettings.values.publicApiKey as string) || "");
            setSecretApiKey((onlinePaymentsSettings.values.secretApiKey as string) || "");
        }
    }, [onlinePaymentsSettings]);

    const handleSetup = () => {
        if (!country || !publicApiKey || !secretApiKey) {
            alert("Please fill in all fields");
            return;
        }

        updateSettings.mutate({
            country,
            publicApiKey,
            secretApiKey,
            isConnected: true,
        });
    };

    return (
        <OnlinePaymentsSettingsLayout>
            <div className="min-h-[600px]">
                {/* About Section */}
                <div className="mb-10 pb-6 border-b-[0.5px] border-[#201F23]">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
                    <p className="text-gray-600 text-[15px] leading-relaxed max-w-2xl mb-2">
                        Set the default number of days early to post the recurring transactions before the
                        invoice due date.
                    </p>
                    <a href="#" className="text-[#5AB049] font-medium text-sm hover:underline inline-flex items-center gap-1">
                        Learn more
                    </a>
                </div>

                {/* Settings Section */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
                        <div
                            className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider select-none transition-colors bg-[#9CA3AF] text-white"
                        >
                            Not Active
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                        {/* Country Dropdown */}
                        <div className="space-y-2">
                            <div className="relative">
                                <SearchableDropdown
                                    value={country}
                                    onChange={setCountry}
                                    options={countries}
                                    placeholder="Where are you based"
                                    buttonClassName="w-full bg-white border border-gray-200 rounded-lg h-[50px] px-4 text-left flex items-center justify-between text-gray-600 text-sm focus:outline-none focus:border-[#5AB049] focus:ring-1 focus:ring-[#5AB049] transition-all"
                                />
                            </div>
                            <a href="#" className="block text-[#4B8F77] text-xs hover:underline">
                                Don't see your country?
                            </a>
                        </div>

                        {/* Public API Key */}
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Public API Key"
                                value={publicApiKey}
                                onChange={(e) => setPublicApiKey(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg h-[50px] px-4 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#5AB049] focus:ring-1 focus:ring-[#5AB049] transition-all"
                            />
                            <a href="#" className="block text-[#4B8F77] text-xs hover:underline">
                                How to find these keys?
                            </a>
                        </div>

                        {/* Secret API Key */}
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Secret API Key"
                                value={secretApiKey}
                                onChange={(e) => setSecretApiKey(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg h-[50px] px-4 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#5AB049] focus:ring-1 focus:ring-[#5AB049] transition-all"
                            />
                        </div>
                    </div>

                    {/* Setup Button */}
                    <div className="mt-8 mb-8">
                        <button
                            onClick={handleSetup}
                            disabled={updateSettings.isPending}
                            className="px-6 py-2 bg-[#5AB049] text-white font-medium rounded-lg hover:bg-[#4a9540] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updateSettings.isPending ? 'Setting up...' : 'Setup'}
                        </button>
                    </div>

                    {/* Footer - Stripe Account */}
                    <div className="space-y-1">
                        <p className="text-gray-600 text-sm">Don't have a stipe account?</p>
                        <a href="#" className="text-[#4B8F77] font-medium text-sm hover:underline">
                            Create stripe account
                        </a>
                    </div>

                </div>
            </div>
        </OnlinePaymentsSettingsLayout>
    );
}
