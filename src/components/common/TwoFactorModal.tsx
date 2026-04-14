import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Mail } from 'lucide-react';
import { twoFactorService } from '../../services/two-factor.service';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onStatusChange?: () => void;
    currentlyEnabled: boolean;
}

/**
 * Email-OTP 2FA flow:
 *   1. Open → POST /2fa/send-code → email sent (shows masked email)
 *   2. User enters 6-digit code → POST /2fa/verify with intent enable|disable
 */
const TwoFactorModal: React.FC<Props> = ({ isOpen, onClose, onStatusChange, currentlyEnabled }) => {
    const intent: 'enable' | 'disable' = currentlyEnabled ? 'disable' : 'enable';
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setCode('');
        setError(null);
        setInfo(null);
        setMaskedEmail(null);
        // Auto-send on open
        void requestCode();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const requestCode = async () => {
        setSending(true);
        setError(null);
        try {
            const res = await twoFactorService.sendCode();
            setMaskedEmail(res.maskedEmail);
            setInfo(`Verification code sent to ${res.maskedEmail}. It expires in 5 minutes.`);
        } catch (err: any) {
            setError(err?.message || 'Failed to send code');
        } finally {
            setSending(false);
        }
    };

    const handleVerify = async () => {
        if (!/^\d{6}$/.test(code)) {
            setError('Enter the 6-digit code from your email');
            return;
        }
        setVerifying(true);
        setError(null);
        try {
            await twoFactorService.verify(code, intent);
            onStatusChange?.();
            onClose();
        } catch (err: any) {
            setError(err?.message || 'Invalid code');
        } finally {
            setVerifying(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">
                        {intent === 'enable' ? 'Enable two-factor auth' : 'Disable two-factor auth'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-800">
                            We send a 6-digit verification code to your email each time you turn 2FA on or off.
                        </p>
                    </div>

                    {info && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
                            {info}
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">6-digit code</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base tracking-[0.5em] text-center font-mono focus:outline-none focus:ring-2 focus:ring-[#7CD947]/20 focus:border-[#7CD947]"
                            placeholder="000000"
                            autoFocus
                        />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <button
                            type="button"
                            onClick={requestCode}
                            disabled={sending}
                            className="text-[#3D7475] hover:underline font-semibold disabled:opacity-50"
                        >
                            {sending ? 'Sending…' : 'Resend code'}
                        </button>
                        {maskedEmail && <span className="text-gray-500">to {maskedEmail}</span>}
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={verifying || code.length !== 6}
                        className={`w-full py-2.5 rounded-lg font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2 ${
                            intent === 'enable' ? 'bg-[#7CD947] hover:bg-[#6bc13d]' : 'bg-red-500 hover:bg-red-600'
                        }`}
                    >
                        {verifying && <Loader2 className="w-4 h-4 animate-spin" />}
                        {verifying
                            ? (intent === 'enable' ? 'Enabling…' : 'Disabling…')
                            : (intent === 'enable' ? 'Enable 2FA' : 'Disable 2FA')}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default TwoFactorModal;
