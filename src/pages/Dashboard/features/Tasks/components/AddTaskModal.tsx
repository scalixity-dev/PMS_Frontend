import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import DatePicker from '../../../../../components/ui/DatePicker';
import TimePicker from '../../../../../components/ui/TimePicker';
import { Task } from '../Tasks';

export interface TaskFormData {
    title: string;
    description: string;
    date: Date | undefined;
    time: string;
    assignee: string;
    property: string;
    isRecurring: boolean;
    frequency: string;
    endDate: Date | undefined;
}

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (taskData: TaskFormData) => void;
    taskToEdit?: Task | null;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSave, taskToEdit }) => {
    const initialFormData = {
        title: '',
        description: '',
        date: undefined as Date | undefined,
        time: '',
        assignee: '',
        property: '',
        isRecurring: false,
        frequency: '',
        endDate: undefined as Date | undefined
    };

    const [title, setTitle] = useState(initialFormData.title);
    const [description, setDescription] = useState(initialFormData.description);
    const [date, setDate] = useState<Date | undefined>(initialFormData.date);
    const [time, setTime] = useState(initialFormData.time);
    const [assignee, setAssignee] = useState(initialFormData.assignee);
    const [property, setProperty] = useState(initialFormData.property);
    const [isRecurring, setIsRecurring] = useState(initialFormData.isRecurring);
    const [frequency, setFrequency] = useState(initialFormData.frequency);
    const [endDate, setEndDate] = useState<Date | undefined>(initialFormData.endDate);
    const [showExitConfirmation, setShowExitConfirmation] = useState(false);
    const [formErrors, setFormErrors] = useState({ title: false, date: false, time: false });
    const [initialSnapshot, setInitialSnapshot] = useState<TaskFormData>(initialFormData);

    useEffect(() => {
        if (isOpen && taskToEdit) {
            // Populate form from taskToEdit
            const editDate = taskToEdit.date ? new Date(taskToEdit.date) : undefined;
            const editTime = taskToEdit.time || '';
            const editAssignee = taskToEdit.name ? 'user1' : ''; // Mock logic for assignee mapping
            const editProperty = taskToEdit.property || '';
            const editIsRecurring = taskToEdit.isRecurring || false;
            const editFrequency = taskToEdit.frequency || '';
            const editEndDate = taskToEdit.endDate && taskToEdit.endDate !== 'Indefinite' ? new Date(taskToEdit.endDate) : undefined;
            
            setTitle(taskToEdit.title || '');
            setDescription(taskToEdit.description || '');
            setDate(editDate);
            setTime(editTime);
            setAssignee(editAssignee);
            setProperty(editProperty);
            setIsRecurring(editIsRecurring);
            setFrequency(editFrequency);
            setEndDate(editEndDate);
            
            // Capture initial snapshot for isDirty comparison
            setInitialSnapshot({
                title: taskToEdit.title || '',
                description: taskToEdit.description || '',
                date: editDate,
                time: editTime,
                assignee: editAssignee,
                property: editProperty,
                isRecurring: editIsRecurring,
                frequency: editFrequency,
                endDate: editEndDate
            });
        } else if (isOpen && !taskToEdit) {
            // Reset form if opening in add mode
            setTitle(initialFormData.title);
            setDescription(initialFormData.description);
            setDate(initialFormData.date);
            setTime(initialFormData.time);
            setAssignee(initialFormData.assignee);
            setProperty(initialFormData.property);
            setIsRecurring(initialFormData.isRecurring);
            setFrequency(initialFormData.frequency);
            setEndDate(initialFormData.endDate);
            
            // Capture initial snapshot for isDirty comparison
            setInitialSnapshot(initialFormData);
        }
    }, [isOpen, taskToEdit]);

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

    if (!isOpen) return null;

    const assigneeOptions = [
        { value: 'user1', label: 'User 1' },
        { value: 'user2', label: 'User 2' },
    ];

    const propertyOptions = [
        { value: 'prop1', label: 'Property 1' },
        { value: 'prop2', label: 'Property 2' },
    ];

    const frequencyOptions = [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
    ];

    const handleSubmit = () => {
        // Validate required fields
        const errors = {
            title: !title.trim(),
            date: !date,
            time: !time.trim()
        };

        setFormErrors(errors);

        // Prevent submission if any required field is invalid
        if (errors.title || errors.date || errors.time) {
            return;
        }

        // Call onSave with form data
        const taskData: TaskFormData = {
            title,
            description,
            date,
            time,
            assignee,
            property,
            isRecurring,
            frequency,
            endDate
        };

        onSave(taskData);
        onClose();
    };

    const handleCloseAttempt = () => {
        // Check if any field differs from initial snapshot (form is dirty)
        const isDirty =
            title !== initialSnapshot.title ||
            description !== initialSnapshot.description ||
            date !== initialSnapshot.date ||
            time !== initialSnapshot.time ||
            assignee !== initialSnapshot.assignee ||
            property !== initialSnapshot.property ||
            isRecurring !== initialSnapshot.isRecurring ||
            frequency !== initialSnapshot.frequency ||
            endDate !== initialSnapshot.endDate;

        if (isDirty) {
            setShowExitConfirmation(true);
        } else {
            onClose();
        }
    };

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
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter Title"
                            className={`w-full bg-white text-gray-800 placeholder-gray-400 px-3 py-2 rounded-md outline-none focus:ring-2 transition-all shadow-sm text-sm ${formErrors.title ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-[#3D7475]/20'
                                }`}
                        />
                        {formErrors.title && <p className="text-red-500 text-xs mt-1">Title is required</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter Details"
                            rows={2}
                            className="w-full bg-[#F0F2F5] text-gray-800 placeholder-gray-400 px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all resize-none shadow-sm text-sm"
                        />
                    </div>

                    {/* Date & Time */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Date & Time *</label>
                        <div className="flex gap-2">
                            <div className="w-2/3">
                                <DatePicker
                                    value={date}
                                    onChange={setDate}
                                    placeholder="Select Date"
                                    className={formErrors.date ? 'ring-2 ring-red-500' : ''}
                                />
                            </div>
                            <div className="w-1/3">
                                <TimePicker
                                    value={time}
                                    onChange={setTime}
                                    placeholder="Time"
                                    className={formErrors.time ? 'ring-2 ring-red-500' : ''}
                                />
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
                        <label className="block text-xs font-bold text-gray-700 mb-1">Assignee*</label>
                        <CustomDropdown
                            value={assignee}
                            onChange={setAssignee}
                            options={assigneeOptions}
                            placeholder="Select Assignee"
                            buttonClassName="w-full bg-white text-gray-800 px-3 py-2.5 rounded-md outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all shadow-sm text-sm border-none"
                        />
                    </div>

                    {/* Property */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Property*</label>
                        <CustomDropdown
                            value={property}
                            onChange={setProperty}
                            options={propertyOptions}
                            placeholder="Select Property"
                            buttonClassName="w-full bg-white text-gray-800 px-3 py-2.5 rounded-md outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all shadow-sm text-sm border-none"
                        />
                    </div>

                    {/* Recurring Toggle */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsRecurring(!isRecurring)}
                            className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${isRecurring ? 'bg-[#84CC16]' : 'bg-gray-300'}`}
                        >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${isRecurring ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <span className="text-xs font-medium text-gray-700">Recurring</span>
                    </div>

                    {/* Frequency */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Frequency</label>
                        <CustomDropdown
                            value={frequency}
                            onChange={setFrequency}
                            options={frequencyOptions}
                            placeholder="Select Frequency"
                            buttonClassName="w-full bg-white text-gray-800 px-3 py-2.5 rounded-md outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all shadow-sm text-sm border-none"
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">End Date</label>
                        <DatePicker
                            value={endDate}
                            onChange={setEndDate}
                            placeholder="Select End Date"
                        />
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 pt-2 flex gap-3">
                    <button
                        onClick={handleCloseAttempt}
                        className="flex-1 bg-white text-gray-800 py-2 rounded-md font-bold hover:bg-gray-50 transition-colors shadow-md border border-gray-100 text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-[#3D7475] text-white py-2 rounded-md font-bold hover:bg-[#2c5556] transition-colors shadow-md text-sm"
                    >
                        {taskToEdit ? 'Save Changes' : 'Create'}
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
