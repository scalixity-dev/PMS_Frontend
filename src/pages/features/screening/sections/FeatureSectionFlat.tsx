import React from "react";
import GreenFeaturesSliderSection from "../../../../components/GreenFeaturesSliderSection";
import { BarChart2, CreditCard, FileCheck } from "lucide-react";

const FeatureSectionFlat: React.FC = () => {
    const data = [
        {
            icon: <BarChart2 className="text-[#2A4C45]" size={26} />,
            text: "Automatic monthly reporting—always included."
        },
        {
            icon: <CreditCard className="text-[#2A4C45]" size={26} />,
            text: "Report the last 24 months of payments, all at once"
        },
        {
            icon: <FileCheck className="text-[#2A4C45]" size={26} />,
            text: "Get real-time verification updates with automated tracking."
        }
    ];

    return (
        <GreenFeaturesSliderSection data={data} />
    );
};

export default FeatureSectionFlat;