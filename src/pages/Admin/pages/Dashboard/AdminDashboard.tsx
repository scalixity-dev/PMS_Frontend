import React, { useState } from 'react';
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
    Users,
    UserPlus,
    DollarSign,
    Activity,
    TrendingUp,
    TrendingDown,
    Building2,
    Wrench,
    Wallet
} from 'lucide-react';
import CustomDropdown from '../../../Dashboard/components/CustomDropdown';

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig
} from "@/components/ui/chart";

// --- Mock Data ---

const monthlyUserGrowthData = [
    { month: 'Jan', users: 400 },
    { month: 'Feb', users: 600 },
    { month: 'Mar', users: 900 },
    { month: 'Apr', users: 1200 },
    { month: 'May', users: 1500 },
    { month: 'Jun', users: 1600 },
    { month: 'Jul', users: 1800 },
    { month: 'Aug', users: 2400 },
    { month: 'Sep', users: 2800 },
    { month: 'Oct', users: 3200 },
    { month: 'Nov', users: 3800 },
    { month: 'Dec', users: 4500 },
];

const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 18000 },
    { month: 'Apr', revenue: 16000 },
    { month: 'May', revenue: 21000 },
    { month: 'Jun', revenue: 25000 },
    { month: 'Jul', revenue: 29000 },
    { month: 'Aug', revenue: 35000 },
    { month: 'Sep', revenue: 32000 },
    { month: 'Oct', revenue: 40000 },
    { month: 'Nov', revenue: 45000 },
    { month: 'Dec', revenue: 52000 },
];

const leaseStatusData = [
    { status: 'Active', count: 850, fill: "var(--color-active)" },
    { status: 'Inactive', count: 150, fill: "var(--color-inactive)" },
    { status: 'Pending', count: 50, fill: "var(--color-pending)" },
];

// ... (imports remain)

const occupancyData = [
    { status: "Occupied", count: 85, fill: "#10B981" }, // Emerald 500
    { status: "Vacant", count: 15, fill: "#E5E7EB" }, // Gray 200
];

// --- Chart Configs ---

const userGrowthConfig = {
    users: {
        label: "Users",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

const revenueConfig = {
    revenue: {
        label: "Revenue",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

const leaseStatusConfig = {
    count: {
        label: "Leases",
    },
    active: {
        label: "Active",
        color: "#20CC95", // Matches --color-active
    },
    inactive: {
        label: "Inactive",
        color: "#EF4444", // Matches --color-inactive
    },
    pending: {
        label: "Pending",
        color: "#F59E0B", // Matches --color-pending
    },
} satisfies ChartConfig;

const occupancyConfig = {
    count: {
        label: "Count",
    },
    occupied: {
        label: "Occupied",
        color: "#10B981",
    },
    vacant: {
        label: "Vacant",
        color: "#E5E7EB",
    },
} satisfies ChartConfig;

// ... (inside component)




// --- Components ---

interface AnalyticsCardProps {
    title: string;
    value: string;
    change?: string;
    isPositive?: boolean;
    icon: React.ReactNode;
    colorClass: string; // Tailwinc class for background
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, change, isPositive, icon, colorClass }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between transition-all hover:shadow-md">
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
            {change && (
                <div className={`flex items-center text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                    {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                    <span>{change} vs last month</span>
                </div>
            )}
        </div>
        <div className={`p-3 rounded-lg ${colorClass} text-white shadow-sm`}>
            {icon}
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const [userGrowthPeriod, setUserGrowthPeriod] = useState<string>('12');
    const [revenuePeriod, setRevenuePeriod] = useState<string>('12');

    // Filter data based on period selection
    const getFilteredData = (data: any[], period: string) => {
        const monthsToShow = parseInt(period);
        return data.slice(-monthsToShow);
    };

    const filteredUserGrowthData = getFilteredData(monthlyUserGrowthData, userGrowthPeriod);
    const filteredRevenueData = getFilteredData(revenueData, revenuePeriod);

    // Determine overall revenue for display
    const totalRevenue = filteredRevenueData.reduce((acc, curr) => acc + curr.revenue, 0);
    const currentMonthRevenue = revenueData[revenueData.length - 1].revenue;

    // Time Period Options
    const timePeriodOptions = [
        { value: '1', label: 'Current Month' },
        { value: '2', label: 'Last Month' },
        { value: '3', label: 'Last 3 Months' },
        { value: '6', label: 'Last 6 Months' },
        { value: '12', label: 'This Year' },
        { value: '24', label: 'Last 2 Years' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 text-sm">Welcome back, Admin. Here's your daily digest.</p>
            </div>

            {/* Analytics Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <AnalyticsCard
                    title="Monthly Active Users"
                    value="3,240"
                    change="+12.5%"
                    isPositive={true}
                    icon={<Activity size={20} />}
                    colorClass="bg-violet-500"
                />
                <AnalyticsCard
                    title="Total Users"
                    value="12,543"
                    change="+5.2%"
                    isPositive={true}
                    icon={<Users size={20} />}
                    colorClass="bg-blue-500"
                />
                <AnalyticsCard
                    title="New Users This Month"
                    value="450"
                    change="-2.1%"
                    isPositive={false}
                    icon={<UserPlus size={20} />}
                    colorClass="bg-orange-500"
                />
                <AnalyticsCard
                    title="Monthly Revenue"
                    value={`$${currentMonthRevenue.toLocaleString()}`}
                    change="+18.2%"
                    isPositive={true}
                    icon={<DollarSign size={20} />}
                    colorClass="bg-emerald-500"
                />
            </div>

            {/* Daily Activity KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <AnalyticsCard
                    title="Daily Active PMs"
                    value="45"
                    change="+8.2%"
                    isPositive={true}
                    icon={<Building2 size={20} />}
                    colorClass="bg-purple-500"
                />
                <AnalyticsCard
                    title="Daily Active Tenants"
                    value="312"
                    change="+15.3%"
                    isPositive={true}
                    icon={<Users size={20} />}
                    colorClass="bg-cyan-500"
                />
                <AnalyticsCard
                    title="Daily Active Service Pros"
                    value="28"
                    change="+4.7%"
                    isPositive={true}
                    icon={<Wrench size={20} />}
                    colorClass="bg-amber-500"
                />
                <AnalyticsCard
                    title="Daily Transactions"
                    value="$18,450"
                    change="+22.1%"
                    isPositive={true}
                    icon={<Wallet size={20} />}
                    colorClass="bg-teal-500"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* User Growth Chart */}
                <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900">User Growth</h3>
                            <p className="text-xs md:text-sm text-gray-500">Monthly user acquisition trend</p>
                        </div>
                        <CustomDropdown
                            value={userGrowthPeriod}
                            onChange={setUserGrowthPeriod}
                            options={timePeriodOptions}
                            buttonClassName="w-full sm:w-auto min-w-[140px] py-2 text-sm"
                            className="w-full sm:w-auto"
                        />
                    </div>
                    <div className="flex-1 min-h-[250px] md:min-h-[300px] w-full">
                        <ChartContainer config={userGrowthConfig} className="h-full w-full">
                            <AreaChart
                                accessibilityLayer
                                data={filteredUserGrowthData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                    top: 12,
                                    bottom: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" className="bg-white" />} />
                                <Area
                                    dataKey="users"
                                    type="natural"
                                    fill="var(--color-users)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-users)"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900">Revenue Analytics</h3>
                            <p className="text-xs md:text-sm text-gray-500">Monthly revenue breakdown</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                            <div className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                Total: ${totalRevenue.toLocaleString()}
                            </div>
                            <CustomDropdown
                                value={revenuePeriod}
                                onChange={setRevenuePeriod}
                                options={timePeriodOptions}
                                buttonClassName="w-full sm:w-auto min-w-[140px] py-2 text-sm"
                                className="w-full sm:w-auto"
                            />
                        </div>
                    </div>
                    <div className="flex-1 min-h-[250px] md:min-h-[300px] w-full">
                        <ChartContainer config={revenueConfig} className="h-full w-full">
                            <BarChart accessibilityLayer data={filteredRevenueData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel className="bg-white" />}
                                />
                                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} />
                            </BarChart>
                        </ChartContainer>
                    </div>
                </div>

                {/* Lease Status Chart */}
                <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="mb-4 md:mb-6">
                        <h3 className="text-base md:text-lg font-bold text-gray-900">Lease Status</h3>
                        <p className="text-xs md:text-sm text-gray-500">Distribution of active and inactive leases</p>
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
                                        {leaseStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </div>
                    </div>
                </div>

                {/* Occupancy Rate Chart */}
                <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="mb-4 md:mb-6">
                        <h3 className="text-base md:text-lg font-bold text-gray-900">Occupancy Rate</h3>
                        <p className="text-xs md:text-sm text-gray-500">Percentage of total units currently occupied</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full">
                        {/* Legend/Stats */}
                        <div className="w-full md:w-1/3 space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="text-sm font-medium text-gray-700">Occupied</span>
                                <span className="text-lg font-bold text-gray-900">{occupancyData[0].count}%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="w-3 h-3 rounded-full bg-gray-300" />
                                <span className="text-sm font-medium text-gray-700">Vacant</span>
                                <span className="text-lg font-bold text-gray-900">{100 - occupancyData[0].count}%</span>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="w-full md:w-2/3 h-[250px] flex items-center justify-center">
                            <ChartContainer
                                config={occupancyConfig}
                                className="mx-auto aspect-square w-full max-w-[250px]"
                            >
                                <PieChart>
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel className="bg-white" />} />
                                    <Pie
                                        data={occupancyData}
                                        dataKey="count"
                                        nameKey="status"
                                        innerRadius={80}
                                        outerRadius={110}
                                        strokeWidth={0}
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
                                                                className="fill-foreground text-4xl font-bold"
                                                            >
                                                                {occupancyData[0].count}%
                                                            </tspan>
                                                            <tspan
                                                                x={viewBox.cx}
                                                                y={(viewBox.cy || 0) + 24}
                                                                className="fill-muted-foreground"
                                                            >
                                                                Occupied
                                                            </tspan>
                                                        </text>
                                                    )
                                                }
                                            }}
                                        />
                                        {occupancyData.map((entry, index) => (
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

export default AdminDashboard;
