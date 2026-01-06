import React, { useState } from "react";
import { ReportSettingsLayout } from "../../../../components/common/ReportSettingsLayout";
import Toggle from "../../../../components/Toggle";
import { User } from "lucide-react";
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";
import CustomDropdown from "../../components/CustomDropdown";

const GeneralReportSettings: React.FC = () => {
    const [orientation, setOrientation] = useState("");
    const [autoSetRotation, setAutoSetRotation] = useState("");
    const [scaling, setScaling] = useState("");
    const [displayGridlines, setDisplayGridlines] = useState(true);
    const [repeatHeadings, setRepeatHeadings] = useState(false);
    const [displayStriped, setDisplayStriped] = useState(false);
    const [displayEveryProperty, setDisplayEveryProperty] = useState(false);

    const orientationOptions = [
        { label: "Landscape", value: "Landscape" },
        { label: "Portrait", value: "Portrait" },
    ];
    const rotationOptions = [
        { label: "0°", value: "0" },
        { label: "90°", value: "90" },
        { label: "180°", value: "180" },
        { label: "270°", value: "270" },
    ];
    const scalingOptions = [
        { label: "N/A", value: "N/A" },
        { label: "Small", value: "Small" },
        { label: "Medium", value: "Medium" },
        { label: "Large", value: "Large" },
    ];

    const dropdownButtonClass = "w-full flex items-center justify-between bg-white border border-[#E8E8E8] text-gray-500 text-sm rounded-lg px-4 py-2.5 hover:border-gray-400 focus:ring-2 focus:ring-[#7BD747] transition-all";

    return (
        <ReportSettingsLayout activeTab="general">
            {/* Company Logo */}
            <section className="space-y-4">
                <div>
                    <h2 className="text-base font-semibold text-gray-900">Company Logo</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Add your company logo to make reports more professional and easily identifiable to investors, owners, and clients.
                    </p>
                    <button className="text-[#486370] text-sm font-medium mt-1 hover:underline">
                        Learn more
                    </button>
                </div>

                {/* Logo Circle */}
                <div className="flex items-center">
                    <div className="w-20 h-20 rounded-full bg-[#2D3E3C] flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                            <User className="w-10 h-10 text-[#2D3E3C]" strokeWidth={2} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Orientation */}
            <section className="space-y-4 mt-8 pt-8 border-t border-gray-300">
                <div>
                    <h2 className="text-base font-semibold text-gray-900">Orientation</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Choose the page orientation — landscape, portrait, or set up a custom layout — for better visualization of your downloaded/printed PDF report.
                    </p>
                    <button className="text-[#486370] text-sm font-medium mt-1 hover:underline">
                        Learn more
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-[200px]">
                        <CustomDropdown
                            value={orientation}
                            onChange={setOrientation}
                            options={orientationOptions}
                            placeholder="Orientation"
                            buttonClassName={dropdownButtonClass}
                        />
                    </div>

                    <div className="w-full sm:w-[200px]">
                        <CustomDropdown
                            value={autoSetRotation}
                            onChange={setAutoSetRotation}
                            options={rotationOptions}
                            placeholder="Auto set rotation from"
                            buttonClassName={dropdownButtonClass}
                        />
                    </div>
                </div>

                <PrimaryActionButton text="Update" />
            </section>

            {/* Scaling */}
            <section className="space-y-4 mt-8 pt-8 border-t border-gray-300">
                <div>
                    <h2 className="text-base font-semibold text-gray-900">Scaling</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Adjust the font size of your downloaded/printed report to maintain a clear appearance.
                    </p>
                </div>

                <div className="w-full sm:w-[200px]">
                    <CustomDropdown
                        value={scaling}
                        onChange={setScaling}
                        options={scalingOptions}
                        placeholder="N/A"
                        buttonClassName={dropdownButtonClass}
                    />
                </div>

                <PrimaryActionButton text="Update" />
            </section>

            {/* Format */}
            <section className="space-y-4 mt-8 pt-8 border-t border-gray-300">
                <div>
                    <h2 className="text-base font-semibold text-gray-900">Format</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Select the layout that best suits your needs, with customizable options.
                    </p>
                    <button className="text-[#486370] text-sm font-medium mt-1 hover:underline">
                        Learn more
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    <div className="flex items-center gap-3">
                        <Toggle checked={displayGridlines} onChange={setDisplayGridlines} />
                        <span className="text-sm font-medium text-gray-700">Display Gridlines</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Toggle checked={repeatHeadings} onChange={setRepeatHeadings} />
                        <span className="text-sm font-medium text-gray-700">Repeat headings on each page</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Toggle checked={displayStriped} onChange={setDisplayStriped} />
                        <span className="text-sm font-medium text-gray-700">Display Striped row</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Toggle checked={displayEveryProperty} onChange={setDisplayEveryProperty} />
                        <span className="text-sm font-medium text-gray-700">Display every property on each page</span>
                    </div>
                </div>
            </section>
        </ReportSettingsLayout>
    );
};

export default GeneralReportSettings;
