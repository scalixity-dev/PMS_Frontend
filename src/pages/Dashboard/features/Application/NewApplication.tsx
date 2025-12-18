import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ApplicationStepper from './components/ApplicationStepper';
import PropertySelectionStep from './steps/PropertySelectionStep';
import ApplicantInfoStep from './steps/ApplicantInfoStep';
import OccupantsStep from './steps/OccupantsStep';
import PetsStep from './steps/PetsStep';
import VehiclesStep from './steps/VehiclesStep';
import AdditionalResidenceInfoStep from './steps/AdditionalResidenceInfoStep';
// ... existing imports ...
import ResidencesStep from './steps/ResidencesStep';
import { useApplicationStore } from './store/applicationStore';

const NewApplication: React.FC = () => {
    const navigate = useNavigate();

    const {
        currentStep,
        setCurrentStep,
        isPropertySelected,
        setIsPropertySelected,
        resetForm
    } = useApplicationStore();

    // Reset form on component unmount
    useEffect(() => {
        return () => {
            resetForm();
        };
    }, [resetForm]);

    // Add local state
    const [occupantSubStep, setOccupantSubStep] = React.useState<'occupants' | 'pets' | 'vehicles'>('occupants');
    const [residenceSubStep, setResidenceSubStep] = React.useState<'history' | 'additional'>('history');

    const handleBack = () => {
        if (currentStep === 1) {
            // ... existing logic ...
            if (isPropertySelected) {
                // Go back to property selection
                setIsPropertySelected(false);
            } else {
                // Exit
                navigate('/dashboard/leasing/applications');
            }
        } else if (currentStep === 2) {
            if (occupantSubStep === 'pets') {
                setOccupantSubStep('occupants');
            } else if (occupantSubStep === 'vehicles') {
                setOccupantSubStep('pets');
            } else {
                setCurrentStep(currentStep - 1);
            }
        } else if (currentStep === 3) {
            if (residenceSubStep === 'additional') {
                setResidenceSubStep('history');
            } else {
                // Go back to Step 2 (Vehicles)
                // We need to set occupantSubStep to 'vehicles' so user lands on last part of Step 2? 
                // Currently defaults to 'occupants' in useState but logic inside step 2 resets it?
                // Let's just go back to step 2 generally.
                setCurrentStep(currentStep - 1);
                setOccupantSubStep('vehicles'); // Optional convenience
            }
        }
        else {
            setCurrentStep(currentStep - 1);
        }
    };

    const handlePropertySelected = () => {
        setIsPropertySelected(true);
    };

    const renderContent = () => {
        switch (currentStep) {
            // ... case 1 ...
            case 1:
                return isPropertySelected ? (
                    <ApplicantInfoStep onNext={() => setCurrentStep(currentStep + 1)} />
                ) : (
                    <PropertySelectionStep onNext={handlePropertySelected} />
                );
            // ... case 2 ...
            case 2:
                if (occupantSubStep === 'occupants') {
                    return <OccupantsStep onNext={() => setOccupantSubStep('pets')} />;
                } else if (occupantSubStep === 'pets') {
                    return <PetsStep onNext={() => setOccupantSubStep('vehicles')} />;
                } else {
                    return <VehiclesStep onNext={() => {
                        setOccupantSubStep('occupants'); // Reset logic if needed
                        setCurrentStep(currentStep + 1);
                    }} />;
                }
            case 3:
                if (residenceSubStep === 'history') {
                    return <ResidencesStep onNext={() => setResidenceSubStep('additional')} />;
                } else {
                    return <AdditionalResidenceInfoStep onNext={() => setCurrentStep(currentStep + 1)} />;
                }
            // ...
            // ...
            case 4:
                return <div className="text-center py-10">Contacts Step (Coming Soon)</div>;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto bg-[#DFE5E3] p-6 pb-20 flex flex-col rounded-xl">
            {/* Header Navigation */}
            <div className="w-full flex items-center justify-between mb-8">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-[#3A6D6C] font-bold text-sm tracking-wide hover:opacity-80 transition-opacity"
                >
                    <ChevronLeft size={20} strokeWidth={3} />
                    BACK
                </button>
            </div>

            {/* Stepper */}
            <ApplicationStepper currentStep={currentStep} />

            {/* Content Area */}
            <div className="w-full flex-1 mt-4">
                {renderContent()}
            </div>
        </div>
    );
};

export default NewApplication;
