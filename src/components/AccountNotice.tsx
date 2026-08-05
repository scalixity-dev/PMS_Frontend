import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Explains why you were signed in as something other than what you picked.
 *
 * Choosing "Tenant" on the signup page and then signing in with a Google
 * address that already belongs to a property manager signs you in as the
 * property manager. That is deliberate: a role is only ever set when the
 * account is created, so there is no way to change one. But it used to happen
 * in silence, and you landed in the manager experience with no idea why.
 *
 * The backend appends `accountExists=<ROLE>` to the redirect when a signup role
 * was requested, the account already existed, and the two disagree. This reads
 * that, says so, and takes the parameter back out of the URL so a refresh or a
 * shared link does not show the message again.
 */

const ROLE_LABELS: Record<string, string> = {
  PROPERTY_MANAGER: 'Property Manager',
  TENANT: 'Tenant',
  SERVICE_PRO: 'Service Professional',
};

/** Long enough to read twice, short enough not to camp on the dashboard. */
const VISIBLE_MS = 10000;
/** Matches the leave transition below, so the node unmounts after it plays. */
const EXIT_MS = 200;

const AccountNotice: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const existing = params.get('accountExists');
    if (!existing) return;

    setRole(existing);
    // Next frame, so the element mounts in its "from" state and the transition
    // actually runs instead of the browser collapsing it into the first paint.
    requestAnimationFrame(() => setShown(true));

    // Strip the parameter but keep everything else, so a refresh does not
    // replay the message and the URL stays clean if it gets shared.
    params.delete('accountExists');
    const query = params.toString();
    navigate(`${location.pathname}${query ? `?${query}` : ''}`, {
      replace: true,
    });
  }, [location.pathname, location.search, navigate]);

  const dismiss = () => {
    setShown(false);
    setTimeout(() => setRole(null), EXIT_MS);
  };

  useEffect(() => {
    if (!role) return;
    const timer = setTimeout(dismiss, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [role]);

  if (!role) return null;

  const label = ROLE_LABELS[role.toUpperCase()] ?? 'a different account type';

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'fixed top-5 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-md -translate-x-1/2',
        'transition-all duration-200 ease-out motion-reduce:transition-none',
        shown ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0',
      ].join(' ')}
    >
      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">
            Signed in to your existing account
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            This email is already registered as a{' '}
            <span className="font-medium text-slate-900">{label}</span>. To use
            a different account type, sign up with another email address.
          </p>
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="-mr-1 -mt-1 shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AccountNotice;
