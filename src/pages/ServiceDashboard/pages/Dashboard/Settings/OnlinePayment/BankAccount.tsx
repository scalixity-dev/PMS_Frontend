import React, { useState } from 'react';
import { Edit, CreditCard, Wifi, HelpCircle, Plus, Building2, Trash2, X, Check } from 'lucide-react';

const BankAccount = () => {
    // State to toggle between views. 
    // For demo purposes, defaulting to null to show the "No Account" state as requested.
    // Change initial state to populate with data to see the "Has Account" view.
    const [bankDetails, setBankDetails] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        holderName: '',
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        accountType: 'Checking',
        swiftCode: ''
    });

    const handleEdit = () => {
        if (bankDetails) {
            setFormData(bankDetails);
        }
        setIsEditing(true);
    };

    const handleSave = () => {
        setBankDetails(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // If we were adding a new account (no details existed), go back to null
        if (!bankDetails) {
            setFormData({
                holderName: '',
                bankName: '',
                accountNumber: '',
                routingNumber: '',
                accountType: 'Checking',
                swiftCode: ''
            });
        }
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to remove this bank account?")) {
            setBankDetails(null);
            setFormData({
                holderName: '',
                bankName: '',
                accountNumber: '',
                routingNumber: '',
                accountType: 'Checking',
                swiftCode: ''
            });
        }
    };

    // --- RENDER HELPERS ---

    // 1. EMPTY STATE (No Account)
    if (!bankDetails && !isEditing) {
        return (
            <div className="space-y-8">
                <div className="flex flex-col items-center justify-center py-8 md:py-16 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                        <Building2 className="text-[#7CD947]" size={40} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No Bank Account Linked</h2>
                    <p className="text-gray-500 max-w-md mb-8">
                        Link your bank account to receive payouts directly. It's secure, fast, and easy to set up.
                    </p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-[#7CD947] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#6bc13d] transition-all transform hover:scale-105 shadow-md shadow-green-200"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                        Add Bank Account
                    </button>
                </div>

                {/* Help Section (preserved) */}
                <HelpSection />
            </div>
        );
    }

    // 2. FORM STATE (Add / Edit)
    if (isEditing) {
        return (
            <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 py-4 md:px-8 md:py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                {bankDetails ? 'Edit Bank Account' : 'Add Bank Account'}
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">Enter your banking details carefully</p>
                        </div>
                        <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-4 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Account Holder Name</label>
                                <input
                                    type="text"
                                    value={formData.holderName}
                                    onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
                                    placeholder="e.g. John Doe"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#7CD947] focus:ring-2 focus:ring-green-100 outline-none transition-all text-sm font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Bank Name</label>
                                <input
                                    type="text"
                                    value={formData.bankName}
                                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                    placeholder="e.g. Chase Bank"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#7CD947] focus:ring-2 focus:ring-green-100 outline-none transition-all text-sm font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Account Number</label>
                                <input
                                    type="text"
                                    value={formData.accountNumber}
                                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                    placeholder="Enter account number"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#7CD947] focus:ring-2 focus:ring-green-100 outline-none transition-all text-sm font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Routing Number</label>
                                <input
                                    type="text"
                                    value={formData.routingNumber}
                                    onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                                    placeholder="Enter 9-digit routing number"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#7CD947] focus:ring-2 focus:ring-green-100 outline-none transition-all text-sm font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Account Type</label>
                                <select
                                    value={formData.accountType}
                                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#7CD947] focus:ring-2 focus:ring-green-100 outline-none transition-all text-sm font-medium bg-white"
                                >
                                    <option value="Checking">Checking</option>
                                    <option value="Savings">Savings</option>
                                    <option value="Business">Business</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">SWIFT Code (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.swiftCode}
                                    onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
                                    placeholder="Enter SWIFT / BIC code"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#7CD947] focus:ring-2 focus:ring-green-100 outline-none transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 border-t border-gray-100 pt-6">
                            <button
                                onClick={handleSave}
                                className="flex items-center justify-center gap-2 bg-[#7CD947] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#6bc13d] transition-colors shadow-sm"
                            >
                                <Check size={18} strokeWidth={2.5} />
                                Save Detail
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors text-center"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 3. VIEW STATE (Has Account)
    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm shrink-0">
                        <CreditCard className="text-gray-900" size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Bank Account</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Manage your bank account information for payments</p>
                    </div>
                </div>

                <div className="flex gap-3 self-start sm:self-center">
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 bg-white border border-red-100 text-red-500 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={18} strokeWidth={2} />
                        <span className="hidden sm:inline">Delete</span>
                    </button>
                    <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 bg-[#7CD947] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#6bc13d] transition-colors shadow-sm"
                    >
                        <Edit size={18} strokeWidth={2} />
                        Edit
                    </button>
                </div>
            </div>

            {/* Bank Account Details Card */}
            <div className="bg-white rounded-xl p-4 md:p-8 shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-y-8 gap-x-12">
                    {/* Row 1 */}
                    <div>
                        <p className="text-xs font-semibold text-gray-900 mb-1.5">Account Holder Name</p>
                        <p className="text-sm text-gray-600 font-medium">{bankDetails.holderName}</p>
                    </div>
                    <div></div>

                    {/* Row 2 */}
                    <div>
                        <p className="text-xs font-semibold text-gray-900 mb-1.5">Bank Name</p>
                        <p className="text-sm text-gray-600 font-medium">{bankDetails.bankName}</p>
                    </div>
                    <div></div>

                    {/* Row 3 */}
                    <div>
                        <p className="text-xs font-semibold text-gray-900 mb-1.5">Account Number</p>
                        <p className="text-sm text-gray-600 font-medium">****{bankDetails.accountNumber.slice(-4)}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-900 mb-1.5">Routing Number</p>
                        <p className="text-sm text-gray-600 font-medium">{bankDetails.routingNumber}</p>
                    </div>

                    {/* Row 4 */}
                    <div>
                        <p className="text-xs font-semibold text-gray-900 mb-1.5">Account Type</p>
                        <p className="text-sm text-gray-600 font-medium">{bankDetails.accountType}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-900 mb-1.5">SWIFT Code (Optional)</p>
                        <p className="text-sm text-gray-600 font-medium">{bankDetails.swiftCode || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Credit Card Visual (Optional: Dynamic based on bank name if desired, keeping static for now but using real last 4 digits) */}
            <div className="w-full max-w-[420px]">
                <div className="relative aspect-[1.586/1] bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-black rounded-2xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between border border-white/10">

                    {/* Header: Bank & Card Type */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 opacity-90">
                                <path d="M12 2L2 22h20L12 2zm0 3l7.5 15h-15L12 5z" />
                            </svg>
                            <span className="font-medium tracking-wider text-xs sm:text-sm uppercase opacity-90">{bankDetails.bankName || 'BANK NAME'}</span>
                        </div>
                        <span className="text-xs sm:text-sm tracking-wider opacity-70 font-light">Debit/Credit</span>
                    </div>

                    {/* Middle: Chip & Wifi */}
                    <div className="flex justify-between items-center">
                        <div className="w-10 h-7 sm:w-12 sm:h-9 bg-gradient-to-tr from-yellow-200 to-yellow-500 rounded sm:rounded-md border border-yellow-600 opacity-90 relative shadow-sm">
                            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-yellow-700/50"></div>
                            <div className="absolute top-0 left-1/2 h-full w-[1px] bg-yellow-700/50"></div>
                        </div>
                        <Wifi className="rotate-90 opacity-80" size={24} />
                    </div>

                    {/* Footer: Numbers & Name */}
                    <div className="space-y-4">
                        <div className="flex gap-2 sm:gap-4 text-lg sm:text-2xl font-mono tracking-widest opacity-95">
                            <span>****</span>
                            <span>****</span>
                            <span>****</span>
                            <span>{bankDetails.accountNumber.slice(-4) || '0000'}</span>
                        </div>

                        <div className="flex justify-between items-end">
                            <div className="font-mono uppercase tracking-widest text-xs sm:text-sm opacity-80 max-w-[200px] truncate">
                                {bankDetails.holderName || 'CARDHOLDER NAME'}
                            </div>
                            <div className="text-[10px] flex flex-col items-center leading-none opacity-80">
                                <span className="text-[5px] sm:text-[6px] mb-0.5">VALID THRU</span>
                                <span className="font-mono text-xs sm:text-sm">12/30</span>
                            </div>
                        </div>
                    </div>

                    {/* Glass Shine Effect */}
                    <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-white/5 rotate-45 pointer-events-none group-hover:top-[-50%] group-hover:left-[-50%] transition-all duration-700 ease-out" />
                </div>
            </div>

            <HelpSection />
        </div>
    );
};

const HelpSection = () => (
    <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-5 items-start mt-8">
        <div className="w-10 h-10 rounded-full bg-[#7CD947] flex items-center justify-center shrink-0 shadow-sm shadow-green-200">
            <HelpCircle className="text-white" size={20} />
        </div>
        <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1 text-sm">Questions About Getting Paid?</h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed max-w-3xl">
                Our payment setup is secure and straightforward. Payments are deposited directly to your bank account within 3-5 business days after job completion.
                Need help with tax forms or entity registration? We're here to assist.
            </p>
            <div className="flex gap-3">
                <button className="bg-[#7CD947] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-[#6bc13d] transition-colors shadow-sm">
                    Contact Support
                </button>
                <button className="bg-white border border-gray-200 text-gray-700 px-5 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm">
                    View FAQs
                </button>
            </div>
        </div>
    </div>
);

export default BankAccount;
