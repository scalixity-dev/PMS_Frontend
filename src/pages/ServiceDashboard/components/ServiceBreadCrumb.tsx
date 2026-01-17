import React from 'react';
import { Link } from 'react-router-dom';

interface BreadCrumbItem {
    label: string;
    to?: string;
    active?: boolean;
}

interface ServiceBreadCrumbProps {
    items: BreadCrumbItem[];
}

const ServiceBreadCrumb: React.FC<ServiceBreadCrumbProps> = ({ items }) => {
    return (
        <div className="text-sm text-black font-semibold mb-4">
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 && <span className="mx-1">/</span>}
                    {item.to ? (
                        <Link to={item.to} className="text-[#8BDC5E]">
                            {item.label}
                        </Link>
                    ) : (
                        item.active
                            ? <span className="text-gray-900">{item.label}</span>
                            : <span className="text-[#8BDC5E]">{item.label}</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default ServiceBreadCrumb;
