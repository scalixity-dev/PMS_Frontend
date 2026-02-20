import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRequestStore } from "../store/requestStore";
import type { AvailabilityOption, ServiceRequest } from "../../../utils/types";
import { categories, propertiesList } from "../constants/requestData";
import {
    maintenanceRequestService,
    type CreateMaintenanceRequestInput,
    type MaintenanceCategory,
    type MaintenancePriority,
    type ChargeTo,
} from "../../../../../services/maintenance-request.service";

const CATEGORY_TO_API: Record<string, MaintenanceCategory> = {
    appliances: "APPLIANCES",
    electrical: "ELECTRICAL",
    exterior: "EXTERIOR",
    households: "HOUSEHOLD",
    outdoors: "OUTDOORS",
    plumbing: "PLUMBING",
};

const PRIORITY_TO_API: Record<string, MaintenancePriority> = {
    Critical: "HIGH",
    Normal: "MEDIUM",
    Low: "LOW",
};

export const useNewRequestForm = () => {
    const navigate = useNavigate();
    const { addRequest, newRequestForm, setNewRequestForm, resetNewRequestForm } = useRequestStore();

    const {
        currentStep,
        selectedCategory,
        selectedSubCategory,
        selectedProblem,
        finalDetail,
        selectedEquipment,
        equipmentSerial,
        equipmentCondition,
        title,
        description,
        location,
        property,
        authorization,
        authCode,
        setUpDateTime,
        dateDue,
        materials,
        availability,
        priority,
        attachments,
        video,
        pets,
        amount,
        chargeTo,
        propertyId,
        unitId,
    } = newRequestForm;

    const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
    const priorityDropdownRef = useRef<HTMLDivElement>(null);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const attachmentsInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    // Helpers to update store state
    const setCurrentStep = (step: number) => setNewRequestForm({ currentStep: step });
    const setSelectedCategory = (val: string | null) => setNewRequestForm({ selectedCategory: val });
    const setSelectedSubCategory = (val: string | null) => setNewRequestForm({ selectedSubCategory: val });
    const setSelectedProblem = (val: string | null) => setNewRequestForm({ selectedProblem: val });
    const setFinalDetail = (val: string | null) => setNewRequestForm({ finalDetail: val });
    const setSelectedEquipment = (val: string | null) => setNewRequestForm({ selectedEquipment: val });
    const setEquipmentSerial = (val: string | null) => setNewRequestForm({ equipmentSerial: val });
    const setEquipmentCondition = (val: string | null) => setNewRequestForm({ equipmentCondition: val });
    const setTitle = (val: string) => setNewRequestForm({ title: val });
    const setDescription = (val: string) => setNewRequestForm({ description: val });
    const setLocation = (val: string) => setNewRequestForm({ location: val });
    const setProperty = (val: string) => setNewRequestForm({ property: val });
    const setAuthorization = (val: string | null) => setNewRequestForm({ authorization: val });
    const setAuthCode = (val: string) => setNewRequestForm({ authCode: val });
    const setSetUpDateTime = (val: string | null) => setNewRequestForm({ setUpDateTime: val });
    const setDateDue = (val: string | null) => setNewRequestForm({ dateDue: val });
    const setMaterials = (val: any[]) => setNewRequestForm({ materials: val });
    const setAvailability = (val: AvailabilityOption[]) => setNewRequestForm({ availability: val });
    const setPriority = (val: "Critical" | "Normal" | "Low" | null) => setNewRequestForm({ priority: val });
    const setAttachments = (val: File[]) => setNewRequestForm({ attachments: val });
    const setVideo = (val: File | null) => setNewRequestForm({ video: val });
    const setAmount = (val: string) => setNewRequestForm({ amount: val });
    const setPets = (val: string[] | ((prev: string[]) => string[])) => {
        if (typeof val === 'function') {
            setNewRequestForm({ pets: val(pets) });
        } else {
            setNewRequestForm({ pets: val });
        }
    };
    const setChargeTo = (val: 'LANDLORD' | 'TENANT' | 'PENDING') => setNewRequestForm({ chargeTo: val });
    const setPropertyId = (val: string | undefined) => setNewRequestForm({ propertyId: val });
    const setUnitId = (val: string | undefined) => setNewRequestForm({ unitId: val });

    // Track if form has been modified
    const hasFormData = useMemo(() => {
        return (
            selectedCategory !== null ||
            selectedSubCategory !== null ||
            selectedProblem !== null ||
            finalDetail !== null ||
            title !== "" ||
            description !== "" ||
            authorization !== null ||
            authCode !== "" ||
            setUpDateTime !== null ||
            attachments.length > 0 ||
            video !== null ||
            pets.length > 0 ||
            amount !== "" ||
            priority !== null ||
            availability.some((item: any) => item.date !== "" || item.timeSlots.length > 0)
        );
    }, [
        selectedCategory,
        selectedSubCategory,
        selectedProblem,
        finalDetail,
        title,
        description,
        authorization,
        authCode,
        setUpDateTime,
        attachments.length,
        video,
        pets.length,
        amount,
        priority,
        availability
    ]);

    const handleTogglePet = (pet: string) => {
        setPets((prev) =>
            prev.includes(pet) ? prev.filter(p => p !== pet) : [...prev, pet]
        );
    };

    const handleRemoveAttachment = (indexToRemove: number) => {
        setAttachments(attachments.filter((_, index) => index !== indexToRemove));
        if (attachmentsInputRef.current) {
            attachmentsInputRef.current.value = "";
        }
    };

    const handleRemoveVideo = () => {
        setVideo(null);
        if (videoInputRef.current) {
            videoInputRef.current.value = "";
        }
    };

    const handleAddDate = () => {
        setAvailability([
            ...availability,
            { id: Date.now(), date: "", timeSlots: [] }
        ]);
    };

    const handleRemoveDate = (id: number) => {
        setAvailability(availability.filter((item: any) => item.id !== id));
    };

    const handleDateChange = (id: number, date: string) => {
        setAvailability(availability.map((item: any) =>
            item.id === id ? { ...item, date } : item
        ));
    };

    const handleSlotToggle = (id: number, slot: string) => {
        setAvailability(availability.map((item: any) => {
            if (item.id === id) {
                const slots = item.timeSlots.includes(slot)
                    ? item.timeSlots.filter((s: string) => s !== slot)
                    : [...item.timeSlots, slot];
                return { ...item, timeSlots: slots };
            }
            return item;
        }));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(event.target as Node)) {
                setIsPriorityDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Listen for storage quota exceeded events
    useEffect(() => {
        const handleStorageQuotaExceeded = (event: Event) => {
            const customEvent = event as CustomEvent<{ message: string }>;
            if (customEvent.detail?.message) {
                setSubmissionError(customEvent.detail.message);
            }
        };

        window.addEventListener('storage-quota-exceeded', handleStorageQuotaExceeded);
        return () => window.removeEventListener('storage-quota-exceeded', handleStorageQuotaExceeded);
    }, []);

    const handleSubmit = async (): Promise<boolean> => {
        if (!selectedCategory || !priority) return false;

        setSubmissionError(null);
        setIsSubmitting(true);

        try {
            // API path: when propertyId exists (tenant with lease)
            if (propertyId) {
                const categoryApi = CATEGORY_TO_API[selectedCategory] ?? "HOUSEHOLD";
                const priorityApi = PRIORITY_TO_API[priority] ?? "MEDIUM";

                const uploadAttachment = async (file: File, category: 'IMAGE' | 'VIDEO' | 'DOCUMENT') => {
                    const result = await maintenanceRequestService.uploadFile({
                        file,
                        category,
                        propertyId,
                    });
                    return result.url;
                };

                const attachmentDtos: { fileUrl: string; fileType: 'IMAGE' | 'OTHER' }[] = [];
                if (attachments?.length) {
                    for (const file of attachments) {
                        const fileUrl = await uploadAttachment(file, 'IMAGE');
                        attachmentDtos.push({ fileUrl, fileType: 'IMAGE' });
                    }
                }
                if (video) {
                    const fileUrl = await uploadAttachment(video, 'VIDEO');
                    attachmentDtos.push({ fileUrl, fileType: 'OTHER' });
                }

                const chargeToApi: ChargeTo = chargeTo === 'TENANT' ? 'TENANT' : chargeTo === 'PENDING' ? 'PENDING' : 'LANDLORD';

                const apiPayload: CreateMaintenanceRequestInput = {
                    propertyId,
                    unitId: unitId ?? undefined,
                    category: categoryApi,
                    subcategory: selectedSubCategory || title,
                    issue: selectedProblem ?? undefined,
                    subissue: finalDetail ?? undefined,
                    title: title || `${categories.find(c => c.id === selectedCategory)?.name || selectedCategory} - ${selectedSubCategory || 'Request'}`,
                    problemDetails: description || undefined,
                    priority: priorityApi,
                    dueDate: dateDue ?? undefined,
                    equipmentLinked: !!selectedEquipment,
                    equipmentId: selectedEquipment ?? undefined,
                    tenantMeta: {
                        tenantAuthorization: authorization === 'yes',
                        accessCode: authCode || undefined,
                        petsInResidence: pets.length > 0 ? 'yes' : 'no',
                        selectedPets: pets,
                        dateOptions: availability
                            .filter((a: { date?: string; timeSlots?: string[] }) => a.date)
                            .map((a: { date?: string; timeSlots?: string[] }) => ({
                                date: a.date,
                                timeSlots: a.timeSlots || [],
                            })),
                    },
                    materials: materials
                        ?.filter((m: { name?: string }) => m.name)
                        .map((m: { name: string; quantity?: number }) => ({
                            materialName: m.name,
                            quantity: m.quantity ?? 1,
                        })),
                    chargeTo: chargeToApi,
                    attachments: attachmentDtos.length > 0 ? attachmentDtos : undefined,
                };

                const created = await maintenanceRequestService.create(apiPayload);
                resetNewRequestForm();
                setIsSubmitting(false);
                navigate("/userdashboard/requests", {
                    state: { showSuccess: true, requestId: created.id }
                });
                return true;
            }

            // Fallback: store in Zustand + localStorage
            const convertFileToDataURL = (file: File): Promise<string> => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => (reader.result ? resolve(reader.result as string) : reject(new Error(`Failed to read file: ${file.name}`)));
                    reader.onerror = () => reject(new Error(`Error reading file: ${file.name}`));
                    reader.readAsDataURL(file);
                });
            };

            const attachmentDataUrls: string[] = [];
            if (attachments?.length) {
                const dataUrls = await Promise.all(attachments.map(convertFileToDataURL));
                attachmentDataUrls.push(...dataUrls);
            }
            let videoDataUrl: string | null = null;
            if (video) videoDataUrl = await convertFileToDataURL(video);

            const newRequest: ServiceRequest & { attachmentDataUrls?: string[]; videoDataUrl?: string | null } = {
                id: Date.now(),
                requestId: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
                status: "New",
                title: title,
                category: categories.find(c => c.id === selectedCategory)?.name || selectedCategory,
                subCategory: selectedSubCategory || "",
                problem: selectedProblem || "",
                subIssue: finalDetail || "",
                description: description || "",
                property: propertiesList.find(p => p.id === property)?.name || "Main Street Apartment",
                equipment: selectedEquipment,
                equipmentSerial: equipmentSerial,
                equipmentCondition: equipmentCondition || 'Good',
                priority: priority,
                authorizationToEnter: authorization ? (authorization === "yes" ? "Yes" : "No") : "No",
                authorizationCode: authCode,
                setUpDateTime: setUpDateTime || "No",
                dateDue: dateDue,
                materials: materials,
                availability: availability,
                assignee: "",
                createdAt: new Date().toISOString(),
                attachments: attachments,
                video: video,
                pets: pets,
                amount: amount ? parseFloat(amount) : undefined,
                attachmentDataUrls: attachmentDataUrls.length > 0 ? attachmentDataUrls : undefined,
                videoDataUrl: videoDataUrl,
            };

            addRequest(newRequest);
            resetNewRequestForm();
            setIsSubmitting(false);
            navigate("/userdashboard/requests", { state: { showSuccess: true, requestId: newRequest.requestId } });
            return true;
        } catch (error) {
            const errorMessage = `Failed to submit request: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`;
            setSubmissionError(errorMessage);
            setIsSubmitting(false);
            return false;
        }
    };

    const nextStep = (step?: number) => {
        if (step) {
            setCurrentStep(step);
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate(-1);
        }
    };

    return {
        currentStep,
        setCurrentStep,
        selectedCategory,
        setSelectedCategory,
        selectedSubCategory,
        setSelectedSubCategory,
        selectedProblem,
        setSelectedProblem,
        finalDetail,
        setFinalDetail,
        selectedEquipment,
        setSelectedEquipment,
        title,
        setTitle,
        description,
        setDescription,
        location,
        setLocation,
        authorization,
        setAuthorization,
        authCode,
        setAuthCode,
        setUpDateTime,
        setSetUpDateTime,
        dateDue,
        setDateDue,
        materials,
        setMaterials,
        availability,
        setAvailability,
        priority,
        setPriority,
        isPriorityDropdownOpen,
        setIsPriorityDropdownOpen,
        priorityDropdownRef,
        attachments,
        setAttachments,
        video,
        setVideo,
        pets,
        setPets,
        amount,
        setAmount,
        submissionError,
        setSubmissionError,
        isSubmitting,
        attachmentsInputRef,
        videoInputRef,
        handleTogglePet,
        handleRemoveAttachment,
        handleRemoveVideo,
        handleAddDate,
        handleRemoveDate,
        handleDateChange,
        handleSlotToggle,
        handleSubmit,
        nextStep,
        prevStep,
        hasFormData,
        property,
        setProperty,
        equipmentSerial,
        setEquipmentSerial,
        equipmentCondition,
        setEquipmentCondition,
        chargeTo,
        setChargeTo,
        propertyId,
        setPropertyId,
        unitId,
        setUnitId,
    };
};
