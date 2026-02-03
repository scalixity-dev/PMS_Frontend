import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRequestStore } from "../store/requestStore";
import type { AvailabilityOption, ServiceRequest } from "../../../utils/types";
import { categories, propertiesList } from "../constants/requestData";

export const useNewRequestForm = () => {
    const navigate = useNavigate();
    const { addRequest } = useRequestStore();

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
    const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
    const [finalDetail, setFinalDetail] = useState<string | null>(null);
    const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [location, setLocation] = useState<string>("Gandhi Path Rd, Jaipur, RJ 302020");
    const [property, setProperty] = useState<string>("1"); // Default to first property
    const [authorization, setAuthorization] = useState<string | null>(null);
    const [authCode, setAuthCode] = useState<string>("");
    const [setUpDateTime, setSetUpDateTime] = useState<string | null>(null);
    const [dateDue, setDateDue] = useState<string | null>(null);
    const [materials, setMaterials] = useState<any[]>([]);
    const [availability, setAvailability] = useState<AvailabilityOption[]>([
        { id: 1, date: "", timeSlots: [] }
    ]);
    const [priority, setPriority] = useState<"Critical" | "Normal" | "Low" | null>(null);
    const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
    const priorityDropdownRef = useRef<HTMLDivElement>(null);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [video, setVideo] = useState<File | null>(null);
    const [pets, setPets] = useState<string[]>([]);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const attachmentsInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

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
            priority !== null ||
            availability.some(item => item.date !== "" || item.timeSlots.length > 0)
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
        priority,
        availability
    ]);

    const handleTogglePet = (pet: string) => {
        setPets((prev) =>
            prev.includes(pet) ? prev.filter(p => p !== pet) : [...prev, pet]
        );
    };

    const handleRemoveAttachment = (indexToRemove: number) => {
        setAttachments((prev) => prev.filter((_, index) => index !== indexToRemove));
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
        setAvailability(availability.filter(item => item.id !== id));
    };

    const handleDateChange = (id: number, date: string) => {
        setAvailability(availability.map(item =>
            item.id === id ? { ...item, date } : item
        ));
    };

    const handleSlotToggle = (id: number, slot: string) => {
        setAvailability(availability.map(item => {
            if (item.id === id) {
                const slots = item.timeSlots.includes(slot)
                    ? item.timeSlots.filter(s => s !== slot)
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
                // Store data URLs separately for persistence
                attachmentDataUrls: attachmentDataUrls.length > 0 ? attachmentDataUrls : undefined,
                videoDataUrl: videoDataUrl,
            };

            addRequest(newRequest);
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
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
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
    };
};
