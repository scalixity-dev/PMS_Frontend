import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  isSettingLocked,
  lockedReason,
  SETTING_MASTER,
  type NotificationSettingsState,
} from '../src/utils/notificationGating.ts';

/**
 * Master switches did not actually gate anything.
 *
 * Both settings pages describe a master switch in their own copy ("Master
 * switch for all email-based notifications"), but every dependent checkbox
 * stayed clickable with the master off. So a user could turn email off, tick
 * "News and update settings", and be left with no idea which one wins.
 *
 * The gating has to stay honest about what the API really does. The backend
 * only consults emailNotification for email delivery and notificationChannel
 * for push, and those two are independent channels: turning email off must
 * never lock the push switch.
 */
const allOn: NotificationSettingsState = {
  emailNotification: true,
  moreActivity: true,
  newsAndUpdates: true,
  notificationChannel: true,
  feedbackNotification: true,
  integrationAlert: true,
};

describe('isSettingLocked', () => {
  test('nothing is locked while every master is on', () => {
    for (const key of Object.keys(allOn) as Array<keyof NotificationSettingsState>) {
      assert.equal(isSettingLocked(key, allOn), false, `${key} should be unlocked`);
    }
  });

  test('email master off locks the email-only preferences', () => {
    // The reported bug: these stayed clickable.
    const state = { ...allOn, emailNotification: false };

    assert.equal(isSettingLocked('newsAndUpdates', state), true);
    assert.equal(isSettingLocked('feedbackNotification', state), true);
  });

  test('email master off leaves the push channel alone', () => {
    // notificationChannel is the push switch on the backend. Locking it behind
    // the email master would make push unreachable for anyone on email-off.
    const state = { ...allOn, emailNotification: false };

    assert.equal(isSettingLocked('notificationChannel', state), false);
  });

  test('more activity off locks the integration alert under it', () => {
    const state = { ...allOn, moreActivity: false };

    assert.equal(isSettingLocked('integrationAlert', state), true);
    // ...and nothing in the email group, which hangs off a different master.
    assert.equal(isSettingLocked('newsAndUpdates', state), false);
  });

  test('a master is never locked by its own value', () => {
    const off = {
      ...allOn,
      emailNotification: false,
      moreActivity: false,
      notificationChannel: false,
    };

    assert.equal(isSettingLocked('emailNotification', off), false, 'must stay switchable back on');
    assert.equal(isSettingLocked('moreActivity', off), false);
  });

  test('locking hides nothing and changes no stored value', () => {
    // Locked means "cannot be edited right now", not "cleared". The user's
    // choice has to survive turning the master off and back on.
    const state = { ...allOn, emailNotification: false, newsAndUpdates: true };

    assert.equal(isSettingLocked('newsAndUpdates', state), true);
    assert.equal(state.newsAndUpdates, true, 'value is untouched');
  });
});

describe('SETTING_MASTER', () => {
  test('every dependent points at a real setting', () => {
    for (const [dependent, master] of Object.entries(SETTING_MASTER)) {
      assert.ok(master in allOn, `${dependent} points at unknown master ${master}`);
      assert.notEqual(dependent, master, 'a setting cannot be its own master');
    }
  });

  test('no master is itself a dependent, so there are no gating chains', () => {
    const masters = new Set(Object.values(SETTING_MASTER));
    for (const master of masters) {
      assert.ok(
        !(master in SETTING_MASTER),
        `${master} is both a master and a dependent, which makes the UI unpredictable`,
      );
    }
  });
});

describe('lockedReason', () => {
  test('names the switch the user has to turn back on', () => {
    assert.match(lockedReason('newsAndUpdates')!, /email/i);
    assert.match(lockedReason('integrationAlert')!, /more activity/i);
  });

  test('is absent for a setting that has no master', () => {
    assert.equal(lockedReason('emailNotification'), undefined);
  });
});
