import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, User, Home, RotateCw, Pencil, Trash2 } from 'lucide-react';

interface TaskDetailSideModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: any;
    onEdit?: () => void;
    onDelete?: () => void;
}

const TaskDetailSideModal: React.FC<TaskDetailSideModalProps> = ({ isOpen, onClose, task, onEdit, onDelete }) => {
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

    if (!isOpen || !task) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex justify-end bg-black/50 animate-in fade-in duration-200 font-['Urbanist']"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-md h-full shadow-2xl animate-slide-in-from-right overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-[#3D7475] p-6 flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">{task.title}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block bg-white/20 text-white`}>
                            {task.status}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-8">
                    {/* Description Section if available (mock data might add it later) */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Description</h3>
                        <p className="text-gray-700 leading-relaxed">
                            {task.description || "No additional description provided for this task."}
                        </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Assignee */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Assigned To</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <img src={task.avatar} alt={task.name} className="w-6 h-6 rounded-full object-cover" />
                                    <span className="font-semibold text-gray-800">{task.name}</span>
                                </div>
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Due Date</p>
                                <p className="font-semibold text-gray-800 mt-1">{task.date}</p>
                                {task.time && <p className="text-sm text-gray-500">{task.time}</p>}
                            </div>
                        </div>

                        {/* Recurring Info */}
                        {task.isRecurring && (
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                                    <RotateCw size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Frequency</p>
                                    <p className="font-semibold text-gray-800 mt-1 capitalize">{task.frequency}</p>
                                    {task.endDate && (
                                        <p className="text-xs text-gray-500 mt-0.5">Ends: {task.endDate}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Property */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                                <Home size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Property</p>
                                <p className="font-semibold text-[#2E6819] mt-1">{task.property}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions / Footer */}
                    <div className="border-t pt-6 mt-8 flex gap-3">
                        <button
                            onClick={onEdit}
                            className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Pencil size={18} />
                            Edit Task
                        </button>
                        <button
                            onClick={onDelete}
                            className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 size={18} />
                            Delete Task
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default TaskDetailSideModal;
