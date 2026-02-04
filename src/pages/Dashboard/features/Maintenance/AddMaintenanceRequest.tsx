import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

import MaintenanceStepper from './components/MaintenanceStepper';
import MaintenanceSuccessModal from './components/MaintenanceSuccessModal';
import AdvancedRequestForm from './components/AdvancedRequestForm';
import PropertyTenantsStep from './components/PropertyTenantsStep';
import DueDateMaterialsStep from './components/DueDateMaterialsStep';
import propertyImage from '../../../../assets/images/property.jpg';

const AddMaintenanceRequest: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isEditMode = location.state?.editMode;
    const targetSection = location.state?.targetSection;

    // Flow State - Start directly at step 1 with advanced flow
    const [mainStep, setMainStep] = useState(
        isEditMode
            ? (targetSection === 'materials' ? 3 : 1)
            : 1 // Start directly at General Details step
    );

    // Consolidated Request Data State
    const [requestData, setRequestData] = useState<any>({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdRequestId, setCreatedRequestId] = useState<string>('');

    // Mock Initial Data for Edit Mode
    const mockInitialData = {
        advancedForm: {
            category: 'appliances',
            subCategory: 'refrigerator',
            issue: 'not_cooling',
            subIssue: 'completely_warm',
            title: 'Refrigerator Warm',
            details: 'The fridge is not cooling at all.'
        },
        propertyStep: {
            property: '1',
            equipment: '1',
            tenantAuthorization: true,
            // ... other fields
        },
        dueDateStep: {
            dateInitiated: new Date('2025-11-24'),
            dateDue: new Date('2025-11-26'),
            priority: 'normal',
            materials: [{ id: '1', name: 'Coolant', quantity: 2 }]
        }
    };

    const [propertiesList] = useState([
        {
            id: '1',
            name: 'Grove Street',
            unit: 'House',
            address: '11 Grove Street, Boston, MA 12114, US',
            price: 8210,
            bedrooms: 3,
            bathrooms: 2,
            image: propertyImage
        },
        {
            id: '2',
            name: '721 Meadowview Lane',
            unit: 'House',
            address: '721 Meadowview Lane, Springfield, IL 62701, US',
            price: 6500,
            bedrooms: 4,
            bathrooms: 2,
            image: propertyImage
        },
        {
            id: '3',
            name: 'America Apartment',
            unit: 'Penthouse',
            address: '456 Park Avenue, New York, NY 10022, US',
            price: 12000,
            bedrooms: 2,
            bathrooms: 2,
            image: propertyImage
        },
    ]);

    const advancedSteps = [
        { id: 1, label: 'General Details' },
        { id: 2, label: 'Property & Tenants' },
        { id: 3, label: 'Due date & Materials' },
    ];

    const updateRequestData = (data: any) => {
        setRequestData((prev: any) => ({ ...prev, ...data }));
    };

    const handleSubmitRequest = (finalData?: any) => {
        const fullData = { ...requestData, ...finalData };
        const newRequestId = Math.floor(100000 + Math.random() * 900000).toString();
        setCreatedRequestId(newRequestId);

        console.log('Submitting Request:', {
            id: newRequestId,
            ...fullData
        });

        setShowSuccessModal(true);
    };

    const handleNext = () => {
        if (mainStep < 3) {
            setMainStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (mainStep === 1) {
            // Go back to previous page from step 1
            navigate(-1);
        } else {
            setMainStep(prev => prev - 1);
        }
    };

    // Helper to determine stepper current step
    const getStepperStep = () => {
        return mainStep;
    };

    return (
        <div className="flex flex-col h-full w-full bg-[var(--color-background)] px-6 overflow-y-auto">
            <div className="flex-1 flex items-start justify-center pt-8">
                <div className="bg-[#DFE5E3] rounded-[2rem] p-6 md:p-12 flex flex-col items-center w-full shadow-sm min-h-[80vh] relative max-w-6xl">

                    {/* Back Button */}
                    <div className="w-full md:w-auto relative mb-4 md:mb-0 md:absolute md:top-8 md:left-8">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-[#3D7475] font-bold hover:opacity-80 transition-opacity uppercase tracking-wide"
                        >
                            <ArrowLeft size={20} strokeWidth={2.5} />
                            Back
                        </button>
                    </div>

                    {/* Stepper */}
                    <div className="w-full mt-8 mb-6">
                        {/* Page Heading */}
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
                            {isEditMode ? 'Edit Maintenance Request' : 'Add Maintenance Request'}
                        </h1>
                        <MaintenanceStepper
                            currentStep={getStepperStep()}
                            steps={advancedSteps}
                        />
                    </div>

                    {/* Step 1: General Details */}
                    {mainStep === 1 && (
                        <AdvancedRequestForm
                            onNext={(data) => {
                                console.log('Advanced Data:', data);
                                updateRequestData(data);
                                handleNext();
                            }}
                            onDiscard={() => navigate('/dashboard')}
                            initialData={isEditMode ? mockInitialData.advancedForm : undefined}
                        />
                    )}

                    {/* Step 2: Property Selection */}
                    {mainStep === 2 && (
                        <PropertyTenantsStep
                            onNext={(data) => {
                                updateRequestData(data);
                                handleNext();
                            }}
                            onBack={handleBack}
                            properties={propertiesList}
                            initialData={isEditMode ? mockInitialData.propertyStep : undefined}
                        />
                    )}

                    {/* Step 3: Due Date & Materials */}
                    {mainStep === 3 && (
                        <DueDateMaterialsStep
                            onNext={(data) => {
                                console.log('Due Date Data:', data);
                                handleSubmitRequest(data);
                            }}
                            onBack={handleBack}
                            initialData={isEditMode ? mockInitialData.dueDateStep : undefined}
                        />
                    )}

                    <MaintenanceSuccessModal
                        isOpen={showSuccessModal}
                        onClose={() => setShowSuccessModal(false)}
                        onBackToList={() => navigate('/dashboard/maintenance/requests')}
                        onAssignPro={() => {
                            console.log('Assign Service Pro clicked');
                            navigate('/dashboard'); // Or navigate to assign pro page
                        }}
                        requestId={createdRequestId}
                        propertyName={propertiesList.find(p => p.id === requestData.selectedProperty)?.name || 'Property'}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddMaintenanceRequest;
