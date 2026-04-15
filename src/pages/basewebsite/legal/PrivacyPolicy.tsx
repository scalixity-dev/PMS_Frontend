import React from 'react';
import LegalLayout from './LegalLayout';

const PrivacyPolicy: React.FC = () => {
    return (
        <LegalLayout
            title="Privacy Policy"
            subtitle="How SmartTenantAI collects, uses, and protects your personal data — GDPR, CCPA, and DPDP compliant"
            lastUpdated="April 15, 2026"
        >
            <div className="callout">
                <p className="!mb-0">
                    <strong>Your privacy matters.</strong> This policy explains how we handle your
                    data. It complies with the EU General Data Protection Regulation (GDPR), the
                    California Consumer Privacy Act (CCPA/CPRA), and India's Digital Personal Data
                    Protection Act (DPDP), 2023.
                </p>
            </div>

            <h2>1. Scope & Who We Are</h2>
            <p>
                SmartTenantAI ("we", "us", "our") is the data controller for personal data
                collected via our property management platform (the "Service"). This policy
                applies to property managers, tenants, service providers, and visitors worldwide.
            </p>
            <p>
                <strong>Data Protection Officer (DPO):</strong>{' '}
                <a href="mailto:dpo@smarttenantai.com">dpo@smarttenantai.com</a>
            </p>

            <h2>2. Data We Collect</h2>
            <h3>2.1 Information You Provide</h3>
            <ul>
                <li><strong>Account data:</strong> name, email, phone, password (hashed), date of birth, role</li>
                <li><strong>Profile data:</strong> address, profile photo, identity verification documents (if requested)</li>
                <li><strong>Property data:</strong> listings, photos, descriptions, financial records, leases, applications</li>
                <li><strong>Tenant data:</strong> rental applications, background info, employment, income, references, pets, vehicles</li>
                <li><strong>Payment data:</strong> processed by our payment processor (Stripe); we store only last 4 digits and brand</li>
                <li><strong>Communications:</strong> messages, support tickets, feedback</li>
            </ul>
            <h3>2.2 Information We Collect Automatically</h3>
            <ul>
                <li><strong>Device & usage:</strong> IP address, browser, OS, device fingerprint, session duration, pages viewed</li>
                <li><strong>Cookies & similar technologies:</strong> see our <a href="/cookie-policy">Cookie Policy</a></li>
                <li><strong>Log data:</strong> API requests, error logs, security events (retained for 90 days)</li>
            </ul>
            <h3>2.3 Information From Third Parties</h3>
            <ul>
                <li>Google (if you connect your calendar or use Google Sign-In)</li>
                <li>Payment processors (transaction confirmations)</li>
                <li>Background-check providers (only if you authorize)</li>
            </ul>

            <h2>3. How We Use Your Data</h2>
            <p>We process your data on the following legal bases:</p>
            <ul>
                <li><strong>Contract:</strong> to provide the Service (account, property management, listings, payments, messaging)</li>
                <li><strong>Legitimate interests:</strong> security, fraud prevention, product improvement, analytics</li>
                <li><strong>Consent:</strong> marketing emails, non-essential cookies, optional integrations</li>
                <li><strong>Legal obligation:</strong> tax records, regulatory compliance, response to valid legal requests</li>
            </ul>

            <h2>4. Data Sharing</h2>
            <p>We do <strong>not</strong> sell your personal data. We share data only:</p>
            <ul>
                <li><strong>Within your transactions:</strong> tenant data shared with their property manager and vice versa, as needed to facilitate leasing</li>
                <li><strong>Service providers (processors):</strong> AWS (hosting), Stripe (payments), Mailgun (email), Google (calendar sync), OpenAI/Anthropic (AI features) — all under strict data processing agreements</li>
                <li><strong>Legal compliance:</strong> when required by law, court order, or to protect rights and safety</li>
                <li><strong>Business transfers:</strong> in the event of merger, acquisition, or asset sale (with notice to affected users)</li>
            </ul>

            <h2>5. International Data Transfers</h2>
            <p>
                Your data may be processed in countries outside your own (primarily the United
                States and Singapore, where our servers are hosted). For transfers from the
                EU/UK/Switzerland, we rely on:
            </p>
            <ul>
                <li>EU Standard Contractual Clauses (2021 version) with our processors</li>
                <li>Adequacy decisions where applicable</li>
                <li>Additional safeguards (encryption in transit & at rest)</li>
            </ul>

            <h2>6. Data Retention</h2>
            <ul>
                <li><strong>Active account data:</strong> retained while your account is active</li>
                <li><strong>After account closure:</strong> most data deleted within 30 days; financial records kept up to 7 years (tax law)</li>
                <li><strong>Backups:</strong> rolled forward and purged within 90 days</li>
                <li><strong>Marketing data:</strong> deleted on unsubscribe</li>
            </ul>

            <h2>7. Your Rights</h2>
            <p>You have the following rights over your personal data:</p>
            <h3>7.1 Universal Rights</h3>
            <ul>
                <li><strong>Access:</strong> request a copy of your data</li>
                <li><strong>Correction:</strong> update inaccurate info</li>
                <li><strong>Deletion:</strong> request erasure (subject to legal retention)</li>
                <li><strong>Portability:</strong> receive your data in a machine-readable format</li>
                <li><strong>Objection / restriction:</strong> object to specific processing activities</li>
            </ul>
            <h3>7.2 EU/UK (GDPR) Additional Rights</h3>
            <ul>
                <li>Right to withdraw consent at any time</li>
                <li>Right to lodge a complaint with your local supervisory authority (e.g., ICO in UK, CNIL in France)</li>
            </ul>
            <h3>7.3 California (CCPA/CPRA)</h3>
            <ul>
                <li>Right to know what personal information is collected, sold, or disclosed</li>
                <li>Right to opt out of sale/sharing (we do not sell — but you can still exercise this right)</li>
                <li>Right to limit use of sensitive personal information</li>
                <li>Right to non-discrimination for exercising these rights</li>
            </ul>
            <h3>7.4 India (DPDP Act, 2023)</h3>
            <ul>
                <li>Right to access, correct, complete, update, and erase your personal data</li>
                <li>Right to grievance redressal — contact our Grievance Officer at <a href="mailto:grievance@smarttenantai.com">grievance@smarttenantai.com</a></li>
                <li>Right to nominate another individual to exercise rights on your behalf in case of death or incapacity</li>
            </ul>
            <p>
                To exercise any right, email{' '}
                <a href="mailto:privacy@smarttenantai.com">privacy@smarttenantai.com</a> or use
                the "Download Data" / "Delete Account" options in Settings. We respond within 30
                days (45 days for complex EU requests).
            </p>

            <h2>8. Security</h2>
            <ul>
                <li>TLS 1.2+ for all data in transit</li>
                <li>Encryption at rest for databases (AES-256)</li>
                <li>Passwords hashed with argon2id</li>
                <li>Multi-factor authentication for administrators</li>
                <li>Regular security audits and penetration testing</li>
                <li>Employee access on need-to-know basis only</li>
            </ul>
            <p>
                If we detect a data breach affecting you, we will notify you and relevant
                authorities within 72 hours as required by applicable law (GDPR Article 33, state
                breach-notification laws).
            </p>

            <h2>9. Children's Privacy</h2>
            <p>
                The Service is not directed to children under 18 (or 16 in the EU, whichever is
                higher). We do not knowingly collect personal data from children. If you believe
                we have, contact us and we will delete it.
            </p>

            <h2>10. Automated Decision-Making & AI</h2>
            <p>
                SmartTenantAI uses AI models (OpenAI, Anthropic) to power features like property
                suggestions and AI chat. These systems do <strong>not</strong> make automated
                decisions that have legal or similarly significant effects on you without human
                review. You can opt out of AI-powered features in Settings.
            </p>

            <h2>11. Marketing Communications</h2>
            <p>
                We may send product updates and promotional emails only if you opt in (or where
                permitted by soft opt-in laws, to existing customers for similar products).
                Unsubscribe links are in every email. Transactional emails (account verification,
                payment receipts, security alerts) cannot be unsubscribed from.
            </p>

            <h2>12. Do Not Track / Global Privacy Control</h2>
            <p>
                We honor the Global Privacy Control (GPC) browser signal as an opt-out of sale /
                sharing under CCPA. We do not currently support Do Not Track headers as no common
                standard has been established.
            </p>

            <h2>13. Changes to This Policy</h2>
            <p>
                We may update this Privacy Policy from time to time. Material changes will be
                notified via email or in-app notice at least 30 days before taking effect. The
                "Last updated" date above reflects the most recent revision.
            </p>

            <h2>14. Contact & Grievance Officer</h2>
            <ul>
                <li><strong>General privacy:</strong> <a href="mailto:privacy@smarttenantai.com">privacy@smarttenantai.com</a></li>
                <li><strong>EU/UK Data Protection Officer:</strong> <a href="mailto:dpo@smarttenantai.com">dpo@smarttenantai.com</a></li>
                <li><strong>Indian Grievance Officer:</strong> <a href="mailto:grievance@smarttenantai.com">grievance@smarttenantai.com</a></li>
                <li><strong>California residents:</strong> <a href="mailto:ccpa@smarttenantai.com">ccpa@smarttenantai.com</a></li>
                <li><strong>Mailing:</strong> SmartTenantAI, [Registered Office Address]</li>
            </ul>
        </LegalLayout>
    );
};

export default PrivacyPolicy;
