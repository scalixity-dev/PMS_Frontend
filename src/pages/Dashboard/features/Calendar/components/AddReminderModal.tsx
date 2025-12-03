import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';
import DatePicker from '../../../../../components/ui/DatePicker';
import TimePicker from '../../../../../components/ui/TimePicker';
import CustomDropdown from '../../../components/CustomDropdown';

interface AddReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

const AddReminderModal: React.FC<AddReminderModalProps> = ({ isOpen, onClose, onSave }) => {
    const initialFormData = {
        title: '',
        details: '',
        date: undefined as Date | undefined,
        time: '',
        assignee: '',
        property: '',
        isRecurring: false
    };

    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState({ title: false, date: false, time: false });
    const [showExitConfirmation, setShowExitConfirmation] = useState(false);

    const assigneeOptions = [
        { value: 'user1', label: 'User 1' },
        { value: 'user2', label: 'User 2' },
        { value: 'user3', label: 'User 3' },
    ];

    const propertyOptions = [
        { value: 'prop1', label: 'Property 1' },
        { value: 'prop2', label: 'Property 2' },
        { value: 'prop3', label: 'Property 3' },
    ];

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date?: Date) => {
        setFormData(prev => ({ ...prev, date }));
    };

    const handleTimeChange = (time: string) => {
        setFormData(prev => ({ ...prev, time }));
    };

    const handleAssigneeChange = (value: string) => {
        setFormData(prev => ({ ...prev, assignee: value }));
    };

    const handlePropertyChange = (value: string) => {
        setFormData(prev => ({ ...prev, property: value }));
    };

    const handleToggle = () => {
        setFormData(prev => ({ ...prev, isRecurring: !prev.isRecurring }));
    };

    const handleSubmit = () => {
        // Validate required fields
        const errors = {
            title: !formData.title,
            date: !formData.date,
            time: !formData.time
        };

        setFormErrors(errors);

        // Prevent submission if any required field is invalid
        if (errors.title || errors.date || errors.time) {
            return;
        }

        onSave(formData);
        onClose();
    };

    const handleCloseAttempt = () => {
        // Check if any field differs from initial value (form is dirty)
        const isDirty = 
            formData.title !== initialFormData.title ||
            formData.details !== initialFormData.details ||
            formData.date !== initialFormData.date ||
            formData.time !== initialFormData.time ||
            formData.assignee !== initialFormData.assignee ||
            formData.property !== initialFormData.property ||
            formData.isRecurring !== initialFormData.isRecurring;

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
            <div className="bg-[#E8ECEB] rounded-3xl w-full max-w-sm shadow-2xl animate-slide-in-from-right relative">
                {/* Header */}
                <div className="bg-[#3D7475] p-4 flex items-center justify-between rounded-t-3xl">
                    <h2 className="text-lg font-medium text-white">Add reminder</h2>
                    <button onClick={handleCloseAttempt} className="text-white hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3">

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter Title"
                            className={`w-full bg-white text-gray-800 placeholder-gray-400 px-3 py-2.5 rounded-md outline-none focus:ring-2 transition-all shadow-sm text-sm ${
                                formErrors.title ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-[#3D7475]/20'
                            }`}
                        />
                        {formErrors.title && <p className="text-red-500 text-xs mt-1">Title is required</p>}
                    </div>

                    {/* Details */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Details</label>
                        <textarea
                            name="details"
                            value={formData.details}
                            onChange={handleChange}
                            placeholder="Enter Details"
                            rows={2}
                            className="w-full bg-[#F0F2F5] text-gray-800 placeholder-gray-400 px-3 py-2.5 rounded-md outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all resize-none shadow-sm text-sm"
                        />
                    </div>

                    {/* Date & Time */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Date & Time *</label>
                        <div className="flex gap-2">
                            <div className="w-2/3">
                                <DatePicker
                                    value={formData.date}
                                    onChange={handleDateChange}
                                    placeholder="Select Date"
                                    className={formErrors.date ? 'ring-2 ring-red-500' : ''}
                                />
                            </div>
                            <div className="w-1/3">
                                <TimePicker
                                    value={formData.time}
                                    onChange={handleTimeChange}
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
                            value={formData.assignee}
                            onChange={handleAssigneeChange}
                            options={assigneeOptions}
                            placeholder="Select Assignee"
                            buttonClassName="w-full bg-white text-gray-800 px-3 py-2.5 rounded-md outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all shadow-sm text-sm border-none"
                        />
                    </div>

                    {/* Property */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Property*</label>
                        <CustomDropdown
                            value={formData.property}
                            onChange={handlePropertyChange}
                            options={propertyOptions}
                            placeholder="Select Property"
                            buttonClassName="w-full bg-white text-gray-800 px-3 py-2.5 rounded-md outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all shadow-sm text-sm border-none"
                        />
                    </div>

                    {/* Recurring Toggle */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleToggle}
                            className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${formData.isRecurring ? 'bg-[#84CC16]' : 'bg-gray-300'}`}
                        >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${formData.isRecurring ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <span className="text-xs font-medium text-gray-700">Recurring</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 pt-2 flex gap-3">
                    <button
                        onClick={handleCloseAttempt}
                        className="flex-1 bg-white text-gray-800 py-2.5 rounded-md font-bold hover:bg-gray-50 transition-colors shadow-md border border-gray-100 text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-[#3D7475] text-white py-2.5 rounded-md font-bold hover:bg-[#2c5556] transition-colors shadow-md text-sm"
                    >
                        Create
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
