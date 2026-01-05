import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import GetStartedButton from '../../../../components/common/buttons/GetStartedButton';
import MaintenanceStepper from './components/MaintenanceStepper';
import CategorySelection from './steps/CategorySelection';
import SubCategorySelection from './steps/SubCategorySelection';
import IssueDefinition from './steps/IssueDefinition';
import FinalDetails from './steps/FinalDetails';
import MediaUpload from './steps/MediaUpload';
import IssueDescription from './steps/IssueDescription';
import PropertySelection from './steps/MaintanancePropertySelection';
import CreatePropertyForm from './components/CreatePropertyForm';
import PrioritySelection from './steps/PrioritySelection';
import MaintenanceSuccessModal from './components/MaintenanceSuccessModal';
import AdvancedRequestForm from './components/AdvancedRequestForm';
import PropertyTenantsStep from './components/PropertyTenantsStep';
import DueDateMaterialsStep from './components/DueDateMaterialsStep';
import propertyImage from '../../../../assets/images/property.jpg';

interface RequestTypeCardProps {
    type: 'basic' | 'advanced';
    selected: boolean;
    onClick: () => void;
}

const RequestTypeCard: React.FC<RequestTypeCardProps> = ({ type, selected, onClick }) => {
    const isBasic = type === 'basic';
    const title = isBasic ? 'Basic request' : 'Advanced request';
    const description = isBasic
        ? 'Add the most basic information about the issue like category, description of the request and photos/video. You can always edit it later.'
        : 'Add the most basic information about the issue like category, description of the request and photos/video. You can always edit it later.';

    return (
        <div
            onClick={onClick}
            className={`
        relative flex flex-col items-start p-6 md:p-8 rounded-[2rem] cursor-pointer transition-all duration-300 w-full md:w-80 h-full
        ${selected
                    ? 'bg-[#F0F2F5] border-2 border-[#7BD747] shadow-none ring-1 ring-[#7BD747]/50'
                    : 'bg-white shadow-md border-2 border-transparent hover:shadow-lg hover:-translate-y-1'
                }
      `}
        >
            {/* Pill Badge */}
            <div className={`
        flex items-center gap-2 px-4 py-1.5 rounded-full mb-6
        ${selected ? 'bg-[#7BD747] text-white' : 'bg-[#7BD747] text-white'}
      `}>
                <div className={`
          w-3 h-3 rounded-full border-[1.5px] border-white flex items-center justify-center
        `}>
                    {selected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className="font-bold text-sm md:text-base">{title}</span>
            </div>

            {/* Description */}
            <p className="text-left text-gray-500 text-sm leading-relaxed">
                {description}
            </p>
        </div>
    );
};

const AddMaintenanceRequest: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isEditMode = location.state?.editMode;


    const targetSection = location.state?.targetSection;

    // Flow State
    const [mainStep, setMainStep] = useState(
        isEditMode
            ? (targetSection === 'materials' ? 3 : 1)
            : 0
    );
    const [generalSubStep, setGeneralSubStep] = useState(1);

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

    const [selectedType, setSelectedType] = useState<'basic' | 'advanced' | null>(isEditMode ? 'advanced' : null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
    const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
    const [selectedFinalDetail, setSelectedFinalDetail] = useState<string | null>(null);
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [issueTitle, setIssueTitle] = useState('');
    const [issueDescription, setIssueDescription] = useState('');
    const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
    const [isCreatingProperty, setIsCreatingProperty] = useState(false);
    const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdRequestId, setCreatedRequestId] = useState<string>('');

    const [propertiesList, setPropertiesList] = useState([
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

    const handleCreateProperty = (propertyData: any) => {
        const newProperty = {
            id: (propertiesList.length + 1).toString(),
            name: propertyData.address || 'New Property',
            unit: propertyData.unitType || 'Unit',
            address: propertyData.address || '',
            price: parseFloat(propertyData.marketRent) || 0,
            bedrooms: 0,
            bathrooms: 0,
            image: propertyImage
        };
        setPropertiesList([...propertiesList, newProperty]);
        setSelectedProperty(newProperty.id);
        setIsCreatingProperty(false);
    };

    const handleSubmitRequest = () => {
        const newRequestId = Math.floor(100000 + Math.random() * 900000).toString();
        setCreatedRequestId(newRequestId);

        console.log('Submitting Request:', {
            id: newRequestId,
            type: selectedType,
            category: selectedCategory,
            subCategory: selectedSubCategory,
            issue: selectedIssue,
            finalDetail: selectedFinalDetail,
            media: mediaFiles,
            title: issueTitle,
            description: issueDescription,
            property: selectedProperty,
            priority: selectedPriority
        });

        setShowSuccessModal(true);
    };

    const handleNext = () => {
        if (mainStep === 0 && selectedType) {
            setMainStep(1);
            setGeneralSubStep(1);
        } else if (mainStep === 1) {
            if (selectedType === 'advanced') {
                // For advanced flow, step 1 is a single form, so go to step 2
                setMainStep(2);
            } else {
                // Basic flow logic
                if (generalSubStep === 1 && selectedCategory) {
                    setGeneralSubStep(2);
                } else if (generalSubStep === 2) {
                    setGeneralSubStep(3);
                } else if (generalSubStep === 3) {
                    setGeneralSubStep(4);
                } else if (generalSubStep === 4) {
                    setGeneralSubStep(5);
                } else if (generalSubStep === 5) {
                    setGeneralSubStep(6);
                } else if (generalSubStep === 6) {
                    // Proceed to Property Step
                    setMainStep(2);
                }
            }
        } else if (mainStep === 2) {
            if (selectedType === 'advanced' || selectedProperty) {
                setMainStep(3);
            }
        }
    };

    const handleSkip = () => {
        if (mainStep === 1) {
            if (generalSubStep === 2) {
                // Skip sub-category and go to Issue Definition
                setSelectedSubCategory(null);
                setGeneralSubStep(3);
            } else if (generalSubStep === 3) {
                // Skip issue definition and go to Final Details
                setSelectedIssue(null);
                setGeneralSubStep(4);
            } else if (generalSubStep === 4) {
                // Skip final details and go to Media Upload
                setSelectedFinalDetail(null);
                setGeneralSubStep(5);
            } else if (generalSubStep === 5) {
                // Skip media upload and go to Issue Description
                setMediaFiles([]);
                setGeneralSubStep(6);
            }
        }
    };

    const handleBack = () => {
        if (mainStep === 0) {
            navigate('/dashboard');
        } else if (mainStep === 1) {
            if (generalSubStep === 1) {
                setMainStep(0);
            } else if (generalSubStep === 2) {
                setGeneralSubStep(1);
            } else if (generalSubStep === 3) {
                setGeneralSubStep(2);
            } else if (generalSubStep === 4) {
                setGeneralSubStep(3);
            } else if (generalSubStep === 5) {
                setGeneralSubStep(4);
            } else if (generalSubStep === 6) {
                setGeneralSubStep(5);
            }
        } else if (mainStep === 2) {
            setMainStep(1);
            setGeneralSubStep(6); // Go back to issue description
        } else {
            setMainStep(prev => prev - 1);
        }
    };

    // Helper to determine stepper current step
    const getStepperStep = () => {
        if (mainStep === 0) return 0;
        return mainStep;
    };

    return (
        <div className="flex flex-col h-full w-full bg-[var(--color-background)] px-6 overflow-y-auto">
            <div className="flex-1 flex items-start justify-center pt-8">
                <div className={`bg-[#DFE5E3] rounded-[2rem] p-6 md:p-12 flex flex-col items-center w-full shadow-sm min-h-[80vh] relative ${selectedType === 'advanced' && mainStep >= 1 ? 'max-w-6xl' : 'max-w-3xl'}`}>

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

                    {/* Stepper (Only show for Main Step 1+) */}
                    {mainStep >= 1 && (
                        <div className="w-full mt-8 mb-6">
                            <MaintenanceStepper
                                currentStep={getStepperStep()}
                                steps={selectedType === 'advanced' ? advancedSteps : undefined}
                            />
                        </div>
                    )}

                    {/* Step 0: Request Type Selection */}
                    {mainStep === 0 && (
                        <div className="flex flex-col items-center w-full mt-8">
                            <div className="text-center mb-8 md:mb-10 max-w-lg">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Maintenance request</h1>
                                <p className="text-gray-500 text-sm md:text-base">Select the request type to get started.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 w-full max-w-2xl">
                                <RequestTypeCard
                                    type="basic"
                                    selected={selectedType === 'basic'}
                                    onClick={() => setSelectedType('basic')}
                                />
                                <RequestTypeCard
                                    type="advanced"
                                    selected={selectedType === 'advanced'}
                                    onClick={() => setSelectedType('advanced')}
                                />
                            </div>

                            <GetStartedButton
                                text="Get Started"
                                widthClass="w-auto px-12"
                                onClick={handleNext}
                                disabled={!selectedType}
                            />
                        </div>
                    )}

                    {/* Step 1: General Details */}
                    {mainStep === 1 && (
                        selectedType === 'advanced' ? (
                            <AdvancedRequestForm
                                onNext={(data) => {
                                    console.log('Advanced Data:', data);
                                    handleNext();
                                }}
                                onDiscard={() => navigate('/dashboard')}
                                initialData={isEditMode ? mockInitialData.advancedForm : undefined}
                            />
                        ) : (
                            <div className="flex flex-col items-center w-full">
                                {generalSubStep === 1 && (
                                    <CategorySelection
                                        selectedCategory={selectedCategory}
                                        onSelect={(cat) => {
                                            setSelectedCategory(cat);
                                            handleNext();
                                        }}
                                    />
                                )}
                                {generalSubStep === 2 && (
                                    <SubCategorySelection
                                        category={selectedCategory || ''}
                                        selectedSubCategory={selectedSubCategory}
                                        onSelect={(sub) => {
                                            setSelectedSubCategory(sub);
                                            handleNext();
                                        }}
                                    />
                                )}
                                {generalSubStep === 3 && (
                                    <IssueDefinition
                                        subCategory={selectedSubCategory || ''}
                                        selectedIssue={selectedIssue}
                                        onSelect={(issue) => {
                                            setSelectedIssue(issue);
                                            handleNext();
                                        }}
                                    />
                                )}
                                {generalSubStep === 4 && (
                                    <FinalDetails
                                        issue={selectedIssue || ''}
                                        selectedDetail={selectedFinalDetail}
                                        onSelect={(detail) => {
                                            setSelectedFinalDetail(detail);
                                            handleNext();
                                        }}
                                    />
                                )}
                                {generalSubStep === 5 && (
                                    <MediaUpload
                                        onFileSelect={(file) => {
                                            setMediaFiles([...mediaFiles, file]);
                                            handleNext();
                                        }}
                                    />
                                )}
                                {generalSubStep === 6 && (
                                    <IssueDescription
                                        defaultTitle={issueTitle}
                                        onContinue={(title, desc) => {
                                            setIssueTitle(title);
                                            setIssueDescription(desc);
                                            handleNext();
                                        }}
                                    />
                                )}

                                {/* Skip Button for relevant sub-steps */}
                                {[2, 3, 4, 5].includes(generalSubStep) && (
                                    <button
                                        onClick={handleSkip}
                                        className="mt-8 text-gray-500 hover:text-gray-700 font-medium underline underline-offset-4"
                                    >
                                        Skip this step
                                    </button>
                                )}
                            </div>
                        )
                    )}

                    {/* Step 2: Property Selection */}
                    {mainStep === 2 && (
                        selectedType === 'advanced' ? (
                            <PropertyTenantsStep
                                onNext={handleNext}
                                onBack={handleBack}
                                properties={propertiesList}
                                initialData={isEditMode ? mockInitialData.propertyStep : undefined}
                            />
                        ) : (
                            // ... basic flow (unchanged)
                            isCreatingProperty ? (
                                <CreatePropertyForm
                                    onCancel={() => setIsCreatingProperty(false)}
                                    onCreate={handleCreateProperty}
                                />
                            ) : (
                                <PropertySelection
                                    selectedProperty={selectedProperty}
                                    onSelect={setSelectedProperty}
                                    properties={propertiesList}
                                    onNext={handleNext}
                                    onCreateProperty={() => setIsCreatingProperty(true)}
                                />
                            )
                        )
                    )}

                    {/* Step 3: Due Date & Materials (Advanced) OR Priority (Basic) */}
                    {mainStep === 3 && (
                        selectedType === 'advanced' ? (
                            <DueDateMaterialsStep
                                onNext={(data) => {
                                    console.log('Due Date Data:', data);
                                    handleSubmitRequest();
                                }}
                                onBack={handleBack}
                                initialData={isEditMode ? mockInitialData.dueDateStep : undefined}
                            />
                        ) : (
                            <PrioritySelection
                                selectedPriority={selectedPriority}
                                onSelect={setSelectedPriority}
                                onSubmit={handleSubmitRequest}
                            />
                        )
                    )}

                    <MaintenanceSuccessModal
                        isOpen={showSuccessModal}
                        onClose={() => setShowSuccessModal(false)}
                        onBackToList={() => navigate('/dashboard')}
                        onAssignPro={() => {
                            console.log('Assign Service Pro clicked');
                            navigate('/dashboard'); // Or navigate to assign pro page
                        }}
                        requestId={createdRequestId}
                        propertyName={propertiesList.find(p => p.id === selectedProperty)?.name || 'Property'}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddMaintenanceRequest;
