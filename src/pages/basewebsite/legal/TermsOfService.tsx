import React from 'react';
import LegalLayout from './LegalLayout';

const TermsOfService: React.FC = () => {
    return (
        <LegalLayout
            title="Terms of Service"
            subtitle="The agreement between you and SmartTenantAI governing your use of our platform"
            lastUpdated="April 15, 2026"
        >
            <div className="callout">
                <p className="!mb-0">
                    <strong>Please read carefully.</strong> By accessing or using SmartTenantAI
                    (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If
                    you disagree with any part of these Terms, you may not use the Service.
                </p>
            </div>

            <h2>1. Who We Are</h2>
            <p>
                SmartTenantAI ("we", "us", "our", or the "Company") is a property management
                software platform providing tools for property managers, landlords, tenants, and
                service providers. Our registered operating entity and contact information are
                listed at the bottom of this document.
            </p>

            <h2>2. Eligibility & Account Registration</h2>
            <p>
                You must be at least 18 years old and capable of entering into a binding contract
                to use SmartTenantAI. By registering, you represent that:
            </p>
            <ul>
                <li>All information you provide is accurate and kept current</li>
                <li>You have the legal authority to accept these Terms on behalf of yourself or your organization</li>
                <li>You will safeguard your credentials and notify us immediately of unauthorized access</li>
                <li>You are not a person or entity barred from using the Service under applicable law</li>
            </ul>

            <h2>3. Roles on the Platform</h2>
            <h3>3.1 Property Managers / Landlords</h3>
            <p>
                You are responsible for the accuracy and legality of property listings, lease
                terms, and tenant communications you create on the Service. You retain ownership
                of your content.
            </p>
            <h3>3.2 Tenants</h3>
            <p>
                You may use the Service to browse properties, submit applications, make payments,
                and communicate with your property manager. You are responsible for the accuracy
                of information you submit.
            </p>
            <h3>3.3 Service Providers</h3>
            <p>
                You represent that you are qualified and licensed (where required) to perform
                services you list on the Service, and you are solely responsible for the quality
                and legality of such services.
            </p>

            <h2>4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
                <li>Violate any applicable law or regulation (including fair housing, anti-discrimination, consumer protection, and tenancy laws)</li>
                <li>Post false, misleading, or fraudulent listings or applications</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to gain unauthorized access, probe, scan, or test system vulnerabilities</li>
                <li>Use the Service to send spam or unsolicited communications</li>
                <li>Scrape, reverse engineer, or resell the Service without written permission</li>
                <li>Upload malicious code or content that infringes third-party rights</li>
            </ul>

            <h2>5. Fair Housing & Anti-Discrimination</h2>
            <p>
                You agree to comply with all applicable fair housing laws — including the U.S.
                Fair Housing Act, state/local equivalents, and anti-discrimination protections in
                India (Constitution Art. 15) and the EU (Charter of Fundamental Rights). You may
                not use the Service to discriminate based on race, color, national origin,
                religion, sex (including gender identity and sexual orientation), familial status,
                disability, caste, or any other protected characteristic.
            </p>

            <h2>6. Fees, Payments & Subscriptions</h2>
            <p>
                Paid plans are billed in advance on a recurring basis (monthly or annually). You
                authorize us to charge your designated payment method. Fees are non-refundable
                except where required by law. Taxes (GST, VAT, sales tax) are added where
                applicable based on your billing location.
            </p>
            <p>
                You can cancel at any time from your account settings. Cancellation takes effect
                at the end of the current billing period. Rent and service-provider payments
                processed through the platform are subject to third-party payment processor terms
                (e.g., Stripe).
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
                The Service — including all software, logos, text, designs, and documentation — is
                owned by SmartTenantAI or our licensors and protected by copyright, trademark, and
                other laws. We grant you a limited, non-exclusive, non-transferable license to use
                the Service solely as permitted by these Terms.
            </p>
            <p>
                You retain ownership of content you upload (property photos, descriptions,
                documents). By uploading, you grant us a worldwide, royalty-free license to store,
                display, and transmit that content solely to operate the Service.
            </p>

            <h2>8. Third-Party Services</h2>
            <p>
                The Service integrates with third parties (Google Calendar, Stripe, AWS, Mailgun,
                etc.). Your use of those services is governed by their own terms. We are not
                responsible for third-party availability, accuracy, or liability.
            </p>

            <h2>9. Termination</h2>
            <p>
                We may suspend or terminate your account at any time for breach of these Terms,
                illegal activity, or non-payment. You may delete your account at any time from
                settings. Upon termination, your right to use the Service ends immediately;
                provisions that by nature survive (IP, payment obligations, limits of liability,
                dispute resolution) will remain in effect.
            </p>

            <h2>10. Disclaimers</h2>
            <p>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
                EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                AND NON-INFRINGEMENT. We do not warrant that the Service will be uninterrupted,
                error-free, or free of harmful components.
            </p>

            <h2>11. Limitation of Liability</h2>
            <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, SMARTTENANTAI AND ITS AFFILIATES WILL NOT
                BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
                DAMAGES, INCLUDING LOST PROFITS, LOST DATA, OR LOSS OF GOODWILL. Our aggregate
                liability will not exceed the greater of (a) the fees you paid in the 12 months
                preceding the claim, or (b) USD 100.
            </p>
            <p>
                Some jurisdictions (e.g., parts of the EU) do not allow exclusion of certain
                warranties or limitation of liability — in those jurisdictions, our liability is
                limited to the greatest extent permitted by law.
            </p>

            <h2>12. Indemnification</h2>
            <p>
                You agree to indemnify and hold SmartTenantAI harmless from any claim, loss, or
                demand (including reasonable attorney fees) arising from your use of the Service,
                your content, or your violation of these Terms or applicable law.
            </p>

            <h2>13. Governing Law & Dispute Resolution</h2>
            <p>
                <strong>For users in the United States:</strong> these Terms are governed by the
                laws of the State of Delaware, without regard to conflict of laws principles.
                Disputes will be resolved exclusively in the state or federal courts located in
                Delaware, except that either party may seek injunctive relief in any competent
                jurisdiction.
            </p>
            <p>
                <strong>For users in India:</strong> these Terms are governed by the laws of
                India, with exclusive jurisdiction in the courts of Bengaluru, Karnataka.
            </p>
            <p>
                <strong>For users in the European Economic Area, UK, or Switzerland:</strong>
                these Terms are governed by the laws of the country where you reside. You may
                bring proceedings in the courts of that country. Nothing in this clause affects
                your statutory consumer rights.
            </p>

            <h2>14. Changes to These Terms</h2>
            <p>
                We may update these Terms from time to time. Material changes will be notified via
                email or in-app notice at least 30 days before taking effect. Continued use after
                changes constitutes acceptance.
            </p>

            <h2>15. Contact</h2>
            <p>
                Questions, notices, or legal correspondence:
            </p>
            <ul>
                <li><strong>Email:</strong> legal@smarttenantai.com</li>
                <li><strong>Support:</strong> support@smarttenantai.com</li>
                <li><strong>Data Protection Officer (EU/UK):</strong> dpo@smarttenantai.com</li>
                <li><strong>Mailing address:</strong> SmartTenantAI, [Registered Office Address]</li>
            </ul>
        </LegalLayout>
    );
};

export default TermsOfService;
