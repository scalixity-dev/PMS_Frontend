import React from 'react';
import { Edit2, Trash2, Loader2 } from 'lucide-react';
import SectionHeader from './SectionHeader';
import AddInsuranceModal from './AddInsuranceModal';
import AddLoanModal from './AddLoanModal';
import { useState } from 'react';
import { useCreatePropertyInsurance, useCreatePropertyLoan, useGetPropertyFinancials } from '../../../../../hooks/usePropertyDetailQueries';

interface FinancialsTabProps {
    propertyId: string;
    unitId?: string;
}

const FinancialsTab: React.FC<FinancialsTabProps> = ({ propertyId, unitId }) => {
    const [isAddInsuranceModalOpen, setIsAddInsuranceModalOpen] = useState(false);
    const [isAddLoanModalOpen, setIsAddLoanModalOpen] = useState(false);

    // Fetch real financials data
    const { data: financialsData = {}, isLoading, error } = useGetPropertyFinancials(propertyId, unitId);
    const createInsuranceMutation = useCreatePropertyInsurance();
    const createLoanMutation = useCreatePropertyLoan();

    const handleAddInsurance = (data: {
        companyName: string;
        companyWebsite: string;
        agentName: string;
        agentEmail: string;
        agentPhone: string;
        policyNumber: string;
        price: string;
        effectiveDate: string;
        expirationDate: string;
        details: string;
        emailNotification: boolean;
    }) => {
        createInsuranceMutation.mutate({
            propertyId,
            insuranceData: {
                policyName: data.policyNumber || data.companyName,
                provider: data.companyName,
                policyNumber: data.policyNumber || undefined,
                coverageType: data.details || undefined,
                premium: data.price ? Number(data.price) : undefined,
                startDate: data.effectiveDate || undefined,
                endDate: data.expirationDate || undefined,
                notes: `Agent: ${data.agentName || '-'}, Email: ${data.agentEmail || '-'}, Phone: ${data.agentPhone || '-'}`,
            },
        });
    };

    const handleAddLoan = (data: {
        title: string;
        loanAmount: string;
        annualInterestRate: string;
        loanStartDate: string;
        loanPeriod: string;
        loanType: string;
        paymentsDue: string;
        currentLoanBalance: string;
        bankName: string;
        contactPerson: string;
        email: string;
        phone: string;
    }) => {
        createLoanMutation.mutate({
            propertyId,
            loanData: {
                lenderName: data.bankName || data.title || 'Lender',
                loanType: data.loanType || undefined,
                principalAmount: data.loanAmount ? Number(data.loanAmount) : undefined,
                currentBalance: data.currentLoanBalance ? Number(data.currentLoanBalance) : undefined,
                interestRate: data.annualInterestRate ? Number(data.annualInterestRate) : undefined,
                monthlyPayment: undefined,
                startDate: data.loanStartDate || undefined,
                maturityDate: undefined,
                notes: `Contact: ${data.contactPerson || '-'}, Email: ${data.email || '-'}, Phone: ${data.phone || '-'}`,
            },
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
                <span className="ml-3 text-gray-600">Loading financials...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">Failed to load financials. Please try again.</p>
            </div>
        );
    }

    // Extract real data from API
    const summary = financialsData.summary || { totalIncome: 0, totalExpenses: 0, noi: 0 };
    const realInsurances = financialsData.insurances || [];
    const realLoans = financialsData.loans || [];

    return (
        <div className="space-y-8">
            {/* Financial Summary Section */}
            <div className="bg-gradient-to-r from-[#82D64D] to-[#7BD747] rounded-[2rem] p-6 md:p-8 text-white shadow-lg">
                <h3 className="text-xl font-bold mb-6">Financial Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/20 rounded-2xl p-4 backdrop-blur">
                        <p className="text-sm font-medium opacity-90">Total Income</p>
                        <p className="text-2xl font-bold">₹{summary.totalIncome.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white/20 rounded-2xl p-4 backdrop-blur">
                        <p className="text-sm font-medium opacity-90">Total Expenses</p>
                        <p className="text-2xl font-bold">₹{summary.totalExpenses.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white/20 rounded-2xl p-4 backdrop-blur">
                        <p className="text-sm font-medium opacity-90">Net Operating Income</p>
                        <p className="text-2xl font-bold">₹{summary.noi.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>

            {/* Insurances Section */}
            <div className="bg-[#E9E9E9] shadow-lg rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6">
                <SectionHeader
                    title="Insurances"
                    count={realInsurances.length}
                    actionLabel="Add"
                    onAction={() => setIsAddInsuranceModalOpen(true)}
                />
                <div>
                    {realInsurances.length > 0 ? (
                        realInsurances.map((insurance: any) => (
                            <div key={insurance.id} className="bg-[#F0F0F6] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 mb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-lg">{insurance.policyName}</h4>
                                        <p className="text-sm text-gray-600">{insurance.provider}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="text-[#3A6D6C] hover:bg-gray-200 p-2 rounded-full"><Edit2 className="w-5 h-5" /></button>
                                        <button className="text-red-500 hover:bg-gray-200 p-2 rounded-full"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    {insurance.premium && <div><span className="text-gray-600">Premium:</span> <span className="font-bold">₹{insurance.premium}</span></div>}
                                    {insurance.coverageType && <div><span className="text-gray-600">Type:</span> <span className="font-bold">{insurance.coverageType}</span></div>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 py-4">No insurances added</p>
                    )}
                </div>
            </div>

            {/* Loans Section */}
            <div className="bg-[#E9E9E9] shadow-lg rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6">
                <SectionHeader
                    title="Loans"
                    count={realLoans.length}
                    actionLabel="Add"
                    onAction={() => setIsAddLoanModalOpen(true)}
                />
                <div>
                    {realLoans.length > 0 ? (
                        realLoans.map((loan: any) => (
                            <div key={loan.id} className="bg-[#F0F0F6] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 mb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-lg">{loan.lenderName}</h4>
                                        <p className="text-sm text-gray-600">{loan.loanType || 'Loan'}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="text-[#3A6D6C] hover:bg-gray-200 p-2 rounded-full"><Edit2 className="w-5 h-5" /></button>
                                        <button className="text-red-500 hover:bg-gray-200 p-2 rounded-full"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    {loan.principalAmount && <div><span className="text-gray-600">Principal:</span> <span className="font-bold">₹{loan.principalAmount}</span></div>}
                                    {loan.monthlyPayment && <div><span className="text-gray-600">Monthly:</span> <span className="font-bold">₹{loan.monthlyPayment}</span></div>}
                                    {loan.interestRate && <div><span className="text-gray-600">Rate:</span> <span className="font-bold">{loan.interestRate}%</span></div>}
                                    {loan.currentBalance && <div><span className="text-gray-600">Balance:</span> <span className="font-bold">₹{loan.currentBalance}</span></div>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 py-4">No loans added</p>
                    )}
                </div>
            </div>

            <AddInsuranceModal
                isOpen={isAddInsuranceModalOpen}
                onClose={() => setIsAddInsuranceModalOpen(false)}
                onAdd={handleAddInsurance}
            />
            <AddLoanModal
                isOpen={isAddLoanModalOpen}
                onClose={() => setIsAddLoanModalOpen(false)}
                onAdd={handleAddLoan}
            />
        </div>
    );
};

export default FinancialsTab;
