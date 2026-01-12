import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import successAnimationUrl from '../../../../Dashboard/features/ListUnit/Success.lottie?url';
import BaseModal from '@/components/common/modals/BaseModal';

interface ApplicationSubmittedModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyName: string;
    landlordName: string;
}

const ApplicationSubmittedModal: React.FC<ApplicationSubmittedModalProps> = ({
    isOpen,
    onClose,
    propertyName,
    landlordName,
}) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title=""
            maxWidth="max-w-sm"
            showCloseIcon={true}
            headerBorder={false}
            footerBorder={false}
            footerButtons={[
                {
                    label: 'Done',
                    onClick: onClose,
                    variant: 'primary',
                    className: "bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/30 text-white w-full justify-center",
                }
            ]}
        >
            <div className="flex flex-col items-center pb-4">
                <div className="w-40 h-40 mb-2">
                    <DotLottieReact src={successAnimationUrl} loop autoplay style={{ width: '100%', height: '100%' }} />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-[#1A1A1A]">
                    Well Done!
                </h3>
                <p className="text-[#ADADAD] text-sm font-medium leading-relaxed text-center px-4">
                    Your application for <span className="text-[#1A1A1A] font-semibold">{propertyName}</span> has been successfully sent to <span className="text-[#1A1A1A] font-semibold">{landlordName}</span>.
                </p>
            </div>
        </BaseModal>
    );
};

export default ApplicationSubmittedModal;
