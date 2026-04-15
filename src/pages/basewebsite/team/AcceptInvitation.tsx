import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Users } from 'lucide-react';
import { useAcceptInvitation } from '../../../hooks/useTeamQueries';

const AcceptInvitation: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const acceptMutation = useAcceptInvitation();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState('');
    const [acceptedMember, setAcceptedMember] = useState<any>(null);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setErrorMsg('No invitation token found in URL');
            return;
        }

        acceptMutation.mutateAsync(token)
            .then((member) => {
                setAcceptedMember(member);
                setStatus('success');
            })
            .catch((err: any) => {
                setStatus('error');
                setErrorMsg(err?.message || 'Failed to accept invitation');
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#273F3B] to-[#3D7475] flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 sm:p-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8F0EE] mb-4">
                    <Users className="w-8 h-8 text-[#3D7475]" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Team Invitation</h1>

                {status === 'loading' && (
                    <div className="mt-8 flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-[#3D7475]" />
                        <p className="text-gray-600">Processing your invitation...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="mt-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to the team!</h2>
                        <p className="text-gray-600 text-sm mb-6">
                            You've been added as <strong>{acceptedMember?.role || 'a team member'}</strong>.
                            Log in with your existing account or sign up to start collaborating.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                to="/login"
                                className="flex-1 bg-[#3D7475] text-white py-3 rounded-lg font-medium hover:bg-[#2c5556] transition-colors"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/signup"
                                className="flex-1 bg-white border border-[#3D7475] text-[#3D7475] py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="mt-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-4">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Invitation could not be accepted</h2>
                        <p className="text-red-600 text-sm mb-6">{errorMsg}</p>
                        <p className="text-gray-500 text-xs mb-6">
                            The link may have expired or been revoked. Ask the team owner to send a new invitation.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-[#3D7475] text-white py-3 rounded-lg font-medium hover:bg-[#2c5556] transition-colors"
                        >
                            Go to Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcceptInvitation;
