import React from 'react';
import { Mail, Phone, Calendar, Shield, Ban, Lock, Pencil } from 'lucide-react';

interface UserHeaderProps {
    user: {
        name: string;
        email: string;
        phone: string;
        role: string;
        status: string;
        joinedDate: string;
        avatar?: string;
    };
}

const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'Tenant': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'Property Manager': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'Service Pro': return 'bg-orange-50 text-orange-700 border-orange-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-50 text-green-700 border-green-100';
            case 'Blocked': return 'bg-red-50 text-red-700 border-red-100';
            case 'Inactive': return 'bg-gray-50 text-gray-700 border-gray-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex items-start gap-6">
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-3xl font-bold border-4 border-white shadow-sm">
                        {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" /> : user.name.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                                {user.role}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(user.status)}`}>
                                {user.status}
                            </span>
                        </div>

                        <div className="space-y-1 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Mail size={16} />
                                {user.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={16} />
                                {user.phone}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                Joined {new Date(user.joinedDate).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        <Pencil size={16} />
                        Edit Profile
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        <Lock size={16} />
                        Reset Password
                    </button>
                    {user.status !== 'Blocked' ? (
                        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                            <Ban size={16} />
                            Block User
                        </button>
                    ) : (
                        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-green-200 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium">
                            <Shield size={16} />
                            Unblock User
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserHeader;
