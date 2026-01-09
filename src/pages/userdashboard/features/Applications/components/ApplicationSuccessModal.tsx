import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import successAnimationUrl from '../../../../Dashboard/features/ListUnit/Success.lottie?url';
import BaseModal from '@/components/common/modals/BaseModal';

interface ApplicationSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
    isWarning?: boolean;
}

const ApplicationSuccessModal: React.FC<ApplicationSuccessModalProps> = ({
    isOpen,
    onClose,
    message,
    isWarning = false,
}) => {
    const navigate = useNavigate();

    const handleViewApplications = () => {
        onClose();
        navigate('/userdashboard/applications');
    };

    const handleGoHome = () => {
        onClose();
        navigate('/userdashboard');
    };

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
                    label: 'View My Applications',
                    onClick: handleViewApplications,
                    variant: 'primary',
                    className: "bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/30 text-white w-full justify-center",
                },
                {
                    label: 'Back to Dashboard',
                    onClick: handleGoHome,
                    variant: 'ghost',
                    className: "text-[#ADADAD] hover:text-[#1A1A1A] w-full justify-center",
                }
            ]}
        >
            <div className="flex flex-col items-center pb-4">
                <div className="w-40 h-40 mb-2">
                    <DotLottieReact src={successAnimationUrl} loop autoplay style={{ width: '100%', height: '100%' }} />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${isWarning ? 'text-[#F57C00]' : 'text-[#1A1A1A]'}`}>
                    {isWarning ? 'Saved Locally' : 'Well Done!'}
                </h3>
                <p className="text-[#ADADAD] text-sm font-medium leading-relaxed text-center px-4">
                    {message || "Your application has been submitted successfully. We'll notify you once it's reviewed."}
                </p>
            </div>
        </BaseModal>
    );
};

export default ApplicationSuccessModal;
