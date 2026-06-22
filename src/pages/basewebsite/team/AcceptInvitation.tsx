import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Loader2, XCircle, CheckCircle, Users } from 'lucide-react';
import { useGetInvitation, useAcceptInvitation } from '../../../hooks/useTeamQueries';

const AcceptInvitation: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const { data: invite, isLoading: isLoadingInvite, error: inviteError } = useGetInvitation(token);
    const acceptMutation = useAcceptInvitation();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError('');

        if (password.length < 8) {
            setValidationError('Password must be at least 8 characters');
            return;
        }
        if (password !== confirmPassword) {
            setValidationError('Passwords do not match');
            return;
        }

        try {
            await acceptMutation.mutateAsync({ token: token!, password });
            setSuccess(true);
        } catch (err: any) {
            setValidationError(err?.message || 'Failed to set password');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#273F3B] to-[#3D7475] flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 sm:p-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8F0EE] mb-4">
                        <Users className="w-8 h-8 text-[#3D7475]" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Team Invitation</h1>
                </div>

                {/* No token */}
                {!token && (
                    <div className="text-center">
                        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                        <p className="text-red-600 text-sm">No invitation token found in URL.</p>
                        <button onClick={() => navigate('/')} className="mt-4 w-full bg-[#3D7475] text-white py-3 rounded-lg font-medium hover:bg-[#2c5556] transition-colors">
                            Go to Home
                        </button>
                    </div>
                )}

                {/* Loading invite info */}
                {token && isLoadingInvite && (
                    <div className="flex flex-col items-center gap-3 py-8">
                        <Loader2 className="w-10 h-10 animate-spin text-[#3D7475]" />
                        <p className="text-gray-500 text-sm">Verifying invitation...</p>
                    </div>
                )}

                {/* Invalid/expired invite */}
                {token && inviteError && (
                    <div className="text-center">
                        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Invitation Invalid</h2>
                        <p className="text-red-600 text-sm mb-2">{(inviteError as any)?.message || 'This invitation link is invalid or has expired.'}</p>
                        <p className="text-gray-400 text-xs mb-6">Ask the team owner to send a new invitation.</p>
                        <button onClick={() => navigate('/')} className="w-full bg-[#3D7475] text-white py-3 rounded-lg font-medium hover:bg-[#2c5556] transition-colors">
                            Go to Home
                        </button>
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">You're all set!</h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Your account is active. Log in to start working with your team.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-[#3D7475] text-white py-3 rounded-lg font-semibold hover:bg-[#2c5556] transition-colors"
                        >
                            Go to Login
                        </button>
                    </div>
                )}

                {/* Set Password Form */}
                {token && invite && !success && (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <p className="text-sm text-gray-600 mb-5">
                                You've been invited to join as <span className="font-semibold text-[#3D7475]">{invite.role}</span>. Set a password to activate your account.
                            </p>

                            <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                            <input
                                type="email"
                                value={invite.email}
                                readOnly
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 8 characters"
                                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#3D7475] transition-colors"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat your password"
                                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#3D7475] transition-colors"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {validationError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                                {validationError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={acceptMutation.isPending}
                            className="w-full bg-[#3D7475] text-white py-3 rounded-lg font-semibold hover:bg-[#2c5556] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {acceptMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            {acceptMutation.isPending ? 'Creating account...' : 'Create Account & Join Team'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AcceptInvitation;
