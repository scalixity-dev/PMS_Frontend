import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserDashboardStore } from "../../../store/userDashboardStore";
import type { AvailabilityOption, ServiceRequest } from "../../../utils/types";
import { categories } from "../constants/requestData";

export const useNewRequestForm = () => {
    const navigate = useNavigate();
    const { addRequest } = useUserDashboardStore();

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
    const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
    const [finalDetail, setFinalDetail] = useState<string | null>(null);

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [location, setLocation] = useState<string>("Gandhi Path Rd, Jaipur, RJ 302020");
    const [authorization, setAuthorization] = useState<string | null>(null);
    const [authCode, setAuthCode] = useState<string>("");
    const [setUpDateTime, setSetUpDateTime] = useState<string | null>(null);
    const [availability, setAvailability] = useState<AvailabilityOption[]>([
        { id: 1, date: "", timeSlots: [] }
    ]);
    const [priority, setPriority] = useState<"Critical" | "Normal" | "Low" | null>(null);
    const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
    const priorityDropdownRef = useRef<HTMLDivElement>(null);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [video, setVideo] = useState<File | null>(null);
    const [pets, setPets] = useState<string[]>([]);
    const attachmentsInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

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

    const handleSubmit = () => {
        if (!selectedCategory || !priority) return;

        const newRequest: ServiceRequest = {
            id: Date.now(),
            requestId: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
            status: "New",
            category: categories.find(c => c.id === selectedCategory)?.name || selectedCategory,
            subCategory: selectedSubCategory || "",
            problem: selectedProblem || "",
            property: "Main Street Apartment",
            priority: priority,
            authorizationToEnter: authorization || "No",
            authorizationCode: authCode,
            setUpDateTime: setUpDateTime || "No",
            availability: availability,
            assignee: "",
            createdAt: new Date().toISOString(),
            attachments: attachments,
            video: video,
            pets: pets,
        };

        addRequest(newRequest);
        navigate("/userdashboard/requests", {
            state: {
                showSuccess: true,
                requestId: newRequest.requestId
            }
        });
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
            if (currentStep === 10 && authorization === "no") {
                setCurrentStep(8);
            } else if (currentStep === 12 && setUpDateTime === "No") {
                setCurrentStep(10);
            } else {
                setCurrentStep(currentStep - 1);
            }
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
    };
};
