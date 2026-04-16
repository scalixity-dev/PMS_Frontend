// Multi-account registry for "Add Another Account" + account switcher.
// Stores metadata only (never passwords/tokens). Browser cookie remains
// authoritative for which account is "currently signed in".

export interface RememberedAccount {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
  lastLoginAt: string;
}

const STORAGE_KEY = 'pms_remembered_accounts';
const MAX_ACCOUNTS = 5;

function safeRead(): RememberedAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWrite(accounts: RememberedAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch {
    /* storage full / disabled — non-critical */
  }
}

export const rememberedAccountsStore = {
  list(): RememberedAccount[] {
    return safeRead();
  },

  /**
   * Insert or update an account entry. Move to front on re-login.
   */
  upsert(account: Omit<RememberedAccount, 'lastLoginAt'>): RememberedAccount[] {
    if (!account.userId || !account.email) return safeRead();
    const now = new Date().toISOString();
    const existing = safeRead().filter((a) => a.userId !== account.userId);
    const next: RememberedAccount[] = [
      { ...account, lastLoginAt: now },
      ...existing,
    ].slice(0, MAX_ACCOUNTS);
    safeWrite(next);
    return next;
  },

  /**
   * Remove a single account (e.g. user clicks "Remove" on chooser).
   */
  remove(userId: string): RememberedAccount[] {
    const next = safeRead().filter((a) => a.userId !== userId);
    safeWrite(next);
    return next;
  },

  /**
   * Clear all (e.g. user explicitly logs out "from all accounts").
   */
  clearAll(): void {
    safeWrite([]);
  },

  /**
   * Find a remembered entry by email (case-insensitive). Used by /login
   * to prefill when user returns via Add Another Account flow.
   */
  findByEmail(email: string): RememberedAccount | undefined {
    const target = email.trim().toLowerCase();
    return safeRead().find((a) => a.email.toLowerCase() === target);
  },
};
