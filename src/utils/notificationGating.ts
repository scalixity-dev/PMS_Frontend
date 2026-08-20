export type NotificationSettingsState = {
  emailNotification: boolean;
  moreActivity: boolean;
  newsAndUpdates: boolean;
  notificationChannel: boolean;
  feedbackNotification: boolean;
  integrationAlert: boolean;
};

export type NotificationSettingKey = keyof NotificationSettingsState;

/**
 * Which master switch each dependent setting hangs off.
 *
 * Deliberately shallow: no entry here is itself a master, so a control is
 * either a master or hangs off exactly one, and the UI never has to explain a
 * chain of two disabled parents.
 *
 * `notificationChannel` is absent on purpose. The backend uses it as the push
 * master (push-token.service.ts) while `emailNotification` gates email
 * delivery (notification.service.ts). They are separate channels, so hanging
 * push off the email switch would leave push unreachable for anyone who turned
 * email off.
 */
export const SETTING_MASTER: Partial<
  Record<NotificationSettingKey, NotificationSettingKey>
> = {
  newsAndUpdates: 'emailNotification',
  feedbackNotification: 'emailNotification',
  integrationAlert: 'moreActivity',
};

const MASTER_LABEL: Record<string, string> = {
  emailNotification: 'Email Notification',
  moreActivity: 'More Activity',
};

/**
 * Whether a setting cannot be edited because its master switch is off.
 *
 * Locked means "editing this changes nothing right now", not "cleared". The
 * stored value is left alone, so the user's choice comes back when the master
 * is switched on again.
 */
export function isSettingLocked(
  key: NotificationSettingKey,
  state: NotificationSettingsState,
): boolean {
  const master = SETTING_MASTER[key];
  if (!master) return false;
  return state[master] === false;
}

/** Why a setting is locked, for the tooltip and the screen reader. */
export function lockedReason(key: NotificationSettingKey): string | undefined {
  const master = SETTING_MASTER[key];
  if (!master) return undefined;
  return `Turn on ${MASTER_LABEL[master] ?? master} to change this`;
}
