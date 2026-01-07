import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import DatePicker from '../../../../../components/ui/DatePicker';
import TimePicker from '../../../../../components/ui/TimePicker';
import type { Task } from '../Tasks';
import { useTaskStore } from '../store/taskStore';
import { useCreateTask, useUpdateTask } from '../../../../../hooks/useTaskQueries';
import { useGetAllProperties } from '../../../../../hooks/usePropertyQueries';

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (taskData: any) => void; // Optional now since we handle API calls internally
    taskToEdit?: Task | null;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSave, taskToEdit }) => {
    const { formData, setFormData, updateFormData, resetForm } = useTaskStore();
    const createTaskMutation = useCreateTask();
    const updateTaskMutation = useUpdateTask();

    // Fetch properties for dropdown
    const { data: properties = [], isLoading: isLoadingProperties } = useGetAllProperties();

    const [showExitConfirmation, setShowExitConfirmation] = React.useState(false);
    const [formErrors, setFormErrors] = React.useState({ title: false, date: false, time: false, description: false });
    const [initialSnapshot, setInitialSnapshot] = React.useState(formData);
    const MAX_DESCRIPTION_LENGTH = 100;
    const prevIsOpenRef = React.useRef(isOpen);
    const prevTaskToEditRef = React.useRef(taskToEdit);

    useEffect(() => {
        // Only run when modal opens or taskToEdit changes
        const isOpening = !prevIsOpenRef.current && isOpen;
        const taskChanged = prevTaskToEditRef.current?.id !== taskToEdit?.id;

        if (isOpen && taskToEdit && (isOpening || taskChanged)) {
            // Populate form from taskToEdit
            const editDate = taskToEdit.date ? new Date(taskToEdit.date) : undefined;
            const editTime = taskToEdit.time || '';
            const editAssignee = taskToEdit.name || '';
            // Find property ID from property name
            const propertyObj = properties.find(p => p.propertyName === taskToEdit.property);
            const editProperty = propertyObj?.id || '';
            const editIsRecurring = taskToEdit.isRecurring || false;
            const editFrequency = taskToEdit.frequency || '';
            const editEndDate = taskToEdit.endDate && taskToEdit.endDate !== 'Indefinite' ? new Date(taskToEdit.endDate) : undefined;
            const editIsAllDay = taskToEdit.isAllDay || false;


            const editFormData = {
                title: taskToEdit.title || '',
                description: taskToEdit.description || '',
                date: editDate,
                time: editTime,
                assignee: editAssignee,
                property: editProperty,
                isRecurring: editIsRecurring,
                frequency: editFrequency,
                endDate: editEndDate,
                isAllDay: editIsAllDay
            };

            setFormData(editFormData);
            setInitialSnapshot(editFormData);
        } else if (isOpen && !taskToEdit && isOpening) {
            // Reset form only when opening in add mode (not on every render)
            const emptyFormData = {
                title: '',
                description: '',
                date: undefined,
                time: '',
                assignee: '',
                property: '',
                isRecurring: false,
                frequency: '',
                endDate: undefined,
                isAllDay: false
            };
            setFormData(emptyFormData);
            setInitialSnapshot(emptyFormData);
        }

        // Update refs
        prevIsOpenRef.current = isOpen;
        prevTaskToEditRef.current = taskToEdit;
    }, [isOpen, taskToEdit, properties, setFormData]);

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

    const frequencyOptions = [
        { value: 'DAILY', label: 'Daily' },
        { value: 'WEEKLY', label: 'Weekly' },
        { value: 'MONTHLY', label: 'Monthly' },
        { value: 'QUARTERLY', label: 'Quarterly' },
        { value: 'YEARLY', label: 'Yearly' },
        { value: 'ONCE', label: 'Once' },
    ];

    // For assignee, we use a text input field
    // TODO: In a real app, you'd fetch users/contacts from API for a dropdown

    const handleSubmit = async () => {
        // Validate required fields
        const errors = {
            title: !formData.title.trim(),
            date: !formData.date,
            time: !formData.isAllDay && !formData.time.trim(),
            description: formData.description ? formData.description.length > MAX_DESCRIPTION_LENGTH : false
        };

        setFormErrors(errors);

        // Prevent submission if any required field is invalid
        if (errors.title || errors.date || errors.time || errors.description) {
            return;
        }

        try {
            // Transform form data to API format
            const taskDto = {
                title: formData.title,
                description: formData.description || undefined,
                date: formData.date ? formData.date.toISOString() : '',
                time: formData.isAllDay ? '' : formData.time,
                assignee: formData.assignee || undefined,
                propertyId: formData.property || undefined,
                isRecurring: formData.isRecurring,
                frequency: formData.frequency ? (formData.frequency.toUpperCase() as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'ONCE') : undefined,
                endDate: formData.endDate ? formData.endDate.toISOString() : undefined,
                isAllDay: formData.isAllDay,
            };

            if (taskToEdit) {
                // Update existing task
                await updateTaskMutation.mutateAsync({
                    id: typeof taskToEdit.id === 'number' ? taskToEdit.id.toString() : taskToEdit.id,
                    updateData: taskDto,
                });
            } else {
                // Create new task
                await createTaskMutation.mutateAsync(taskDto);
            }

            // Call optional onSave callback if provided
            if (onSave) {
                onSave(formData);
            }

            // Reset form and close modal
            resetForm();
            onClose();
        } catch (error) {
            console.error('Failed to save task:', error);
            // Error handling could show a toast notification here
        }
    };

    const handleCloseAttempt = () => {
        // Check if any field differs from initial snapshot (form is dirty)
        const datesEqual = (a?: Date, b?: Date) =>
            (!a && !b) || (a && b && a.getTime() === b.getTime());

        const isDirty =
            formData.title !== initialSnapshot.title ||
            formData.description !== initialSnapshot.description ||
            !datesEqual(formData.date, initialSnapshot.date) ||
            formData.time !== initialSnapshot.time ||
            formData.assignee !== initialSnapshot.assignee ||
            formData.property !== initialSnapshot.property ||
            formData.isRecurring !== initialSnapshot.isRecurring ||
            formData.frequency !== initialSnapshot.frequency ||
            !datesEqual(formData.endDate, initialSnapshot.endDate) ||
            formData.isAllDay !== initialSnapshot.isAllDay;

        if (isDirty) {
            setShowExitConfirmation(true);
        } else {
            onClose();
        }
    };

    const isLoading = createTaskMutation.isPending || updateTaskMutation.isPending;

    if (!isOpen) return null;

    const handleConfirmExit = () => {
        setShowExitConfirmation(false);
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 animate-in fade-in duration-200 font-['Urbanist']">
            <div className="bg-[#E8ECEB] rounded-3xl w-full max-w-[400px] shadow-2xl animate-slide-in-from-right relative">
                <div className="bg-[#3D7475] p-3 flex items-center justify-between rounded-t-3xl">
                    <h2 className="text-base font-medium text-white">{taskToEdit ? 'Edit Task' : 'Add Task'}</h2>
                    <button onClick={handleCloseAttempt} className="text-white hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-2.5 max-h-[70vh] overflow-y-auto">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => updateFormData('title', e.target.value)}
                            placeholder="Enter Title"
                            disabled={isLoading}
                            className={`w-full bg-white text-gray-800 placeholder-gray-400 px-3 py-2 rounded-md outline-none focus:ring-2 transition-all shadow-sm text-sm ${formErrors.title ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-[#3D7475]/20'
                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                        {formErrors.title && <p className="text-red-500 text-xs mt-1">Title is required</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-gray-700">Description</label>
                            <span className={`text-xs ${formData.description && formData.description.length > MAX_DESCRIPTION_LENGTH ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                                {formData.description?.length || 0}/{MAX_DESCRIPTION_LENGTH}
                            </span>
                        </div>
                        <textarea
                            value={formData.description}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= MAX_DESCRIPTION_LENGTH) {
                                    updateFormData('description', value);
                                }
                            }}
                            placeholder="Enter Details"
                            rows={2}
                            disabled={isLoading}
                            maxLength={MAX_DESCRIPTION_LENGTH}
                            className={`w-full bg-[#F0F2F5] text-gray-800 placeholder-gray-400 px-3 py-2 rounded-md outline-none focus:ring-2 transition-all resize-none shadow-sm text-sm ${formErrors.description
                                    ? 'ring-2 ring-red-500 focus:ring-red-500'
                                    : 'focus:ring-[#3D7475]/20'
                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                        {formErrors.description && (
                            <p className="text-red-500 text-xs mt-1">
                                Description cannot exceed {MAX_DESCRIPTION_LENGTH} characters
                            </p>
                        )}
                    </div>

                    {/* Date & Time */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-gray-700">Date & Time *</label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isAllDay}
                                    onChange={(e) => updateFormData('isAllDay', e.target.checked)}
                                    className="w-3 h-3 rounded border-gray-300 text-[#7BD747] focus:ring-[#7BD747] accent-[#7BD747]"
                                />
                                <span className="text-xs font-medium text-gray-600">All Day</span>
                            </label>
                        </div>
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
                                <div className={isLoading || formData.isAllDay ? 'opacity-50 pointer-events-none' : ''}>
                                    <TimePicker
                                        value={formData.time}
                                        onChange={(time) => updateFormData('time', time)}
                                        placeholder="Time"
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

                    {/* Assignee */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Assignee</label>
                        <input
                            type="text"
                            value={formData.assignee}
                            onChange={(e) => updateFormData('assignee', e.target.value)}
                            placeholder="Enter assignee name or ID"
                            disabled={isLoading}
                            className={`w-full bg-white text-gray-800 placeholder-gray-400 px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all shadow-sm text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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

                    {/* Frequency - Only shown when Recurring is enabled */}
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

                    {/* End Date - Only shown when Recurring is enabled */}
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
                <div className="p-4 pt-2 flex gap-3">
                    <button
                        onClick={handleCloseAttempt}
                        disabled={isLoading}
                        className={`flex-1 bg-white text-gray-800 py-2 rounded-md font-bold hover:bg-gray-50 transition-colors shadow-md border border-gray-100 text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`flex-1 bg-[#3D7475] text-white py-2 rounded-md font-bold hover:bg-[#2c5556] transition-colors shadow-md text-sm flex items-center justify-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {taskToEdit ? 'Saving...' : 'Creating...'}
                            </>
                        ) : (
                            taskToEdit ? 'Save Changes' : 'Create'
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

export default AddTaskModal;
