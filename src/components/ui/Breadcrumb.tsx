import React from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
    return (
        <nav
            className={`inline-flex items-center px-6 py-2 bg-[#DFE5E3] rounded-full shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)] ${className}`}
            aria-label="Breadcrumb"
        >
            <ol className="flex items-center">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="flex items-center">
                            {index > 0 && (
                                <span className="text-gray-500 text-sm mx-2">/</span>
                            )}
                            {isLast ? (
                                <span
                                    className="text-[#1a2b4b] text-sm font-semibold"
                                    aria-current="page"
                                >
                                    {item.label}
                                </span>
                            ) : item.path ? (
                                <Link
                                    to={item.path}
                                    className="text-[#4ad1a6] text-sm font-semibold cursor-pointer hover:underline"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-[#4ad1a6] text-sm font-semibold">
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
