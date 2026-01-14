import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, Plus } from 'lucide-react';
import DatePicker from '../../../../../components/ui/DatePicker';

interface Tenant {
    name: string;
    amount: number;
}

interface Schedule {
    id: number;
    startDate: Date | undefined;
    newRentAmount: number;
    tenants: Tenant[];
}

interface RentScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (schedules: Schedule[]) => void;
    currentRent: number;
    initialTenants: { name: string; amount?: number }[];
}

const RentScheduleModal: React.FC<RentScheduleModalProps> = ({ isOpen, onClose, onConfirm, currentRent, initialTenants }) => {
    const [schedules, setSchedules] = useState<Schedule[]>([
        {
            id: Date.now(),
            startDate: new Date('2026-01-24'),
            newRentAmount: 0,
            tenants: initialTenants.map(t => ({ name: t.name, amount: 0 }))
        }
    ]);

    // Prevent background scrolling
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Reset schedules when modal opens, if needed, or keep state. 
            // For now, let's just ensure we start fresh or persist. 
            // If we want to reset on open:
            setSchedules([{
                id: Date.now(),
                startDate: new Date('2026-01-24'),
                newRentAmount: 0,
                tenants: initialTenants.map(t => ({ name: t.name, amount: 0 }))
            }]);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialTenants]);

    const addSchedule = () => {
        setSchedules([
            ...schedules,
            {
                id: Date.now(),
                startDate: undefined,
                newRentAmount: 0,
                tenants: initialTenants.map(t => ({ name: t.name, amount: 0 }))
            }
        ]);
    };

    const removeSchedule = (id: number) => {
        setSchedules(schedules.filter(s => s.id !== id));
    };

    const updateSchedule = (id: number, field: keyof Schedule, value: any) => {
        setSchedules(schedules.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const calculateChange = (newAmount: number) => {
        if (currentRent === 0) return 0;
        return ((newAmount - currentRent) / currentRent) * 100;
    };

    const inputClasses = "w-full p-3 rounded-lg border border-gray-200 outline-none text-gray-700 placeholder-gray-400 font-medium focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all bg-white";

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#dfe5e3] rounded-[1.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between shrink-0">
                    <h2 className="text-white text-lg font-medium">Rent Increase/Decrease</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                    <p className="text-gray-600 text-sm leading-relaxed">
                        This tool allows you to adjust rent invoices for this lease, either increasing or decreasing the amount. Please note that the change must take effect on the same date as the next scheduled invoice.
                    </p>

                    <div>
                        <h3 className="text-[#2c3e50] font-bold text-sm mb-1">Current rent</h3>
                        <p className="text-[#2c3e50] font-medium">₹{currentRent.toLocaleString('en-IN', { minimumFractionDigits: 2 })} /monthly</p>
                    </div>

                    <div className="border-t border-gray-200"></div>

                    {schedules.map((schedule, index) => (
                        <div key={schedule.id} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[#2c3e50] font-bold">Schedule {index + 1}</h3>
                                <button onClick={() => removeSchedule(schedule.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1.5fr_1fr] gap-4 items-start">
                                <div>
                                    <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Start date <span className="text-red-500">*</span></label>
                                    <DatePicker
                                        value={schedule.startDate}
                                        onChange={(date) => updateSchedule(schedule.id, 'startDate', date)}
                                        className="w-full border-gray-200"
                                        placeholder="dd/mm/yyyy"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">New rent amount <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        value={schedule.newRentAmount || ''}
                                        onChange={(e) => updateSchedule(schedule.id, 'newRentAmount', parseFloat(e.target.value))}
                                        className={inputClasses}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-[#2c3e50] font-medium mb-1 ml-1">Change</label>
                                    <div className="text-[#2c3e50] font-bold text-lg pt-2">
                                        {calculateChange(schedule.newRentAmount).toFixed(2)}%
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {schedule.tenants.map((tenant, tIndex) => (
                                    <React.Fragment key={tIndex}>
                                        <div>
                                            <div className="text-xs text-gray-900 font-medium mb-1 ml-1">Tenant</div>
                                            <div className="bg-[#F0F2F5] p-3 rounded-lg text-gray-500 border border-transparent font-medium">
                                                {tenant.name}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#2c3e50] font-medium mb-1 ml-1">Amount</label>
                                            <input
                                                type="number"
                                                className={inputClasses}
                                                placeholder="₹0.00"
                                            />
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    ))}

                    <button onClick={addSchedule} className="flex items-center gap-2 text-[#3A6D6C] font-bold hover:text-[#2c5251] transition-colors">
                        <Plus className="w-5 h-5" />
                        Add another rent schedule
                    </button>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4 shrink-0 border-t border-gray-200/50">
                        <button
                            onClick={onClose}
                            className="w-full sm:flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onConfirm(schedules)}
                            className="w-full sm:flex-1 bg-[#3A6D6C] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default RentScheduleModal;
