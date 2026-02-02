import React, { useState } from 'react';
import {
    User,
    Lock,
    Crown,
    Users,
    CheckCircle,
    Save,
    Eye,
    EyeOff,
    Plus,
    X,
    Copy,
    UserPlus
} from 'lucide-react';

// --- Types ---

interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    billingCycle: 'monthly' | 'yearly';
    maxProperties: number;
    maxUsers: number;
    features: string[];
    isActive: boolean;
}

interface AdminUser {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: string;
}

// --- Mock Data ---

const mockPlans: SubscriptionPlan[] = [
    {
        id: 'basic',
        name: 'Basic',
        price: 29,
        billingCycle: 'monthly',
        maxProperties: 10,
        maxUsers: 5,
        features: ['Property Management', 'Tenant Portal', 'Basic Reports'],
        isActive: true
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 79,
        billingCycle: 'monthly',
        maxProperties: 50,
        maxUsers: 20,
        features: ['All Basic Features', 'Advanced Reports', 'API Access', 'Priority Support'],
        isActive: true
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 199,
        billingCycle: 'monthly',
        maxProperties: -1,
        maxUsers: -1,
        features: ['All Pro Features', 'Unlimited Everything', 'Custom Integrations', 'Dedicated Support'],
        isActive: true
    }
];

const mockAdminUsers: AdminUser[] = [
    { id: '1', name: 'John Smith', email: 'john.smith@propmax.com', isActive: true, createdAt: '2024-01-15' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah.johnson@propmax.com', isActive: true, createdAt: '2024-02-20' },
    { id: '3', name: 'Michael Brown', email: 'michael.brown@propmax.com', isActive: false, createdAt: '2024-03-10' },
    { id: '4', name: 'Emily Davis', email: 'emily.davis@propmax.com', isActive: true, createdAt: '2024-04-05' },
];

// --- Helper Functions ---

const generatePassword = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    const randomValues = new Uint32Array(12);
    globalThis.crypto.getRandomValues(randomValues);
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(randomValues[i] % chars.length);
    }
    return password;
};

// --- Components ---

const TabButton = ({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${active
            ? 'bg-[#7BD747] text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100'
            }`}
    >
        {children}
    </button>
);

// Create Admin User Modal
const CreateAdminModal = ({
    isOpen,
    onClose,
    onCreateUser
}: {
    isOpen: boolean;
    onClose: () => void;
    onCreateUser: (user: { name: string; email: string; password: string }) => void;
}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [generatedPassword, setGeneratedPassword] = useState(generatePassword());
    const [copied, setCopied] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && email) {
            onCreateUser({ name, email, password: generatedPassword });
            setName('');
            setEmail('');
            setGeneratedPassword(generatePassword());
            onClose();
        }
    };

    const handleCopyPassword = async () => {
        try {
            await navigator.clipboard.writeText(generatedPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy password to clipboard:', error);
            // Fallback: Show user-friendly error indication
            // The UI will simply not show the copied state if this fails
        }
    };

    const regeneratePassword = () => {
        setGeneratedPassword(generatePassword());
        setCopied(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#7BD747]/10 rounded-lg">
                            <UserPlus size={24} className="text-[#7BD747]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Create Admin User</h2>
                            <p className="text-sm text-gray-500">Add a new administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter full name"
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7BD747] focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address"
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7BD747] focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-medium text-gray-700">Auto-Generated Password</label>
                            <button
                                type="button"
                                onClick={regeneratePassword}
                                className="text-xs text-[#7BD747] hover:text-[#6bc43a] font-medium"
                            >
                                Regenerate
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                value={generatedPassword}
                                readOnly
                                className="w-full px-4 py-2.5 pr-12 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-mono text-sm"
                            />
                            <button
                                type="button"
                                onClick={handleCopyPassword}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#7BD747] transition-colors"
                                title="Copy password"
                            >
                                {copied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5">
                            The user can change this password after their first login.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-[#7BD747] text-white rounded-lg hover:bg-[#6bc43a] transition-colors font-medium shadow-sm"
                        >
                            Create User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'plans' | 'users'>('profile');

    // Profile State
    const [adminName, setAdminName] = useState('Admin User');
    const [adminEmail, setAdminEmail] = useState('admin@propmax.com');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Subscription Plans State
    const [plans, setPlans] = useState<SubscriptionPlan[]>(mockPlans);
    const [trialDays, setTrialDays] = useState(14);

    // User Management State
    const [adminUsers, setAdminUsers] = useState<AdminUser[]>(mockAdminUsers);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handlePlanUpdate = (planId: string, field: keyof SubscriptionPlan, value: number | boolean) => {
        setPlans(plans.map(p =>
            p.id === planId ? { ...p, [field]: value } : p
        ));
    };

    const handleToggleUserStatus = (userId: string) => {
        setAdminUsers(adminUsers.map(user =>
            user.id === userId ? { ...user, isActive: !user.isActive } : user
        ));
    };

    const handleCreateUser = (userData: { name: string; email: string; password: string }) => {
        const newUser: AdminUser = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            isActive: true,
            createdAt: new Date().toISOString().split('T')[0]
        };
        setAdminUsers([...adminUsers, newUser]);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">Manage platform configuration and preferences.</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl border border-gray-100 shadow-sm max-w-fit">
                <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
                    <span className="flex items-center gap-2">
                        <User size={16} />
                        <span className="hidden sm:inline">Profile & Account</span>
                        <span className="sm:hidden">Profile</span>
                    </span>
                </TabButton>
                <TabButton active={activeTab === 'plans'} onClick={() => setActiveTab('plans')}>
                    <span className="flex items-center gap-2">
                        <Crown size={16} />
                        <span className="hidden sm:inline">Subscription Plans</span>
                        <span className="sm:hidden">Plans</span>
                    </span>
                </TabButton>
                <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
                    <span className="flex items-center gap-2">
                        <Users size={16} />
                        <span className="hidden sm:inline">User Management</span>
                        <span className="sm:hidden">Users</span>
                    </span>
                </TabButton>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-6">
                {/* Profile & Account Tab */}
                {activeTab === 'profile' && (
                    <div className="space-y-8">
                        {/* Admin Profile */}
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <User size={20} className="text-[#7BD747]" />
                                Admin Profile
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                                    <input
                                        type="text"
                                        value={adminName}
                                        onChange={(e) => setAdminName(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7BD747] focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={adminEmail}
                                        onChange={(e) => setAdminEmail(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7BD747] focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password Change */}
                        <div className="border-t border-gray-100 pt-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Lock size={20} className="text-[#7BD747]" />
                                Change Password
                            </h2>

                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-5">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Left Column - Password Fields */}
                                    <div className="space-y-4">
                                        {/* Current Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    placeholder="Enter current password"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7BD747] focus:border-transparent outline-none transition-all pr-12 bg-white"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* New Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="Enter new password"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7BD747] focus:border-transparent outline-none transition-all pr-12 bg-white"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Confirm New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Confirm new password"
                                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7BD747] focus:border-transparent outline-none transition-all pr-12 bg-white ${confirmPassword && newPassword !== confirmPassword
                                                        ? 'border-red-300 bg-red-50/50'
                                                        : confirmPassword && newPassword === confirmPassword
                                                            ? 'border-green-300 bg-green-50/50'
                                                            : 'border-gray-200'
                                                        }`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            {confirmPassword && newPassword !== confirmPassword && (
                                                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                                                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                                    Passwords do not match
                                                </p>
                                            )}
                                            {confirmPassword && newPassword === confirmPassword && (
                                                <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                                                    <CheckCircle size={12} />
                                                    Passwords match
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column - Password Requirements */}
                                    <div className="lg:pl-6 lg:border-l border-gray-100">
                                        <div className="bg-white rounded-lg border border-gray-100 p-4">
                                            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                <Lock size={14} className="text-[#7BD747]" />
                                                Password Requirements
                                            </h3>
                                            <ul className="space-y-2">
                                                <li className={`text-sm flex items-center gap-2 ${newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${newPassword.length >= 8 ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                        {newPassword.length >= 8 ? <CheckCircle size={12} /> : '○'}
                                                    </span>
                                                    At least 8 characters
                                                </li>
                                                <li className={`text-sm flex items-center gap-2 ${/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${/[A-Z]/.test(newPassword) ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                        {/[A-Z]/.test(newPassword) ? <CheckCircle size={12} /> : '○'}
                                                    </span>
                                                    One uppercase letter
                                                </li>
                                                <li className={`text-sm flex items-center gap-2 ${/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${/[a-z]/.test(newPassword) ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                        {/[a-z]/.test(newPassword) ? <CheckCircle size={12} /> : '○'}
                                                    </span>
                                                    One lowercase letter
                                                </li>
                                                <li className={`text-sm flex items-center gap-2 ${/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${/[0-9]/.test(newPassword) ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                        {/[0-9]/.test(newPassword) ? <CheckCircle size={12} /> : '○'}
                                                    </span>
                                                    One number
                                                </li>
                                                <li className={`text-sm flex items-center gap-2 ${/[!@#$%^&*]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${/[!@#$%^&*]/.test(newPassword) ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                        {/[!@#$%^&*]/.test(newPassword) ? <CheckCircle size={12} /> : '○'}
                                                    </span>
                                                    One special character (!@#$%^&*)
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Password Strength Indicator */}
                                        {newPassword && (
                                            <div className="mt-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-medium text-gray-600">Password Strength</span>
                                                    <span className={`text-xs font-semibold ${newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) && /[0-9]/.test(newPassword) && /[!@#$%^&*]/.test(newPassword)
                                                        ? 'text-green-600'
                                                        : newPassword.length >= 8 && ((/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) || /[0-9]/.test(newPassword))
                                                            ? 'text-yellow-600'
                                                            : 'text-red-500'
                                                        }`}>
                                                        {newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) && /[0-9]/.test(newPassword) && /[!@#$%^&*]/.test(newPassword)
                                                            ? 'Strong'
                                                            : newPassword.length >= 8 && ((/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) || /[0-9]/.test(newPassword))
                                                                ? 'Medium'
                                                                : 'Weak'}
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-300 rounded-full ${newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) && /[0-9]/.test(newPassword) && /[!@#$%^&*]/.test(newPassword)
                                                            ? 'bg-green-500 w-full'
                                                            : newPassword.length >= 8 && ((/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) || /[0-9]/.test(newPassword))
                                                                ? 'bg-yellow-500 w-2/3'
                                                                : 'bg-red-400 w-1/3'
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#7BD747] text-white rounded-lg hover:bg-[#6bc43a] transition-colors font-medium shadow-sm">
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {/* Subscription Plans Tab */}
                {activeTab === 'plans' && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Crown size={20} className="text-[#7BD747]" />
                                Subscription Plans
                            </h2>
                            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
                                <span className="text-sm text-gray-600">Trial Period:</span>
                                <input
                                    type="number"
                                    value={trialDays}
                                    onChange={(e) => setTrialDays(parseInt(e.target.value) || 0)}
                                    className="w-16 px-2 py-1 border border-gray-200 rounded text-center text-sm"
                                />
                                <span className="text-sm text-gray-500">days</span>
                            </div>
                        </div>

                        {/* Plans Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className={`border rounded-xl p-5 ${plan.id === 'pro' ? 'border-[#7BD747] ring-2 ring-[#7BD747]/20' : 'border-gray-200'}`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={plan.isActive}
                                                onChange={(e) => handlePlanUpdate(plan.id, 'isActive', e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-[#7BD747]/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7BD747]"></div>
                                        </label>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Price ($/month)</label>
                                            <input
                                                type="number"
                                                value={plan.price}
                                                onChange={(e) => handlePlanUpdate(plan.id, 'price', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Max Properties</label>
                                            <input
                                                type="number"
                                                value={plan.maxProperties === -1 ? '' : plan.maxProperties}
                                                placeholder="Unlimited"
                                                onChange={(e) => handlePlanUpdate(plan.id, 'maxProperties', e.target.value === '' ? -1 : parseInt(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Max Users</label>
                                            <input
                                                type="number"
                                                value={plan.maxUsers === -1 ? '' : plan.maxUsers}
                                                placeholder="Unlimited"
                                                onChange={(e) => handlePlanUpdate(plan.id, 'maxUsers', e.target.value === '' ? -1 : parseInt(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-500 mb-2">Features:</p>
                                        <ul className="space-y-1">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                                                    <CheckCircle size={12} className="text-[#7BD747]" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pt-4">
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#7BD747] text-white rounded-lg hover:bg-[#6bc43a] transition-colors font-medium shadow-sm">
                                <Save size={18} />
                                Save Plans
                            </button>
                        </div>
                    </div>
                )}

                {/* User Management Tab */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        {/* Header with Create Button */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Users size={20} className="text-[#7BD747]" />
                                    Admin Users
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">Manage administrator accounts for the platform.</p>
                            </div>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-[#7BD747] text-white rounded-lg hover:bg-[#6bc43a] transition-colors font-medium shadow-sm"
                            >
                                <Plus size={18} />
                                Create Admin User
                            </button>
                        </div>

                        {/* Admin Users Table - Desktop */}
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hidden md:block">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-[#7BD747] border-b border-[#7BD747]">
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Created</th>
                                            <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">Active</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {adminUsers.length > 0 ? (
                                            adminUsers.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 bg-gradient-to-br from-[#7BD747] to-[#5fb835] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                                {user.name.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                            <span className="font-medium text-gray-900">{user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.isActive
                                                            ? 'bg-green-50 text-green-700 border-green-100'
                                                            : 'bg-gray-50 text-gray-600 border-gray-200'
                                                            }`}>
                                                            {user.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={user.isActive}
                                                                onChange={() => handleToggleUserStatus(user.id)}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-[#7BD747]/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7BD747]"></div>
                                                        </label>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Users size={48} className="text-gray-200 mb-4" />
                                                        <p className="text-lg font-medium text-gray-900">No admin users found</p>
                                                        <p className="text-sm text-gray-500 max-w-sm mt-1">
                                                            Create your first admin user to get started.
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Admin Users Cards - Mobile */}
                        <div className="md:hidden space-y-4">
                            {adminUsers.length > 0 ? (
                                adminUsers.map((user) => (
                                    <div key={user.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-[#7BD747] to-[#5fb835] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${user.isActive
                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                : 'bg-gray-50 text-gray-600 border-gray-200'
                                                }`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                            <span className="text-xs text-gray-400">Created {new Date(user.createdAt).toLocaleDateString()}</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={user.isActive}
                                                    onChange={() => handleToggleUserStatus(user.id)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-[#7BD747]/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7BD747]"></div>
                                            </label>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                                    <Users size={40} className="text-gray-200 mx-auto mb-3" />
                                    <p className="font-medium text-gray-900">No admin users found</p>
                                    <p className="text-sm text-gray-500 mt-1">Create your first admin user.</p>
                                </div>
                            )}
                        </div>

                        {/* Summary */}
                        <div className="flex items-center justify-between py-2 text-sm text-gray-500">
                            <span>
                                Showing <span className="font-medium text-gray-900">{adminUsers.length}</span> admin users
                            </span>
                            <span>
                                <span className="font-medium text-green-600">{adminUsers.filter(u => u.isActive).length}</span> active,
                                <span className="font-medium text-gray-600 ml-1">{adminUsers.filter(u => !u.isActive).length}</span> inactive
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Admin Modal */}
            <CreateAdminModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreateUser={handleCreateUser}
            />
        </div>
    );
};

export default SettingsPage;
