import { useEffect, useRef, useState } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import { useGetSigningUrl } from '../../../../../hooks/useDocumentsQueries';

interface LandlordSigningModalProps {
  renderedDocumentId: string;
  onClose: () => void;
  onComplete: (event: string) => void;
}

// Marker path only — never actually rendered. We detect the iframe navigating
// back to this same-origin URL (readable cross-frame once same-origin) and
// intercept before its content would show, so this doesn't need a real route.
const RETURN_MARKER_PATH = '/dashboard/leasing/__docusign-return__';

export const LandlordSigningModal = ({ renderedDocumentId, onClose, onComplete }: LandlordSigningModalProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [handled, setHandled] = useState(false);
  const { mutate: fetchSigningUrl, data, isPending, error } = useGetSigningUrl();

  useEffect(() => {
    const returnUrl = `${window.location.origin}${RETURN_MARKER_PATH}`;
    fetchSigningUrl({ renderedDocumentId, returnUrl });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderedDocumentId]);

  useEffect(() => {
    if (!data?.url || handled) return;

    const interval = setInterval(() => {
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      let href: string;
      try {
        href = win.location.href;
      } catch {
        return; // still on DocuSign's cross-origin domain — expected while signing
      }
      if (href.includes(RETURN_MARKER_PATH)) {
        setHandled(true);
        clearInterval(interval);
        const event = new URL(href).searchParams.get('event') || 'unknown';
        onComplete(event);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [data?.url, handled, onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full h-full max-w-5xl bg-white rounded-xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow transition-colors"
          title="Close"
        >
          <X size={20} />
        </button>

        {error ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
            <AlertTriangle size={40} className="text-red-600" />
            <p className="text-gray-600 max-w-md">{(error as Error).message || 'Unable to start the signing session.'}</p>
          </div>
        ) : isPending || !data?.url ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 className="animate-spin text-[#3A6D6C]" size={32} />
            <p className="text-gray-500">Preparing the document for your signature…</p>
          </div>
        ) : (
          <iframe ref={iframeRef} src={data.url} className="w-full h-full border-0" title="Sign document" />
        )}
      </div>
    </div>
  );
};
