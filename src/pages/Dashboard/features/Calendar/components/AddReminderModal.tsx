import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import DatePicker from '../../../../../components/ui/DatePicker';
import TimePicker from '../../../../../components/ui/TimePicker';
import CustomDropdown from '../../../components/CustomDropdown';
import { useReminderStore } from '../store/reminderStore';
import { useCreateReminder, useUpdateReminder } from '../../../../../hooks/useReminderQueries';
import { useGetAllProperties } from '../../../../../hooks/usePropertyQueries';
import { type Reminder } from '../Calendar';

interface AddReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (data: any) => void; // Optional now since we handle API calls internally
    editReminder?: Reminder | null; // Reminder to edit (null for add mode)
    mode?: 'add' | 'edit'; // Mode of the modal
}

const AddReminderModal: React.FC<AddReminderModalProps> = ({ isOpen, onClose, onSave, editReminder, mode = 'add' }) => {
    const { formData, setFormData, updateFormData, resetForm } = useReminderStore();
    const createReminderMutation = useCreateReminder();
    const updateReminderMutation = useUpdateReminder();
    const isEditMode = mode === 'edit' && editReminder !== null && editReminder !== undefined;

    // Fetch properties for dropdown
    const { data: properties = [], isLoading: isLoadingProperties } = useGetAllProperties();

    const [showExitConfirmation, setShowExitConfirmation] = React.useState(false);
    const [formErrors, setFormErrors] = React.useState({ title: false, date: false, time: false });
    const [initialSnapshot, setInitialSnapshot] = React.useState(formData);
    const prevIsOpenRef = React.useRef(isOpen);

    useEffect(() => {
        // Only run when modal opens
        const isOpening = !prevIsOpenRef.current && isOpen;

        if (isOpen && isOpening) {
            if (isEditMode && editReminder) {
                // Pre-fill form with existing reminder data for edit mode
                const editFormData = {
                    title: editReminder.title || '',
                    details: editReminder.details || '',
                    date: editReminder.date ? new Date(editReminder.date) : undefined,
                    time: editReminder.time || '',
                    assignee: editReminder.assigneeName || '',
                    property: editReminder.propertyId || '',
                    isRecurring: false,
                    frequency: '',
                    endDate: undefined,
                    type: (editReminder.type === 'maintenance' ? 'reminder' : (editReminder.type || 'reminder')) as 'reminder' | 'viewing' | 'meeting' | 'other',
                    color: undefined,
                };
                setFormData(editFormData);
                setInitialSnapshot(editFormData);
            } else {
                // Reset form when opening in add mode
                const emptyFormData = {
                    title: '',
                    details: '',
                    date: undefined,
                    time: '',
                    assignee: '',
                    property: '',
                    isRecurring: false,
                    frequency: '',
                    endDate: undefined,
                    type: 'reminder' as const,
                    color: undefined,
                };
                setFormData(emptyFormData);
                setInitialSnapshot(emptyFormData);
            }
        }

        // Update ref
        prevIsOpenRef.current = isOpen;
    }, [isOpen, setFormData, isEditMode, editReminder]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Property options from API
    const propertyOptions = useMemo(() => {
        return properties.map(p => ({
            value: p.id,
            label: p.propertyName
        }));
    }, [properties]);

    const typeOptions = [
        { value: 'reminder', label: 'Reminder' },
        { value: 'viewing', label: 'Viewing' },
        { value: 'meeting', label: 'Meeting' },
        { value: 'other', label: 'Other' },
    ];

    const frequencyOptions = [
        { value: 'DAILY', label: 'Daily' },
        { value: 'WEEKLY', label: 'Weekly' },
        { value: 'MONTHLY', label: 'Monthly' },
        { value: 'QUARTERLY', label: 'Quarterly' },
        { value: 'YEARLY', label: 'Yearly' },
        { value: 'ONCE', label: 'Once' },
    ];

    const handleSubmit = async () => {
        // Validate required fields
        const errors = {
            title: !formData.title.trim(),
            date: !formData.date,
            time: !formData.time.trim()
        };

        setFormErrors(errors);

        // Prevent submission if any required field is invalid
        if (errors.title || errors.date || errors.time) {
            return;
        }

        try {
            // Transform form data to API format
            const reminderDto = {
                title: formData.title,
                description: formData.details || undefined,
                date: formData.date ? formData.date.toISOString() : '',
                time: formData.time,
                type: formData.type,
                assignee: formData.assignee || undefined,
                propertyId: formData.property || undefined,
                recurring: formData.isRecurring,
                frequency: formData.frequency ? (formData.frequency.toUpperCase() as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'ONCE') : undefined,
                endDate: formData.endDate ? formData.endDate.toISOString() : undefined,
                color: formData.color || undefined,
            };

            if (isEditMode && editReminder) {
                // Update existing reminder
                await updateReminderMutation.mutateAsync({
                    id: editReminder.id,
                    updateData: reminderDto,
                });
            } else {
                // Create new reminder
                await createReminderMutation.mutateAsync(reminderDto);
            }

            // Call optional onSave callback if provided
            if (onSave) {
                onSave(formData);
            }

            // Reset form and close modal
            resetForm();
            onClose();
        } catch (error) {
            console.error(isEditMode ? 'Failed to update reminder:' : 'Failed to create reminder:', error);
            // Error handling could show a toast notification here
        }
    };

    const handleCloseAttempt = () => {
        // Check if any field differs from initial snapshot (form is dirty)
        const isDirty =
            formData.title !== initialSnapshot.title ||
            formData.details !== initialSnapshot.details ||
            formData.date !== initialSnapshot.date ||
            formData.time !== initialSnapshot.time ||
            formData.assignee !== initialSnapshot.assignee ||
            formData.property !== initialSnapshot.property ||
            formData.isRecurring !== initialSnapshot.isRecurring ||
            formData.frequency !== initialSnapshot.frequency ||
            formData.endDate !== initialSnapshot.endDate ||
            formData.type !== initialSnapshot.type;

        if (isDirty) {
            setShowExitConfirmation(true);
        } else {
            onClose();
        }
    };

    const isLoading = createReminderMutation.isPending || updateReminderMutation.isPending;

    if (!isOpen) return null;

    const handleConfirmExit = () => {
        setShowExitConfirmation(false);
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 animate-in fade-in duration-200 font-['Urbanist'] p-4">
            <div className="bg-[#E8ECEB] rounded-3xl w-full max-w-sm shadow-2xl animate-slide-in-from-right relative flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#3D7475] p-4 flex items-center justify-between rounded-t-3xl flex-shrink-0">
                    <h2 className="text-lg font-medium text-white">{isEditMode ? 'Edit reminder' : 'Add reminder'}</h2>
                    <button onClick={handleCloseAttempt} className="text-white hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3 overflow-y-auto flex-1">

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => updateFormData('title', e.target.value)}
                            placeholder="Enter Title"
                            disabled={isLoading}
                            className={`w-full bg-white text-gray-800 placeholder-gray-400 px-3 py-2.5 rounded-md outline-none focus:ring-2 transition-all shadow-sm text-sm ${formErrors.title ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-[#3D7475]/20'
                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                        {formErrors.title && <p className="text-red-500 text-xs mt-1">Title is required</p>}
                    </div>

                    {/* Details */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Details</label>
                        <textarea
                            value={formData.details}
                            onChange={(e) => updateFormData('details', e.target.value)}
                            placeholder="Enter Details"
                            rows={2}
                            disabled={isLoading}
                            className={`w-full bg-[#F0F2F5] text-gray-800 placeholder-gray-400 px-3 py-2.5 rounded-md outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all resize-none shadow-sm text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    {/* Date & Time */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Date & Time *</label>
                        <div className="flex gap-2">
                            <div className="w-2/3">
                                <DatePicker
                                    value={formData.date}
                                    onChange={(date) => updateFormData('date', date)}
                                    placeholder="Select Date"
                                    disabled={isLoading}
                                    className={formErrors.date ? 'ring-2 ring-red-500' : ''}
                                />
                            </div>
                            <div className="w-1/3">
                                <div className={isLoading ? 'opacity-50 pointer-events-none' : ''}>
                                    <TimePicker
                                        value={formData.time}
                                        onChange={(time) => updateFormData('time', time)}
                                        placeholder="Time"
                                        disabled={!formData.date || isLoading}
                                        className={formErrors.time ? 'ring-2 ring-red-500' : ''}
                                    />
                                </div>
                            </div>
                        </div>
                        {(formErrors.date || formErrors.time) && (
                            <p className="text-red-500 text-xs mt-1">
                                {formErrors.date && formErrors.time ? 'Date and time are required' : formErrors.date ? 'Date is required' : 'Time is required'}
                            </p>
                        )}
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Type *</label>
                        <CustomDropdown
                            value={formData.type}
                            onChange={(value) => updateFormData('type', value as 'reminder' | 'viewing' | 'meeting' | 'other')}
                            options={typeOptions}
                            placeholder="Select Type"
                            disabled={isLoading}
                            buttonClassName={`w-full bg-white text-gray-800 px-3 py-2.5 rounded-md outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all shadow-sm text-sm border-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    {/* Assignee */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Assignee</label>
                        <input
                            type="text"
                            value={formData.assignee}
                            onChange={(e) => updateFormData('assignee', e.target.value)}
                            placeholder="Enter assignee name"
                            disabled={isLoading}
                            className={`w-full bg-white text-gray-800 placeholder-gray-400 px-3 py-2.5 rounded-md outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all shadow-sm text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    {/* Property */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Property</label>
                        {isLoadingProperties ? (
                            <div className="w-full bg-white px-3 py-2.5 rounded-md flex items-center justify-center">
                                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <CustomDropdown
                                value={formData.property}
                                onChange={(value) => updateFormData('property', value)}
                                options={propertyOptions}
                                placeholder="Select Property"
                                disabled={isLoading}
                                buttonClassName={`w-full bg-white text-gray-800 px-3 py-2.5 rounded-md outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all shadow-sm text-sm border-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        )}
                    </div>

                    {/* Recurring Toggle */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => updateFormData('isRecurring', !formData.isRecurring)}
                            disabled={isLoading}
                            className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${formData.isRecurring ? 'bg-[#84CC16]' : 'bg-gray-300'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${formData.isRecurring ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <span className="text-xs font-medium text-gray-700">Recurring</span>
                    </div>

                    {/* Frequency */}
                    {formData.isRecurring && (
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Frequency</label>
                            <CustomDropdown
                                value={formData.frequency}
                                onChange={(value) => updateFormData('frequency', value)}
                                options={frequencyOptions}
                                placeholder="Select Frequency"
                                disabled={isLoading}
                                buttonClassName={`w-full bg-white text-gray-800 px-3 py-2.5 rounded-md outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all shadow-sm text-sm border-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    )}

                    {/* End Date */}
                    {formData.isRecurring && (
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">End Date</label>
                            <DatePicker
                                value={formData.endDate}
                                onChange={(date) => updateFormData('endDate', date)}
                                placeholder="Select End Date"
                                disabled={isLoading}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 pt-2 flex gap-3 flex-shrink-0">
                    <button
                        onClick={handleCloseAttempt}
                        disabled={isLoading}
                        className={`flex-1 bg-white text-gray-800 py-2.5 rounded-md font-bold hover:bg-gray-50 transition-colors shadow-md border border-gray-100 text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`flex-1 bg-[#3D7475] text-white py-2.5 rounded-md font-bold hover:bg-[#2c5556] transition-colors shadow-md text-sm flex items-center justify-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {isEditMode ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            isEditMode ? 'Update' : 'Create'
                        )}
                    </button>
                </div>

                {/* Exit Confirmation Overlay */}
                {showExitConfirmation && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px] animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl w-[90%] max-w-sm overflow-hidden shadow-2xl animate-slide-in-from-right">
                            <div className="bg-[#3D7475] p-4 flex items-center justify-between text-white">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle size={20} className="stroke-2" />
                                    <span className="font-semibold">Discard Changes?</span>
                                </div>
                                <button onClick={() => setShowExitConfirmation(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 text-center">
                                <p className="text-gray-700 mb-6">
                                    Are you sure you want to leave without saving? You will lose any changes made.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowExitConfirmation(false)}
                                        className="flex-1 bg-[#4B5563] text-white py-2.5 rounded-lg font-semibold hover:bg-[#374151] transition-colors"
                                    >
                                        No
                                    </button>
                                    <button
                                        onClick={handleConfirmExit}
                                        className="flex-1 bg-[#3D7475] text-white py-2.5 rounded-lg font-semibold hover:bg-[#2c5556] transition-colors"
                                    >
                                        Yes, Discard
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default AddReminderModal;
