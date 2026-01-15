import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

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
        <nav className={`flex items-center text-sm font-medium ${className}`} aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="flex items-center">
                            {index > 0 && (
                                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                            )}
                            {isLast ? (
                                <span className="text-gray-900 font-semibold" aria-current="page">
                                    {item.label}
                                </span>
                            ) : item.path ? (
                                <Link
                                    to={item.path}
                                    className="text-gray-500 hover:text-gray-900 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-gray-500">
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
