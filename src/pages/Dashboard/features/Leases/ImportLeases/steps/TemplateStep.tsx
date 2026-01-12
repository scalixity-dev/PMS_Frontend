import React from 'react';
// We might need a generateLeaseImportTemplate utility similar to properties
// import { generateLeaseImportTemplate } from '../utils/generateExcelTemplate';

const TemplateStep: React.FC = () => {
    const handleDownload = () => {
        try {
            // Placeholder for now
            alert('Template download for Leases coming soon!');
            // generateLeaseImportTemplate();
        } catch (error) {
            console.error('Error generating template:', error);
            alert('Failed to generate template. Please try again.');
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Before You Start</h2>
            <p className="text-center text-gray-600 mb-8">
                Your data must be in a specific format for the system in order to import it correctly.{' '}
                <a href="#" className="text-[#3A6D6C] font-semibold hover:underline">Learn more</a>
            </p>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#3A6D6C] px-6 py-4">
                    <h3 className="text-lg font-semibold text-white">Download an example</h3>
                </div>
                <div className="p-8 bg-[#F3F4F6]">
                    <p className="text-gray-600 mb-6">
                        Use this example to organize the data accordingly before importing your leases to the system.
                        <br />
                        Allowed extensions: .xls, .xlsx (Excel files only)
                        <br />
                        <span className="text-sm text-gray-500">
                            Maximum file size: 10MB
                        </span>
                    </p>

                    <button
                        onClick={handleDownload}
                        className="px-6 py-2 bg-[#447D7C] text-white font-medium rounded-md hover:bg-[#325c5b] transition-colors shadow-sm"
                    >
                        Download an example
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TemplateStep;
