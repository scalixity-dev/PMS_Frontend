import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileText } from 'lucide-react';

interface LegalLayoutProps {
    title: string;
    subtitle?: string;
    lastUpdated: string;
    children: React.ReactNode;
}

/**
 * Shared layout for legal pages (Terms of Service, Privacy Policy, etc.)
 * Matches platform color scheme: --color-primary #3D7475, --color-navbar-bg #273F3B
 */
const LegalLayout: React.FC<LegalLayoutProps> = ({ title, subtitle, lastUpdated, children }) => {
    return (
        <div className="relative min-h-screen bg-white">
            {/* Hero */}
            <div className="bg-gradient-to-br from-[var(--color-navbar-bg)] to-[var(--color-primary)] py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                        <FileText size={14} />
                        Legal
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                    <p className="text-white/60 text-xs mt-4">
                        Last updated: {lastUpdated}
                    </p>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500">
                    <Link to="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
                    <ChevronRight size={14} className="mx-2" />
                    <span className="text-gray-800 font-medium">{title}</span>
                </nav>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <article className="prose prose-gray max-w-none legal-content">
                    {children}
                </article>

                {/* Footer CTA */}
                <div className="mt-16 bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8">
                    <h3 className="font-semibold text-gray-900 mb-2">Questions about this policy?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Contact our team at{' '}
                        <a href="mailto:legal@smarttenantai.com" className="text-[var(--color-primary)] font-medium hover:underline">
                            legal@smarttenantai.com
                        </a>
                        {' '}or write to us at our registered address.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 text-sm">
                        <Link to="/terms-of-service" className="text-[var(--color-primary)] font-medium hover:underline">Terms of Service</Link>
                        <span className="hidden sm:inline text-gray-400">·</span>
                        <Link to="/privacy-policy" className="text-[var(--color-primary)] font-medium hover:underline">Privacy Policy</Link>
                        <span className="hidden sm:inline text-gray-400">·</span>
                        <Link to="/cookie-policy" className="text-[var(--color-primary)] font-medium hover:underline">Cookie Policy</Link>
                    </div>
                </div>
            </div>

            <style>{`
                .legal-content h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--color-navbar-bg);
                    margin-top: 2.5rem;
                    margin-bottom: 1rem;
                    border-bottom: 2px solid #e5e7eb;
                    padding-bottom: 0.5rem;
                }
                .legal-content h3 {
                    font-size: 1.15rem;
                    font-weight: 600;
                    color: var(--color-primary);
                    margin-top: 1.75rem;
                    margin-bottom: 0.75rem;
                }
                .legal-content p {
                    color: #374151;
                    line-height: 1.75;
                    margin-bottom: 1rem;
                }
                .legal-content ul {
                    list-style: disc;
                    padding-left: 1.5rem;
                    margin-bottom: 1rem;
                }
                .legal-content ul li {
                    color: #374151;
                    line-height: 1.75;
                    margin-bottom: 0.5rem;
                }
                .legal-content a {
                    color: var(--color-primary);
                    text-decoration: underline;
                }
                .legal-content strong {
                    color: var(--color-navbar-bg);
                    font-weight: 600;
                }
                .legal-content .callout {
                    background: #F0F7F7;
                    border-left: 4px solid var(--color-primary);
                    padding: 1rem 1.25rem;
                    border-radius: 0.5rem;
                    margin: 1.5rem 0;
                }
            `}</style>
        </div>
    );
};

export default LegalLayout;
