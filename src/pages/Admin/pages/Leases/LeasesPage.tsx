import React, { useState } from 'react';
import {
    FileText,
    CheckCircle,
    Clock,
    TrendingUp,
    TrendingDown,
    Calendar
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    CartesianGrid,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Label
} from 'recharts';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig
} from "@/components/ui/chart";
import CustomDropdown from '../../../Dashboard/components/CustomDropdown';

// --- Mock Data ---

const monthlyLeasesData = [
    { month: 'Jan', new: 12, renewed: 8, ended: 3 },
    { month: 'Feb', new: 15, renewed: 10, ended: 4 },
    { month: 'Mar', new: 18, renewed: 12, ended: 5 },
    { month: 'Apr', new: 14, renewed: 9, ended: 6 },
    { month: 'May', new: 20, renewed: 15, ended: 4 },
    { month: 'Jun', new: 22, renewed: 14, ended: 7 },
    { month: 'Jul', new: 25, renewed: 18, ended: 5 },
    { month: 'Aug', new: 28, renewed: 20, ended: 8 },
    { month: 'Sep', new: 24, renewed: 16, ended: 6 },
    { month: 'Oct', new: 30, renewed: 22, ended: 9 },
    { month: 'Nov', new: 26, renewed: 19, ended: 7 },
    { month: 'Dec', new: 32, renewed: 24, ended: 10 },
];

const leaseValueData = [
    { month: 'Jan', value: 45000 },
    { month: 'Feb', value: 52000 },
    { month: 'Mar', value: 58000 },
    { month: 'Apr', value: 54000 },
    { month: 'May', value: 65000 },
    { month: 'Jun', value: 72000 },
    { month: 'Jul', value: 78000 },
    { month: 'Aug', value: 85000 },
    { month: 'Sep', value: 80000 },
    { month: 'Oct', value: 92000 },
    { month: 'Nov', value: 88000 },
    { month: 'Dec', value: 98000 },
];

const leaseStatusData = [
    { status: 'Active', count: 156, fill: "#10B981" },
    { status: 'Expiring Soon', count: 24, fill: "#F59E0B" },
    { status: 'Ended', count: 45, fill: "#6B7280" },
    { status: 'Terminated', count: 12, fill: "#EF4444" },
];

const leaseDurationData = [
    { duration: '6 months', count: 35, fill: "#6366F1" },
    { duration: '12 months', count: 120, fill: "#8B5CF6" },
    { duration: '18 months', count: 45, fill: "#EC4899" },
    { duration: '24+ months', count: 37, fill: "#14B8A6" },
];

// --- Chart Configs ---

const leasesActivityConfig = {
    new: {
        label: "New Leases",
        color: "#10B981",
    },
    renewed: {
        label: "Renewed",
        color: "#6366F1",
    },
    ended: {
        label: "Ended",
        color: "#EF4444",
    },
} satisfies ChartConfig;

const leaseValueConfig = {
    value: {
        label: "Lease Value",
        color: "#8B5CF6",
    },
} satisfies ChartConfig;

const leaseStatusConfig = {
    count: { label: "Leases" },
    active: { label: "Active", color: "#10B981" },
    expiring: { label: "Expiring Soon", color: "#F59E0B" },
    ended: { label: "Ended", color: "#6B7280" },
    terminated: { label: "Terminated", color: "#EF4444" },
} satisfies ChartConfig;

const leaseDurationConfig = {
    count: { label: "Leases" },
} satisfies ChartConfig;

// --- Components ---

interface AnalyticsCardProps {
    title: string;
    value: string;
    change?: string;
    isPositive?: boolean;
    changeVariant?: 'positive' | 'negative' | 'neutral';
    icon: React.ReactNode;
    colorClass: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, change, isPositive, changeVariant, icon, colorClass }) => {
    // Determine variant: explicit changeVariant takes precedence, then fall back to isPositive
    const variant = changeVariant ?? (isPositive ? 'positive' : 'negative');

    const variantStyles = {
        positive: 'text-green-600',
        negative: 'text-red-500',
        neutral: 'text-gray-500'
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between transition-all hover:shadow-md">
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
                {change && (
                    <div className={`flex items-center text-xs font-semibold ${variantStyles[variant]}`}>
                        {variant === 'positive' && <TrendingUp size={14} className="mr-1" />}
                        {variant === 'negative' && <TrendingDown size={14} className="mr-1" />}
                        <span>{variant === 'neutral' ? change : `${change} vs last month`}</span>
                    </div>
                )}
            </div>
            <div className={`p-3 rounded-lg ${colorClass} text-white shadow-sm`}>
                {icon}
            </div>
        </div>
    );
};

const LeasesPage: React.FC = () => {
    const [activityPeriod, setActivityPeriod] = useState<string>('12');
    const [valuePeriod, setValuePeriod] = useState<string>('12');

    // Filter data based on period selection
    const getFilteredData = (data: any[], period: string) => {
        const monthsToShow = parseInt(period);
        return data.slice(-monthsToShow);
    };

    const filteredActivityData = getFilteredData(monthlyLeasesData, activityPeriod);
    const filteredValueData = getFilteredData(leaseValueData, valuePeriod);

    // Stats from latest data
    const totalLeases = leaseStatusData.reduce((acc, curr) => acc + curr.count, 0);
    const activeLeases = leaseStatusData.find(s => s.status === 'Active')?.count || 0;
    const expiringSoon = leaseStatusData.find(s => s.status === 'Expiring Soon')?.count || 0;

    const latestValue = leaseValueData[leaseValueData.length - 1].value;
    const previousValue = leaseValueData[leaseValueData.length - 2].value;
    const valueGrowth = previousValue === 0 ? 'N/A' : (((latestValue - previousValue) / previousValue) * 100).toFixed(1);

    // Time Period Options
    const timePeriodOptions = [
        { value: '3', label: 'Last 3 Months' },
        { value: '6', label: 'Last 6 Months' },
        { value: '12', label: 'This Year' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Leases Analytics</h1>
                <p className="text-gray-500 text-sm">Track rental agreements, renewals, and lease performance.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <AnalyticsCard
                    title="Total Leases"
                    value={totalLeases.toString()}
                    change="+8.5%"
                    isPositive={true}
                    icon={<FileText size={20} />}
                    colorClass="bg-blue-500"
                />
                <AnalyticsCard
                    title="Active Leases"
                    value={activeLeases.toString()}
                    change="+12.3%"
                    isPositive={true}
                    icon={<CheckCircle size={20} />}
                    colorClass="bg-emerald-500"
                />
                <AnalyticsCard
                    title="Expiring Soon"
                    value={expiringSoon.toString()}
                    change="Next 30 days"
                    changeVariant="neutral"
                    icon={<Clock size={20} />}
                    colorClass="bg-amber-500"
                />
                <AnalyticsCard
                    title="Monthly Value"
                    value={`$${latestValue.toLocaleString()}`}
                    change={`+${valueGrowth}%`}
                    isPositive={true}
                    icon={<Calendar size={20} />}
                    colorClass="bg-purple-500"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Lease Activity Chart */}
                <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900">Lease Activity</h3>
                            <p className="text-xs md:text-sm text-gray-500">New, renewed, and ended leases by month</p>
                        </div>
                        <CustomDropdown
                            value={activityPeriod}
                            onChange={setActivityPeriod}
                            options={timePeriodOptions}
                            buttonClassName="w-full sm:w-auto min-w-[140px] py-2 text-sm"
                            className="w-full sm:w-auto"
                        />
                    </div>
                    <div className="flex-1 min-h-[250px] md:min-h-[300px] w-full">
                        <ChartContainer config={leasesActivityConfig} className="h-full w-full">
                            <BarChart accessibilityLayer data={filteredActivityData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent className="bg-white" />} />
                                <Bar dataKey="new" fill="#10B981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="renewed" fill="#6366F1" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="ended" fill="#EF4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ChartContainer>
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-gray-600">New</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-indigo-500" />
                            <span className="text-gray-600">Renewed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-gray-600">Ended</span>
                        </div>
                    </div>
                </div>

                {/* Lease Value Trend */}
                <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900">Monthly Lease Value</h3>
                            <p className="text-xs md:text-sm text-gray-500">Total rental income from active leases</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                            <div className="text-xs font-medium text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                                Total: ${filteredValueData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
                            </div>
                            <CustomDropdown
                                value={valuePeriod}
                                onChange={setValuePeriod}
                                options={timePeriodOptions}
                                buttonClassName="w-full sm:w-auto min-w-[140px] py-2 text-sm"
                                className="w-full sm:w-auto"
                            />
                        </div>
                    </div>
                    <div className="flex-1 min-h-[250px] md:min-h-[300px] w-full">
                        <ChartContainer config={leaseValueConfig} className="h-full w-full">
                            <AreaChart
                                accessibilityLayer
                                data={filteredValueData}
                                margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent className="bg-white" />} />
                                <Area
                                    dataKey="value"
                                    type="natural"
                                    fill="#8B5CF6"
                                    fillOpacity={0.4}
                                    stroke="#8B5CF6"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </div>
                </div>

                {/* Lease Status Distribution */}
                <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="mb-4 md:mb-6">
                        <h3 className="text-base md:text-lg font-bold text-gray-900">Lease Status</h3>
                        <p className="text-xs md:text-sm text-gray-500">Current distribution of all leases</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full">
                        <div className="w-full md:w-1/3 space-y-3">
                            {leaseStatusData.map((item) => (
                                <div key={item.status} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                                        <span className="text-sm font-medium text-gray-700">{item.status}</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">{item.count}</span>
                                </div>
                            ))}
                        </div>

                        <div className="w-full md:w-2/3 h-[250px]">
                            <ChartContainer config={leaseStatusConfig} className="mx-auto aspect-square max-h-[250px]">
                                <PieChart>
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel className="bg-white" />} />
                                    <Pie
                                        data={leaseStatusData}
                                        dataKey="count"
                                        nameKey="status"
                                        innerRadius={60}
                                        outerRadius={90}
                                        strokeWidth={5}
                                    >
                                        <Label
                                            content={({ viewBox }) => {
                                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                    return (
                                                        <text
                                                            x={viewBox.cx}
                                                            y={viewBox.cy}
                                                            textAnchor="middle"
                                                            dominantBaseline="middle"
                                                        >
                                                            <tspan
                                                                x={viewBox.cx}
                                                                y={viewBox.cy}
                                                                className="fill-foreground text-3xl font-bold"
                                                            >
                                                                {totalLeases}
                                                            </tspan>
                                                            <tspan
                                                                x={viewBox.cx}
                                                                y={(viewBox.cy || 0) + 20}
                                                                className="fill-muted-foreground text-sm"
                                                            >
                                                                Total
                                                            </tspan>
                                                        </text>
                                                    )
                                                }
                                            }}
                                        />
                                        {leaseStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </div>
                    </div>
                </div>

                {/* Lease Duration Distribution */}
                <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="mb-4 md:mb-6">
                        <h3 className="text-base md:text-lg font-bold text-gray-900">Lease Duration</h3>
                        <p className="text-xs md:text-sm text-gray-500">Distribution by lease term length</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full">
                        <div className="w-full md:w-1/3 space-y-3">
                            {leaseDurationData.map((item) => (
                                <div key={item.duration} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                                        <span className="text-sm font-medium text-gray-700">{item.duration}</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">{item.count}</span>
                                </div>
                            ))}
                        </div>

                        <div className="w-full md:w-2/3 h-[250px]">
                            <ChartContainer config={leaseDurationConfig} className="mx-auto aspect-square max-h-[250px]">
                                <PieChart>
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel className="bg-white" />} />
                                    <Pie
                                        data={leaseDurationData}
                                        dataKey="count"
                                        nameKey="duration"
                                        innerRadius={60}
                                        outerRadius={90}
                                        strokeWidth={5}
                                    >
                                        {leaseDurationData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LeasesPage;
