import React from 'react';
import LegalLayout from './LegalLayout';

const CookiePolicy: React.FC = () => {
    return (
        <LegalLayout
            title="Cookie Policy"
            subtitle="How and why SmartTenantAI uses cookies and similar technologies"
            lastUpdated="April 15, 2026"
        >
            <div className="callout">
                <p className="!mb-0">
                    This Cookie Policy explains the cookies and similar tracking technologies used
                    on SmartTenantAI. It works alongside our{' '}
                    <a href="/privacy-policy">Privacy Policy</a>.
                </p>
            </div>

            <h2>1. What Are Cookies?</h2>
            <p>
                Cookies are small text files stored on your device when you visit a website. They
                help the site remember you, your preferences, and your login state. Similar
                technologies include local storage, session storage, and web beacons.
            </p>

            <h2>2. Cookies We Use</h2>
            <h3>2.1 Strictly Necessary (always on)</h3>
            <ul>
                <li><strong>auth_token:</strong> keeps you logged in (httpOnly, secure, 7 days)</li>
                <li><strong>device_token:</strong> recognizes trusted devices (httpOnly, secure, 90 days)</li>
                <li><strong>csrf:</strong> protects against cross-site request forgery (session)</li>
            </ul>
            <p>These cookies cannot be disabled as the Service cannot function without them.</p>

            <h3>2.2 Functional (opt-in)</h3>
            <ul>
                <li><strong>pref_*:</strong> remembers your UI preferences (theme, language, layout)</li>
                <li><strong>zustand storage:</strong> stores non-sensitive UI state (sidebar collapsed, filter selections)</li>
            </ul>

            <h3>2.3 Analytics (opt-in)</h3>
            <ul>
                <li>Anonymized page-view and feature-usage data to improve the platform</li>
                <li>Retained up to 14 months, then aggregated</li>
            </ul>

            <h3>2.4 Third-Party</h3>
            <ul>
                <li><strong>Stripe:</strong> required for payment processing (see Stripe's cookie policy)</li>
                <li><strong>Google:</strong> set only if you use Google Sign-In or Calendar integration</li>
            </ul>

            <h2>3. Managing Your Preferences</h2>
            <p>
                When you first visit the site, a consent banner lets you accept or reject
                non-essential cookies. You can change your choice anytime at{' '}
                <strong>Settings → Privacy</strong>. You can also:
            </p>
            <ul>
                <li>Block cookies in your browser settings (may break login)</li>
                <li>Use private/incognito mode for session-only cookies</li>
                <li>Send the <strong>Global Privacy Control (GPC)</strong> signal — we honor it as an opt-out of sale/sharing under CCPA</li>
            </ul>

            <h2>4. Do Not Track</h2>
            <p>
                We currently do not honor DNT headers due to the lack of an industry standard. We
                do honor GPC.
            </p>

            <h2>5. Contact</h2>
            <p>
                Questions about cookies? Email{' '}
                <a href="mailto:privacy@smarttenantai.com">privacy@smarttenantai.com</a>.
            </p>
        </LegalLayout>
    );
};

export default CookiePolicy;
