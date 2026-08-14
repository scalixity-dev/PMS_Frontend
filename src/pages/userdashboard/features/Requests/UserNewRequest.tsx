import React, { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import MaintenanceStepper from '../../../Dashboard/features/Maintenance/components/MaintenanceStepper';
import MaintenanceSuccessModal from '../../../Dashboard/features/Maintenance/components/MaintenanceSuccessModal';
import AdvancedRequestForm from '../../../Dashboard/features/Maintenance/components/AdvancedRequestForm';
import PropertyTenantsStep from '../../../Dashboard/features/Maintenance/components/PropertyTenantsStep';
import DueDateMaterialsStep from '../../../Dashboard/features/Maintenance/components/DueDateMaterialsStep';
import { useMaintenanceRequestFormStore } from '../../../Dashboard/features/Maintenance/store/maintenanceRequestStore';
import {
    maintenanceRequestService,
    type CreateMaintenanceRequestInput,
    type MaintenanceCategory,
    type MaintenancePriority,
    type UploadCategory,
    type FileType,
} from '../../../../services/maintenance-request.service';
import { useCreateMaintenanceRequest } from '../../../../hooks/useMaintenanceRequestQueries';
import { useGetCurrentUser } from '../../../../hooks/useAuthQueries';
import { useGetLeasesByTenant } from '../../../../hooks/useLeaseQueries';
import { toFriendlyErrorMessage } from '@/utils/errorMessage.utils';

const mapCategory = (category: string): MaintenanceCategory => {
    const normalized = category.toLowerCase();
    if (normalized === 'appliances') return 'APPLIANCES';
    if (normalized === 'electrical') return 'ELECTRICAL';
    if (normalized === 'plumbing') return 'PLUMBING';
    return 'HOUSEHOLD';
};

const mapPriority = (priority: string): MaintenancePriority => {
    const normalized = priority.toLowerCase();
    if (normalized === 'low') return 'LOW';
    if (normalized === 'high') return 'HIGH';
    if (normalized === 'urgent') return 'URGENT';
    return 'MEDIUM';
};

const getUploadCategoryForFile = (file: File): UploadCategory => {
    if (file.type.startsWith('image/')) return 'IMAGE';
    if (file.type.startsWith('video/')) return 'VIDEO';
    return 'DOCUMENT';
};

const steps = [
    { id: 1, label: 'General Details' },
    { id: 2, label: 'Property & Tenants' },
    { id: 3, label: 'Due date & Materials' },
];

const NewRequest: React.FC = () => {
    const navigate = useNavigate();
    const { advanced, property, due, reset } = useMaintenanceRequestFormStore();
    const { mutateAsync: createRequest } = useCreateMaintenanceRequest();
    const { data: currentUser } = useGetCurrentUser();
    const { data: leases = [] } = useGetLeasesByTenant(currentUser?.userId ?? null);

    const [mainStep, setMainStep] = useState(1);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdRequestId, setCreatedRequestId] = useState('');
    const [submitError, setSubmitError] = useState('');

    // Derive property options from tenant's leases as a fallback for PropertyTenantsStep
    const propertyOptions = useMemo(() => {
        const seen = new Map<string, { id: string; name: string; address: string }>();
        const sorted = [...leases].sort((a, b) => {
            if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1;
            if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') return 1;
            return 0;
        });
        for (const lease of sorted) {
            const propId = lease.propertyId;
            if (!propId || seen.has(propId)) continue;
            seen.set(propId, {
                id: propId,
                name: `${lease.property?.propertyName ?? 'Property'}${lease.unit ? ` - ${lease.unit.unitName}` : ''}`,
                address: lease.property?.address
                    ? `${(lease.property.address as any).streetAddress ?? ''}, ${(lease.property.address as any).city ?? ''}`
                    : '',
            });
        }
        return Array.from(seen.values());
    }, [leases]);

    const handleSubmitRequest = async () => {
        setSubmitError('');

        const { advanced, property, due } = useMaintenanceRequestFormStore.getState();

        const missing: string[] = [];
        if (!property.propertyId) missing.push('Property');
        if (!advanced.category) missing.push('Category');
        if (!advanced.subCategory?.trim()) missing.push('Subcategory');
        if (!advanced.title?.trim()) missing.push('Title');

        if (missing.length > 0) {
            setSubmitError(`Please fill required field(s): ${missing.join(', ')}`);
            if (!property.propertyId) setMainStep(2);
            else setMainStep(1);
            return;
        }

        try {
            const matchedLease = leases.find((l) => l.propertyId === property.propertyId);
            const unitId = matchedLease?.unitId ?? undefined;

            // Upload attachments first (without maintenanceRequestId) so tenant permissions
            // are not blocked by the manager-only upload-to-request check on the backend.
            const filesToUpload = advanced.files ?? [];
            const attachmentDtos: { fileUrl: string; fileType: FileType }[] = [];
            if (filesToUpload.length > 0) {
                const uploaded = await Promise.all(
                    filesToUpload.map((file) =>
                        maintenanceRequestService.uploadFile({
                            file,
                            category: getUploadCategoryForFile(file),
                            propertyId: property.propertyId || undefined,
                        }),
                    ),
                );
                uploaded.forEach((result, i) => {
                    const file = filesToUpload[i];
                    const fileType: FileType = file.type.startsWith('video/') ? 'OTHER' : 'IMAGE';
                    attachmentDtos.push({ fileUrl: result.url, fileType });
                });
            }

            const payload: CreateMaintenanceRequestInput = {
                propertyId: property.propertyId,
                unitId,
                category: mapCategory(advanced.category),
                subcategory: advanced.subCategory,
                issue: advanced.issue || undefined,
                subissue: advanced.subIssue || undefined,
                title: advanced.title,
                problemDetails: advanced.details || undefined,
                priority: due.priority ? mapPriority(due.priority) : undefined,
                dueDate: due.dateDue ? due.dateDue.toISOString() : undefined,
                equipmentLinked: property.linkEquipment,
                equipmentId: property.linkEquipment && property.selectedEquipment ? property.selectedEquipment : undefined,
                tenantMeta: {
                    tenantAuthorization: property.tenantAuthorization,
                    accessCode: property.accessCode || undefined,
                    petsInResidence: property.petsInResidence || undefined,
                    selectedPets: property.selectedPets,
                    dateOptions: property.dateOptions.map((option) => ({
                        date: option.date ? option.date.toISOString() : undefined,
                        timeSlots: option.timeSlots,
                    })),
                },
                chargeTo: 'PENDING',
                materials: due.materials.map((m) => ({
                    materialName: m.name,
                    quantity: m.quantity,
                })),
                attachments: attachmentDtos.length > 0 ? attachmentDtos : undefined,
            };

            const created = await createRequest(payload);
            setCreatedRequestId(created.id);
            setShowSuccessModal(true);
            reset();
        } catch (error) {
            setSubmitError(
                toFriendlyErrorMessage(error, 'We could not submit this request. Please try again.'),
            );
        }
    };

    const handleNext = () => setMainStep((prev) => Math.min(prev + 1, 3));
    const handleBack = () => {
        if (mainStep === 1) navigate(-1);
        else setMainStep((prev) => prev - 1);
    };

    return (
        <div className="flex flex-col h-full w-full bg-[var(--color-background)] px-6 overflow-y-auto">
            <div className="flex-1 flex items-start justify-center pt-8">
                <div className="bg-[#DFE5E3] rounded-[2rem] p-6 md:p-12 flex flex-col items-center w-full shadow-sm min-h-[80vh] relative max-w-6xl">

                    <div className="w-full flex items-center mb-4 md:mb-0 md:absolute md:top-8 md:left-8">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-[#3D7475] font-bold hover:opacity-80 transition-opacity uppercase tracking-wide"
                        >
                            <ArrowLeft size={20} strokeWidth={2.5} />
                            Back
                        </button>
                    </div>

                    <div className="w-full mt-8 mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
                            Add Maintenance Request
                        </h1>
                        <MaintenanceStepper currentStep={mainStep} steps={steps} />
                        {submitError && (
                            <p className="mt-4 text-center text-sm text-red-600">{submitError}</p>
                        )}
                    </div>

                    {mainStep === 1 && (
                        <AdvancedRequestForm
                            onNext={() => handleNext()}
                            onDiscard={() => navigate('/userdashboard/requests')}
                            initialData={advanced}
                        />
                    )}

                    {mainStep === 2 && (
                        <PropertyTenantsStep
                            onNext={() => handleNext()}
                            onBack={handleBack}
                            canCreateEquipment={false}
                            properties={propertyOptions}
                            initialData={{
                                selectedProperty: property.propertyId,
                                linkEquipment: property.linkEquipment,
                                selectedEquipment: property.selectedEquipment,
                                tenantAuthorization: property.tenantAuthorization,
                                dateOptions: property.dateOptions,
                                tenantList: property.tenantList,
                                accessCode: property.accessCode,
                                petsInResidence: property.petsInResidence,
                                selectedPets: property.selectedPets,
                            }}
                        />
                    )}

                    {mainStep === 3 && (
                        <DueDateMaterialsStep
                            onNext={async () => {
                                await handleSubmitRequest();
                            }}
                            onBack={handleBack}
                            initialData={{
                                dateInitiated: due.dateInitiated,
                                dateDue: due.dateDue,
                                priority: due.priority,
                                materials: due.materials,
                                chargeTo: due.chargeTo,
                            }}
                        />
                    )}

                    <MaintenanceSuccessModal
                        isOpen={showSuccessModal}
                        onClose={() => setShowSuccessModal(false)}
                        onBackToList={() => navigate('/userdashboard/requests')}
                        onAssignPro={() => navigate('/userdashboard/requests')}
                        requestId={createdRequestId}
                        propertyName={property.propertyId || 'Property'}
                        hidePro
                    />
                </div>
            </div>
        </div>
    );
};

export default NewRequest;
