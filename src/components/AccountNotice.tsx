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

const AccountNotice: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const existing = params.get('accountExists');
    if (!existing) return;

    setRole(existing);

    // Strip the parameter but keep everything else, so a refresh does not
    // replay the message and the URL stays clean if it gets shared.
    params.delete('accountExists');
    const query = params.toString();
    navigate(`${location.pathname}${query ? `?${query}` : ''}`, {
      replace: true,
    });
  }, [location.pathname, location.search, navigate]);

  // Long enough to read, short enough not to sit on the dashboard.
  useEffect(() => {
    if (!role) return;
    const timer = setTimeout(() => setRole(null), 10000);
    return () => clearTimeout(timer);
  }, [role]);

  if (!role) return null;

  const label = ROLE_LABELS[role.toUpperCase()] ?? 'a different account type';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 left-1/2 z-[100] w-[92%] max-w-xl -translate-x-1/2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="mt-0.5 text-lg leading-none">
          ℹ️
        </span>
        <p className="flex-1 text-sm text-amber-900">
          This email is already registered as a{' '}
          <span className="font-semibold">{label}</span>, so we signed you in to
          that account. To use a different account type, sign up with another
          email address.
        </p>
        <button
          type="button"
          onClick={() => setRole(null)}
          aria-label="Dismiss"
          className="ml-1 shrink-0 rounded px-2 text-lg leading-none text-amber-900 hover:bg-amber-100"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default AccountNotice;
