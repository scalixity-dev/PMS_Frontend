import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import { useRentabilityReport } from '../../../../hooks/useReportsQueries';

const Rentability: React.FC = () => {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const params = useMemo(() => ({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
    }), [startDate, endDate]);

    const { data, isLoading, error, refetch } = useRentabilityReport(params);

    const rows = data?.data ?? [];
    const summary = data?.summary;

    const formatMoney = (n: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            <div className="flex w-full overflow-x-auto pb-2 md:pb-0 mb-6 scrollbar-hide">
                <Breadcrumb items={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Reports', path: '/dashboard/reports' },
                    { label: 'Rentability' },
                ]} />
            </div>

            <div className="p-4 md:p-8 bg-[#E0E8E7] min-h-screen rounded-[2rem] overflow-visible">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/dashboard/reports')}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Rentability</h1>
                </div>

                {/* Date range filters */}
                <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-end">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-[#3A6D6C] text-white rounded-lg text-sm font-medium hover:bg-[#2c5251] transition-colors"
                    >
                        Apply
                    </button>
                    <p className="text-xs text-gray-500 ml-auto">Defaults to trailing 12 months if no dates set.</p>
                </div>

                {/* Portfolio summary cards */}
                {summary && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-2xl p-5 shadow-sm">
                            <p className="text-xs text-gray-500 font-medium mb-1">Properties</p>
                            <p className="text-2xl font-bold text-gray-800">{summary.propertyCount}</p>
                        </div>
                        <div className="bg-[#82D64D] rounded-2xl p-5 shadow-sm">
                            <p className="text-xs text-white/90 font-medium mb-1">Total Income</p>
                            <p className="text-2xl font-bold text-white">{formatMoney(summary.totalIncome)}</p>
                        </div>
                        <div className="bg-[#F97316] rounded-2xl p-5 shadow-sm">
                            <p className="text-xs text-white/90 font-medium mb-1">Total Expenses</p>
                            <p className="text-2xl font-bold text-white">{formatMoney(summary.totalExpenses)}</p>
                        </div>
                        <div className={`${summary.totalNOI >= 0 ? 'bg-[#3A6D6C]' : 'bg-red-500'} rounded-2xl p-5 shadow-sm`}>
                            <p className="text-xs text-white/90 font-medium mb-1">Net Operating Income</p>
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-bold text-white">{formatMoney(summary.totalNOI)}</p>
                                {summary.totalNOI >= 0
                                    ? <TrendingUp className="w-5 h-5 text-white" />
                                    : <TrendingDown className="w-5 h-5 text-white" />}
                            </div>
                        </div>
                    </div>
                )}

                {summary && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                        <p className="text-sm text-gray-600">
                            Portfolio collection rate: <span className="font-bold text-gray-900">{summary.portfolioCollectionRate.toFixed(1)}%</span>
                            {' · '}
                            Period: {new Date(summary.rangeStart).toLocaleDateString()} → {new Date(summary.rangeEnd).toLocaleDateString()} ({summary.months} months)
                        </p>
                    </div>
                )}

                {/* Table */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-16 bg-white rounded-2xl">
                        <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
                        <span className="ml-3 text-gray-600">Loading rentability data...</span>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
                        Failed to load: {(error as Error)?.message || 'Unknown error'}
                    </div>
                ) : rows.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
                        No properties found for this period.
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#3A6D6C] text-white">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Property</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Monthly Rent</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Expected</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Paid</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Income</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Expenses</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase">NOI</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Collection %</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase">Occupancy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((r) => (
                                        <tr key={r.propertyId} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800">{r.propertyName}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatMoney(r.monthlyRent)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatMoney(r.expectedRent)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatMoney(r.paidRent)}</td>
                                            <td className="px-4 py-3 text-sm text-[#82D64D] font-semibold text-right">{formatMoney(r.income)}</td>
                                            <td className="px-4 py-3 text-sm text-[#F97316] font-semibold text-right">{formatMoney(r.expenses)}</td>
                                            <td className={`px-4 py-3 text-sm font-bold text-right ${r.noi >= 0 ? 'text-[#3A6D6C]' : 'text-red-600'}`}>
                                                {formatMoney(r.noi)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 text-right">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    r.collectionRate >= 90 ? 'bg-green-100 text-green-700'
                                                    : r.collectionRate >= 60 ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {r.collectionRate.toFixed(1)}%
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-xs font-medium text-gray-600">{r.occupancyStatus}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rentability;
