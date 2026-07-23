import { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react';
import { useGetSigningUrl, useGetSignatureStatus } from '../../../../hooks/useDocumentsQueries';

const SignatureCeremony = () => {
  const { renderedDocumentId } = useParams<{ renderedDocumentId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const event = searchParams.get('event');

  useGetSignatureStatus(renderedDocumentId || '');
  const { mutate: fetchSigningUrl, data: signingUrlData, isPending, error } = useGetSigningUrl();

  useEffect(() => {
    // Once DocuSign redirects back here with an ?event=, don't fetch a new
    // (already-consumed) signing URL — just show the completion screen below.
    if (!renderedDocumentId || event) return;
    const returnUrl = `${window.location.origin}/userdashboard/documents/${renderedDocumentId}/signature`;
    fetchSigningUrl({ renderedDocumentId, returnUrl });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderedDocumentId, event]);

  if (event) {
    const isSuccess = event === 'signing_complete';
    const isDeclined = event === 'decline';

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
        {isSuccess ? (
          <>
            <CheckCircle2 size={48} className="text-green-600" />
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Document signed</h2>
            <p className="text-gray-500 max-w-md">
              Thanks for signing. Your property manager will be notified once DocuSign confirms the completed document.
            </p>
          </>
        ) : isDeclined ? (
          <>
            <XCircle size={48} className="text-red-600" />
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Signature declined</h2>
            <p className="text-gray-500 max-w-md">You declined to sign this document. Your property manager has been notified.</p>
          </>
        ) : (
          <>
            <AlertTriangle size={48} className="text-yellow-600" />
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Signing session ended</h2>
            <p className="text-gray-500 max-w-md">The signing session ended before completion ({event}). You can try again from your lease documents.</p>
          </>
        )}
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-[#3A6D6C] text-white rounded-lg text-sm font-medium hover:bg-[#2a5251] transition-colors"
        >
          Back to lease
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
        <AlertTriangle size={48} className="text-red-600" />
        <p className="text-gray-600 max-w-md">{(error as Error).message || 'Unable to start the signing session.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-[#3A6D6C] text-white rounded-lg text-sm font-medium hover:bg-[#2a5251] transition-colors"
        >
          Back
        </button>
      </div>
    );
  }

  if (isPending || !signingUrlData?.url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="animate-spin text-[#3A6D6C]" size={32} />
        <p className="text-gray-500">Preparing your document for signing…</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full h-full max-w-5xl bg-white rounded-xl overflow-hidden shadow-2xl">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow transition-colors"
          title="Close"
        >
          <X size={20} />
        </button>
        <iframe src={signingUrlData.url} className="w-full h-full border-0" title="Sign document" />
      </div>
    </div>
  );
};

export default SignatureCeremony;
