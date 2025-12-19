import { useState } from "react";
import type { ReactNode } from "react";
import { RentalApplicationSettingsLayout } from "../../../../components/common/RentalApplicationSettingsLayout";
import Toggle from "../../../../components/Toggle";

interface SectionConfig {
    title: string;
    description: string;
    linkText: string;
    linkAction?: () => void;
    actionType?: "button" | "toggle";
    buttonText?: string;
    buttonAction?: () => void;
}

interface SettingSectionProps {
    config: SectionConfig;
    isFirst?: boolean;
    toggleState?: boolean;
    onToggleChange?: (value: boolean) => void;
}

const SettingSection = ({ config, isFirst = false, toggleState, onToggleChange }: SettingSectionProps) => {
    const renderAction = (): ReactNode => {
        if (config.actionType === "button" && config.buttonText) {
            return (
                <div className="mt-4">
                    <button 
                        onClick={config.buttonAction}
                        className="bg-[#327B6E] text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-[#2a6a5f] transition-colors border border-white shadow-md"
                    >
                        {config.buttonText}
                    </button>
                </div>
            );
        }
        
        if (config.actionType === "toggle" && toggleState !== undefined && onToggleChange) {
            return (
                <div className="mt-4 flex items-center gap-3">
                    <Toggle checked={toggleState} onChange={onToggleChange} />
                    <span className={`text-sm font-medium ${toggleState ? 'text-[#7CD947]' : 'text-gray-600'}`}>
                        {toggleState ? 'Yes' : 'No'}
                    </span>
                </div>
            );
        }
        
        return null;
    };

    return (
        <div className={`py-6 ${!isFirst ? 'border-t-[0.5px] border-t-[#201F23]' : ''}`}>
            <h2 className="text-lg font-bold text-gray-900">{config.title}</h2>
            <p className="text-gray-600 text-sm mt-1 max-w-3xl">{config.description}</p>
            <button 
                onClick={config.linkAction}
                className="text-[#327B6E] text-sm font-medium mt-1 hover:underline"
            >
                {config.linkText}
            </button>
            {renderAction()}
        </div>
    );
};

export default function TermsSignature() {
    const [eSignEnabled, setESignEnabled] = useState(true);

    const sections: SectionConfig[] = [
        {
            title: "Background Question",
            description: "Choose the mode of your account either \"Landlord\" or \"Property Manager\". You can switch between account modes at any time.",
            linkText: "Learn more",
            actionType: "button",
            buttonText: "Create",
            buttonAction: () => {
                // TODO: Implement create action
            }
        },
        {
            title: "Document to be filled out",
            description: "Choose the mode of your account either \"Landlord\" or \"Property Manager\". You can switch between account modes at any time.",
            linkText: "Learn more",
            actionType: "button",
            buttonText: "Upload",
            buttonAction: () => {
                // TODO: Implement upload action
            }
        },
        {
            title: "Terms",
            description: "Choose the mode of your account either \"Landlord\" or \"Property Manager\". You can switch between account modes at any time.",
            linkText: "See the Terms",
            linkAction: () => {
                // TODO: Implement terms view action
            }
        },
        {
            title: "E-sign Application",
            description: "Choose the mode of your account either \"Landlord\" or \"Property Manager\". You can switch between account modes at any time.",
            linkText: "Learn more",
            actionType: "toggle"
        }
    ];

    return (
        <RentalApplicationSettingsLayout activeTab="terms-signature">
            <div className="space-y-0">
                {sections.map((section, index) => (
                    <SettingSection
                        key={section.title}
                        config={section}
                        isFirst={index === 0}
                        toggleState={section.actionType === "toggle" ? eSignEnabled : undefined}
                        onToggleChange={section.actionType === "toggle" ? setESignEnabled : undefined}
                    />
                ))}
            </div>
        </RentalApplicationSettingsLayout>
    );
}
