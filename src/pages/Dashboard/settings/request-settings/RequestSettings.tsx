import { RequestSettingsLayout } from "../../../../components/common/RequestSettingsLayout";
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";
import { useState } from "react";

export default function RequestSettings() {
    const [oneTimeFee, setOneTimeFee] = useState(true);
    const [dailyFee, setDailyFee] = useState(false);
    const [commOneTimeFee, setCommOneTimeFee] = useState(true);

    return (
        <RequestSettingsLayout
            activeTab="request-settings"
        >
            <div className="space-y-10">
                {/* Recurring service settings */}
                <section>
                    <h2 className="text-xl font-semibold text-[#273F3B] mb-2">
                        Recurring service settings
                    </h2>
                    <p className="text-[15px] text-[#525252] leading-relaxed max-w-2xl mb-1">
                        Set the default number of days early to post the recurring transactions before the invoice due date.
                    </p>
                    <a href="#" className="text-[#3A6D65] text-sm font-medium hover:underline mb-6 inline-block">
                        Learn more
                    </a>

                    <div className="mt-4 space-y-4">
                        <div className="w-48">
                            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7CD947] bg-white">
                                <option>Days</option>
                            </select>
                        </div>
                        <PrimaryActionButton text="Update" />
                    </div>
                </section>

                {/* Global Rent Late Fee Settings */}
                <section className="pt-6 border-t-[0.5px] border-[#201F23]">
                    <h2 className="text-xl font-semibold text-[#273F3B] mb-2">
                        Global Rent Late Fee Settings
                    </h2>
                    <p className="text-[15px] text-[#525252] leading-relaxed max-w-3xl mb-1">
                        The system will automatically generate the following late fee once the tenant's grace period has expired. Both fees may be simultaneously enabled which will cause the daily fee to begin including on the day following the monthly fee.
                    </p>
                    <a href="#" className="text-[#3A6D65] text-sm font-medium hover:underline mb-6 inline-block">
                        Learn more
                    </a>

                    <div className="mt-4 space-y-6">
                        <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={oneTimeFee}
                                    onChange={() => setOneTimeFee(!oneTimeFee)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7CD947]"></div>
                            </label>
                            <span className="text-sm font-medium text-[#273F3B]">One Time Rent Late Fee</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={dailyFee}
                                    onChange={() => setDailyFee(!dailyFee)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7CD947]"></div>
                            </label>
                            <span className="text-sm font-medium text-[#273F3B]">Daily Rent Late Fee</span>
                        </div>

                        <PrimaryActionButton text="Update" />
                    </div>
                </section>

                {/* Communication settings */}
                <section>
                    <h2 className="text-xl font-semibold text-[#273F3B] mb-2">
                        Communication settings
                    </h2>
                    <p className="text-[15px] text-[#525252] leading-relaxed max-w-3xl mb-1">
                        The system will automatically generate the following late fee once the tenant's grace period has expired. Both fees may be simultaneously enabled which will cause the daily fee to begin including on the day following the monthly fee.
                    </p>
                    <a href="#" className="text-[#3A6D65] text-sm font-medium hover:underline mb-6 inline-block">
                        Learn more
                    </a>

                    <div className="mt-4 space-y-6">
                        <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={commOneTimeFee}
                                    onChange={() => setCommOneTimeFee(!commOneTimeFee)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7CD947]"></div>
                            </label>
                            <span className="text-sm font-medium text-[#273F3B]">One Time Rent Late Fee</span>
                        </div>

                        <p className="text-[15px] text-[#525252] leading-relaxed max-w-2xl">
                            Set the default number of days early to post the recurring transactions before the invoice due date.
                        </p>

                        <PrimaryActionButton text="Update" />
                    </div>
                </section>
            </div>
        </RequestSettingsLayout>
    );
}
