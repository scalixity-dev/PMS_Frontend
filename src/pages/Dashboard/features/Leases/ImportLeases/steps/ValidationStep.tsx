import React, { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import CustomCheckbox from '../../../../../../components/ui/CustomCheckbox';

interface ValidationError {
    row: number;
    error: string;
}

interface ValidationStepProps {
    errors: ValidationError[];
    importResult?: {
        total: number;
        successful: number;
        failed: number;
        jobId: string | null;
        message: string;
    } | null;
}

const ValidationStep: React.FC<ValidationStepProps> = ({ errors, importResult }) => {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    // Show summary if import result is available
    const hasErrors = errors.length > 0;

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(errors.map(e => e.row));
        } else {
            setSelectedRows([]);
        }
    };

    const handleToggleRow = (row: number) => {
        if (selectedRows.includes(row)) {
            setSelectedRows(prev => prev.filter(rowId => rowId !== row));
        } else {
            setSelectedRows(prev => [...prev, row]);
        }
    };

    const isAllSelected = errors.length > 0 && selectedRows.length === errors.length;

    return (
        <div className="w-full max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                {hasErrors ? 'Validation Results' : 'Import Complete'}
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                {hasErrors
                    ? 'Some leases have validation errors. Leases without errors have been queued for import.'
                    : importResult
                        ? `Successfully queued ${importResult.successful} ${importResult.successful === 1 ? 'lease' : 'leases'} for import.`
                        : 'Your leases have been processed.'
                }
                {' '}
                <a href="#" className="text-[#3A6D6C] font-semibold hover:underline">Learn more</a>
            </p>

            {importResult && (
                <div className="mb-6 flex justify-center gap-4">
                    <div className="bg-[#E3EBDE] px-4 py-2 rounded-lg">
                        <span className="text-sm font-medium text-[#3A6D6C]">
                            Total: <strong>{importResult.total}</strong>
                        </span>
                    </div>
                    <div className="bg-[#E3EBDE] px-4 py-2 rounded-lg">
                        <span className="text-sm font-medium text-[#3A6D6C]">
                            Queued: <strong className="text-[#7BD747]">{importResult.successful}</strong>
                        </span>
                    </div>
                    {hasErrors && (
                        <div className="bg-[#fee2e2] px-4 py-2 rounded-lg">
                            <span className="text-sm font-medium text-[#991b1b]">
                                Errors: <strong className="text-red-600">{importResult.failed}</strong>
                            </span>
                        </div>
                    )}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#3A6D6C] px-6 py-4 grid grid-cols-[50px_80px_1fr] gap-4 items-center">
                    <div className="flex items-center justify-center">
                        <CustomCheckbox
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            className=""
                        />
                    </div>
                    <span className="text-lg font-semibold text-white">Row #</span>
                    <span className="text-white font-medium">Error Message</span>
                </div>

                <div className="bg-[#F3F4F6] p-4 space-y-3 max-h-[500px] overflow-y-auto">
                    {errors.length === 0 ? (
                        <div className="bg-white rounded-lg p-6 text-center">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-[#7BD747] flex items-center justify-center">
                                    <Check className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-lg font-semibold text-gray-800">No validation errors found!</p>
                            <p className="text-gray-600 mt-2">All leases are ready to import.</p>
                        </div>
                    ) : (
                        errors.map((error) => (
                            <div key={error.row} className="bg-white rounded-lg p-4 grid grid-cols-[50px_80px_1fr] gap-4 items-start shadow-sm">
                                <div className="flex items-center justify-center pt-1">
                                    <button
                                        onClick={() => handleToggleRow(error.row)}
                                        className="flex items-center justify-center"
                                    >
                                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedRows.includes(error.row) ? 'bg-[#7BD747]' : 'bg-gray-200'}`}>
                                            {selectedRows.includes(error.row) && <Check className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                    </button>
                                </div>
                                <span className="text-gray-800 font-medium pt-1">{error.row}</span>
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <span className="text-red-600 text-sm">{error.error}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {errors.length > 0 && (
                    <div className="bg-yellow-50 border-t border-yellow-200 px-6 py-4">
                        <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> Leases with errors will be skipped during import.
                            Please fix the errors in your Excel file and re-upload, or proceed to import the valid leases.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ValidationStep;
