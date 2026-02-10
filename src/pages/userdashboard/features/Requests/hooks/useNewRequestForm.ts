import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRequestStore } from "../store/requestStore";
import type { AvailabilityOption, ServiceRequest } from "../../../utils/types";
import { categories, propertiesList } from "../constants/requestData";

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

        // Clear any previous errors and set submitting state
        setSubmissionError(null);
        setIsSubmitting(true);

        try {
            // Convert File objects to data URLs for persistence
            const convertFileToDataURL = (file: File): Promise<string> => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (reader.result) {
                            resolve(reader.result as string);
                        } else {
                            reject(new Error(`Failed to read file: ${file.name}`));
                        }
                    };
                    reader.onerror = () => reject(new Error(`Error reading file: ${file.name}`));
                    reader.readAsDataURL(file);
                });
            };

            // Convert attachments to data URLs
            const attachmentDataUrls: string[] = [];
            if (attachments && attachments.length > 0) {
                try {
                    const dataUrlPromises = attachments.map(file => convertFileToDataURL(file));
                    const dataUrls = await Promise.all(dataUrlPromises);
                    attachmentDataUrls.push(...dataUrls);
                } catch (error) {
                    const errorMessage = `Failed to process attachments: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or remove the problematic files.`;
                    console.error('Error converting attachments to data URLs:', error);
                    setSubmissionError(errorMessage);
                    setIsSubmitting(false);
                    return false; // Prevent form submission
                }
            }

            // Convert video to data URL
            let videoDataUrl: string | null = null;
            if (video) {
                try {
                    videoDataUrl = await convertFileToDataURL(video);
                } catch (error) {
                    const errorMessage = `Failed to process video: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or remove the video.`;
                    console.error('Error converting video to data URL:', error);
                    setSubmissionError(errorMessage);
                    setIsSubmitting(false);
                    return false; // Prevent form submission
                }
            }

            // Create request - we'll store data URLs in a way that works with the store
            // The store will handle converting these properly
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
                // Store data URLs separately for persistence
                attachmentDataUrls: attachmentDataUrls.length > 0 ? attachmentDataUrls : undefined,
                videoDataUrl: videoDataUrl,
            };

            addRequest(newRequest);
            resetNewRequestForm(); // Clear the form on success
            setIsSubmitting(false);
            navigate("/userdashboard/requests", {
                state: {
                    showSuccess: true,
                    requestId: newRequest.requestId
                }
            });
            return true;
        } catch (error) {
            // Catch any unexpected errors during submission
            const errorMessage = `Failed to submit request: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`;
            console.error('Unexpected error during request submission:', error);
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
    };
};
