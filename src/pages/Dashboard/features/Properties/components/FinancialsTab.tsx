import React from 'react';
import { Edit2, Trash2, Loader2 } from 'lucide-react';
import SectionHeader from './SectionHeader';
import AddInsuranceModal from './AddInsuranceModal';
import AddLoanModal from './AddLoanModal';
import AddPurchaseModal from './AddPurchaseModal';
import { useState } from 'react';
import { useGetPropertyFinancials } from '../../../../../hooks/usePropertyDetailQueries';

// --- Types ---

interface HeaderPill {
    label: string;
    value: string;
}

interface DetailField {
    label: string;
    value: string;
}

interface FinancialRecord {
    id: number;
    headerPills: HeaderPill[];
    details: DetailField[];
}

// --- Components ---

interface FinancialCardProps {
    record: FinancialRecord;
    onEdit?: () => void;
    onDelete?: () => void;
}

const FinancialCard: React.FC<FinancialCardProps> = ({ record, onEdit, onDelete }) => {
    return (
        <div className="bg-[#F0F0F6] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 mb-4 relative">
            {/* Actions */}
            <div className="absolute top-4 md:top-6 right-4 md:right-6 flex gap-2 md:gap-3">
                <button onClick={onEdit} className="text-[#3A6D6C] hover:text-[#2c5554] transition-colors">
                    <Edit2 className="w-5 h-5" />
                </button>
                <button onClick={onDelete} className="text-red-500 hover:text-red-700 transition-colors">
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            {/* Header Pills */}
            <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-8 pr-16 md:pr-20">
                {record.headerPills.map((pill, index) => (
                    <div key={index} className="bg-[#82D64D] text-white py-2 md:py-4 px-3 md:px-4 rounded-full flex items-center gap-2 md:gap-3 shadow-sm min-w-[140px] md:min-w-[200px]">
                        <span className="text-xs md:text-sm font-medium">{pill.label}</span>
                        <div className="bg-[#F0F0F6] text-gray-700 px-2 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-bold text-center whitespace-nowrap">
                            {pill.value}
                        </div>
                    </div>))}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                {record.details.map((detail, index) => (
                    <div key={index} className="flex items-center bg-[#E3EBDE] rounded-full px-4 py-2 shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)]">
                        <span className="text-xs font-medium text-gray-600 w-1/3 truncate" title={detail.label}>{detail.label}</span>
                        <span className="text-sm text-gray-800 font-medium w-2/3 truncate pl-2" title={detail.value}>{detail.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface FinancialsTabProps {
    propertyId: string;
    unitId?: string;
}

const FinancialsTab: React.FC<FinancialsTabProps> = ({ propertyId, unitId }) => {
    const [isAddInsuranceModalOpen, setIsAddInsuranceModalOpen] = useState(false);
    const [isAddLoanModalOpen, setIsAddLoanModalOpen] = useState(false);
    const [isAddPurchaseModalOpen, setIsAddPurchaseModalOpen] = useState(false);

    // Fetch real financials data
    const { data: financialsData = {}, isLoading, error } = useGetPropertyFinancials(propertyId, unitId);

    // Mock Data
    const [insurances, setInsurances] = useState<FinancialRecord[]>([
        {
            id: 1,
            headerPills: [
                { label: 'Effective date', value: '27 Nov, 2025' },
                { label: 'Expiration date', value: '30 Nov, 2025' },
                { label: 'Price', value: '₹15,55.00' },
            ],
            details: [
                { label: 'Company name', value: 'jay' },
                { label: 'Email notification due to expiration', value: '-' },
                { label: 'Phone number', value: '+91 78541 23698' },
                { label: 'Website', value: 'www.jay343@gmail.com' },
                { label: 'Policy', value: '12563' },
                { label: 'Details', value: '-' },
                { label: 'Agent', value: 'vedh' },
                { label: 'Email', value: 'afsaft@gmail.com' },
            ]
        }
    ]);

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
        const newRecord: FinancialRecord = {
            id: Date.now(),
            headerPills: [
                { label: 'Effective date', value: data.effectiveDate || '-' },
                { label: 'Expiration date', value: data.expirationDate || '-' },
                { label: 'Price', value: data.price ? `₹${data.price}` : '-' },
            ],
            details: [
                { label: 'Company name', value: data.companyName },
                { label: 'Email notification due to expiration', value: data.emailNotification ? 'Yes' : 'No' },
                { label: 'Phone number', value: data.agentPhone || '-' },
                { label: 'Website', value: data.companyWebsite },
                { label: 'Policy', value: data.policyNumber || '-' },
                { label: 'Details', value: data.details || '-' },
                { label: 'Agent', value: data.agentName || '-' },
                { label: 'Email', value: data.agentEmail || '-' },
            ]
        };
        setInsurances([...insurances, newRecord]);
    };

    const [loans, setLoans] = useState<FinancialRecord[]>([
        {
            id: 1,
            headerPills: [
                { label: 'Loan start date', value: '27 Nov, 2025' },
                { label: 'Loan amount', value: '₹65,555.00' },
                { label: 'Current loan balance', value: '₹65,555.00' },
            ],
            details: [
                { label: 'Annual interest %', value: '5' },
                { label: 'Email', value: '-' },
                { label: 'Phone number', value: '+91 78541 23698' },
                { label: 'Payments due', value: 'monthly' },
                { label: 'Loan period in years', value: '3' },
                { label: 'Loan type', value: 'Private' },
                { label: 'Bank name', value: 'sbi' },
                { label: 'Contact person', value: 'sam' },
            ]
        }
    ]);

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
        const newRecord: FinancialRecord = {
            id: Date.now(),
            headerPills: [
                { label: 'Loan start date', value: data.loanStartDate || '-' },
                { label: 'Loan amount', value: data.loanAmount ? `₹${data.loanAmount}` : '-' },
                { label: 'Current loan balance', value: data.currentLoanBalance ? `₹${data.currentLoanBalance}` : '-' },
            ],
            details: [
                { label: 'Annual interest %', value: data.annualInterestRate },
                { label: 'Email', value: data.email || '-' },
                { label: 'Phone number', value: data.phone || '-' },
                { label: 'Payments due', value: data.paymentsDue || '-' },
                { label: 'Loan period in years', value: data.loanPeriod },
                { label: 'Loan type', value: data.loanType || '-' },
                { label: 'Bank name', value: data.bankName || '-' },
                { label: 'Contact person', value: data.contactPerson || '-' },
            ]
        };
        setLoans([...loans, newRecord]);
    };

    const [purchases, setPurchases] = useState<FinancialRecord[]>([
        {
            id: 1,
            headerPills: [
                { label: 'Start date', value: '27 Nov, 2025' },
                { label: 'Purchase price', value: '₹25,555.00' },
            ],
            details: [
                { label: 'Down payment', value: '₹999.00' },
                { label: 'Annual depreciation', value: '₹999.00' },
                { label: 'Phone number', value: '+91 78541 23698' },
                { label: 'Depreciable years', value: '27.5' },
                { label: 'Land value', value: '₹25999.00' },
                { label: 'Loan type', value: 'Private' },
                { label: 'Details', value: 'ccvcdvvv.' },
            ]
        }
    ]);

    const handleAddPurchase = (data: {
        purchasePrice: string;
        startDate: string;
        downPayment: string;
        depreciableYears: string;
        annualDepreciation: string;
        landValue: string;
        details: string;
    }) => {
        const newRecord: FinancialRecord = {
            id: Date.now(),
            headerPills: [
                { label: 'Start date', value: data.startDate || '-' },
                { label: 'Purchase price', value: data.purchasePrice ? `₹${data.purchasePrice}` : '-' },
            ],
            details: [
                { label: 'Down payment', value: data.downPayment ? `₹${data.downPayment}` : '-' },
                { label: 'Annual depreciation', value: data.annualDepreciation ? `₹${data.annualDepreciation}` : '-' },
                { label: 'Depreciable years', value: data.depreciableYears || '-' },
                { label: 'Land value', value: data.landValue ? `₹${data.landValue}` : '-' },
                { label: 'Details', value: data.details || '-' },
            ]
        };
        setPurchases([...purchases, newRecord]);
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

            {/* Purchase Section */}
            <div className="bg-[#E9E9E9] shadow-lg rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6">
                <SectionHeader
                    title="Purchase"
                    count={purchases.length}
                    actionLabel="Add"
                    onAction={() => setIsAddPurchaseModalOpen(true)}
                />
                <div>
                    {purchases.map(record => (
                        <FinancialCard
                            key={record.id}
                            record={record}
                            onEdit={() => console.log('Edit Purchase', record.id)}
                            onDelete={() => console.log('Delete Purchase', record.id)}
                        />
                    ))}
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
            <AddPurchaseModal
                isOpen={isAddPurchaseModalOpen}
                onClose={() => setIsAddPurchaseModalOpen(false)}
                onAdd={handleAddPurchase}
            />
        </div>
    );
};

export default FinancialsTab;
