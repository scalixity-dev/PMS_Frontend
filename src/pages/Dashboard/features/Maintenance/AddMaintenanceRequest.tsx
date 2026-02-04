import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

import MaintenanceStepper from './components/MaintenanceStepper';
import MaintenanceSuccessModal from './components/MaintenanceSuccessModal';
import AdvancedRequestForm from './components/AdvancedRequestForm';
import PropertyTenantsStep from './components/PropertyTenantsStep';
import DueDateMaterialsStep from './components/DueDateMaterialsStep';
import {
    useMaintenanceRequestFormStore,
    type MaintenancePropertyState,
} from './store/maintenanceRequestStore';
import {
    maintenanceRequestService,
    type CreateMaintenanceRequestInput,
    type MaintenanceCategory,
    type MaintenancePriority,
    type UploadCategory,
} from '../../../../services/maintenance-request.service';
import { useCreateMaintenanceRequest } from '../../../../hooks/useMaintenanceRequestQueries';

const mapCategory = (category: string): MaintenanceCategory => {
    const normalized = category.toLowerCase();
    if (normalized === 'appliances') return 'APPLIANCES';
    if (normalized === 'electrical') return 'ELECTRICAL';
    if (normalized === 'plumbing') return 'PLUMBING';
    // Fallback category
    return 'HOUSEHOLD';
};

const mapPriority = (priority: string): MaintenancePriority => {
    const normalized = priority.toLowerCase();
    if (normalized === 'low') return 'LOW';
    if (normalized === 'high') return 'HIGH';
    if (normalized === 'urgent') return 'URGENT';
    // Treat "normal" or empty as MEDIUM
    return 'MEDIUM';
};

const getUploadCategoryForFile = (file: File): UploadCategory => {
    if (file.type.startsWith('image/')) return 'IMAGE';
    if (file.type.startsWith('video/')) return 'VIDEO';
    return 'DOCUMENT';
};

const buildTenantMeta = (
    property: MaintenancePropertyState,
): CreateMaintenanceRequestInput['tenantMeta'] => {
    return {
        tenantAuthorization: property.tenantAuthorization,
        accessCode: property.accessCode || undefined,
        petsInResidence: property.petsInResidence || undefined,
        selectedPets: property.selectedPets,
        dateOptions: property.dateOptions.map((option) => ({
            date: option.date ? option.date.toISOString() : undefined,
            timeSlots: option.timeSlots,
        })),
    };
};

const AddMaintenanceRequest: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isEditMode = location.state?.editMode;
    const targetSection = location.state?.targetSection;

    const { advanced, property, due, reset } = useMaintenanceRequestFormStore();
    const { mutateAsync: createRequest } = useCreateMaintenanceRequest();

    // Flow State - Start directly at step 1 with advanced flow
    const [mainStep, setMainStep] = useState(
        isEditMode
            ? (targetSection === 'materials' ? 3 : 1)
            : 1 // Start directly at General Details step
    );

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

    const advancedSteps = [
        { id: 1, label: 'General Details' },
        { id: 2, label: 'Property & Tenants' },
        { id: 3, label: 'Due date & Materials' },
    ];

    const handleSubmitRequest = async () => {
        try {
            const payload: CreateMaintenanceRequestInput = {
                propertyId: property.propertyId,
                category: mapCategory(advanced.category),
                subcategory: advanced.subCategory,
                issue: advanced.issue || undefined,
                subissue: advanced.subIssue || undefined,
                title: advanced.title,
                problemDetails: advanced.details || undefined,
                priority: due.priority ? mapPriority(due.priority) : undefined,
                dueDate: due.dateDue ? due.dateDue.toISOString() : undefined,
                equipmentLinked: property.linkEquipment,
                equipmentId:
                    property.linkEquipment && property.selectedEquipment
                        ? property.selectedEquipment
                        : undefined,
                tenantMeta: buildTenantMeta(property),
                materials: due.materials.map((material) => ({
                    materialName: material.name,
                    quantity: material.quantity,
                })),
            };

            const created = await createRequest(payload);

            // Upload media and attachments linked to this request
            const filesToUpload = advanced.files ?? [];
            if (filesToUpload.length > 0) {
                await Promise.all(
                    filesToUpload.map((file) =>
                        maintenanceRequestService.uploadFile({
                            file,
                            category: getUploadCategoryForFile(file),
                            propertyId: property.propertyId || undefined,
                            maintenanceRequestId: created.id,
                            description: file.name,
                        }),
                    ),
                );
            }
            setCreatedRequestId(created.id);
            setShowSuccessModal(true);
            reset();
        } catch (error) {
            // Error is already exposed via createError; just log here
            // eslint-disable-next-line no-console
            console.error('Failed to create maintenance request', error);
        }
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
                            onNext={() => {
                                handleNext();
                            }}
                            onDiscard={() => navigate('/dashboard')}
                            initialData={isEditMode ? mockInitialData.advancedForm : undefined}
                        />
                    )}

                    {/* Step 2: Property Selection */}
                    {mainStep === 2 && (
                        <PropertyTenantsStep
                            onNext={() => {
                                handleNext();
                            }}
                            onBack={handleBack}
                            initialData={isEditMode ? mockInitialData.propertyStep : undefined}
                        />
                    )}

                    {/* Step 3: Due Date & Materials */}
                    {mainStep === 3 && (
                        <DueDateMaterialsStep
                            onNext={async () => {
                                await handleSubmitRequest();
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
                        propertyName={property.propertyId || 'Property'}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddMaintenanceRequest;
