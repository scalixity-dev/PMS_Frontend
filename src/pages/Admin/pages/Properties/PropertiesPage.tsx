import React, { useState } from 'react';
import {
    Building2,
    Briefcase,
    CheckCircle,
    Home,
    TrendingUp,
    TrendingDown
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

const monthlyPropertiesData = [
    { month: 'Jan', properties: 45, units: 320 },
    { month: 'Feb', properties: 48, units: 340 },
    { month: 'Mar', properties: 52, units: 365 },
    { month: 'Apr', properties: 55, units: 380 },
    { month: 'May', properties: 58, units: 395 },
    { month: 'Jun', properties: 62, units: 420 },
    { month: 'Jul', properties: 65, units: 445 },
    { month: 'Aug', properties: 70, units: 480 },
    { month: 'Sep', properties: 74, units: 510 },
    { month: 'Oct', properties: 78, units: 535 },
    { month: 'Nov', properties: 82, units: 560 },
    { month: 'Dec', properties: 88, units: 590 },
];

const monthlyOccupancyData = [
    { month: 'Jan', occupied: 280, vacant: 40 },
    { month: 'Feb', occupied: 295, vacant: 45 },
    { month: 'Mar', occupied: 320, vacant: 45 },
    { month: 'Apr', occupied: 340, vacant: 40 },
    { month: 'May', occupied: 355, vacant: 40 },
    { month: 'Jun', occupied: 380, vacant: 40 },
    { month: 'Jul', occupied: 405, vacant: 40 },
    { month: 'Aug', occupied: 440, vacant: 40 },
    { month: 'Sep', occupied: 465, vacant: 45 },
    { month: 'Oct', occupied: 490, vacant: 45 },
    { month: 'Nov', occupied: 515, vacant: 45 },
    { month: 'Dec', occupied: 545, vacant: 45 },
];

const leaseStatusData = [
    { status: 'Active', count: 72, fill: "#10B981" },
    { status: 'Ending Soon', count: 10, fill: "#F59E0B" },
    { status: 'Vacant', count: 6, fill: "#EF4444" },
];

const propertyTypeData = [
    { type: 'Apartments', count: 45, fill: "#6366F1" },
    { type: 'Single Family', count: 25, fill: "#8B5CF6" },
    { type: 'Condos', count: 12, fill: "#EC4899" },
    { type: 'Townhouses', count: 6, fill: "#14B8A6" },
];

// --- Chart Configs ---

const propertiesGrowthConfig = {
    properties: {
        label: "Properties",
        color: "#6366F1",
    },
    units: {
        label: "Units",
        color: "#8B5CF6",
    },
} satisfies ChartConfig;

const occupancyConfig = {
    occupied: {
        label: "Occupied",
        color: "#10B981",
    },
    vacant: {
        label: "Vacant",
        color: "#EF4444",
    },
} satisfies ChartConfig;

const leaseStatusConfig = {
    count: { label: "Properties" },
    active: { label: "Active", color: "#10B981" },
    ending: { label: "Ending Soon", color: "#F59E0B" },
    vacant: { label: "Vacant", color: "#EF4444" },
} satisfies ChartConfig;

const propertyTypeConfig = {
    count: { label: "Properties" },
    apartments: { label: "Apartments", color: "#6366F1" },
    singleFamily: { label: "Single Family", color: "#8B5CF6" },
    condos: { label: "Condos", color: "#EC4899" },
    townhouses: { label: "Townhouses", color: "#14B8A6" },
} satisfies ChartConfig;

// --- Components ---

interface AnalyticsCardProps {
    title: string;
    value: string;
    change?: string;
    isPositive?: boolean;
    icon: React.ReactNode;
    colorClass: string;
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

const PropertiesPage: React.FC = () => {
    const [propertiesPeriod, setPropertiesPeriod] = useState<string>('12');
    const [occupancyPeriod, setOccupancyPeriod] = useState<string>('12');

    // Filter data based on period selection
    const getFilteredData = (data: any[], period: string) => {
        const monthsToShow = parseInt(period);
        return data.slice(-monthsToShow);
    };

    const filteredPropertiesData = getFilteredData(monthlyPropertiesData, propertiesPeriod);
    const filteredOccupancyData = getFilteredData(monthlyOccupancyData, occupancyPeriod);

    // Stats from latest data
    const latestData = monthlyPropertiesData[monthlyPropertiesData.length - 1];
    const previousData = monthlyPropertiesData[monthlyPropertiesData.length - 2];
    const latestOccupancy = monthlyOccupancyData[monthlyOccupancyData.length - 1];

    const totalProperties = latestData.properties;
    const totalUnits = latestData.units;
    const occupiedUnits = latestOccupancy.occupied;
    const vacantUnits = latestOccupancy.vacant;
    const occupancyRate = Math.round((occupiedUnits / (occupiedUnits + vacantUnits)) * 100);

    const propertyGrowth = (((latestData.properties - previousData.properties) / previousData.properties) * 100).toFixed(1);
    const unitGrowth = (((latestData.units - previousData.units) / previousData.units) * 100).toFixed(1);

    // Time Period Options
    const timePeriodOptions = [
        { value: '3', label: 'Last 3 Months' },
        { value: '6', label: 'Last 6 Months' },
        { value: '12', label: 'This Year' },
    ];

    const totalLeases = leaseStatusData.reduce((acc, curr) => acc + curr.count, 0);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Properties Analytics</h1>
                <p className="text-gray-500 text-sm">Overview of property portfolio performance and trends.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <AnalyticsCard
                    title="Total Properties"
                    value={totalProperties.toString()}
                    change={`+${propertyGrowth}%`}
                    isPositive={true}
                    icon={<Building2 size={20} />}
                    colorClass="bg-indigo-500"
                />
                <AnalyticsCard
                    title="Total Units"
                    value={totalUnits.toString()}
                    change={`+${unitGrowth}%`}
                    isPositive={true}
                    icon={<Home size={20} />}
                    colorClass="bg-purple-500"
                />
                <AnalyticsCard
                    title="Occupied Units"
                    value={occupiedUnits.toString()}
                    change={`${occupancyRate}% rate`}
                    isPositive={true}
                    icon={<CheckCircle size={20} />}
                    colorClass="bg-emerald-500"
                />
                <AnalyticsCard
                    title="Property Managers"
                    value="12"
                    change="+2 this month"
                    isPositive={true}
                    icon={<Briefcase size={20} />}
                    colorClass="bg-blue-500"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Properties Growth Chart */}
                <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900">Properties Growth</h3>
                            <p className="text-xs md:text-sm text-gray-500">Monthly property acquisition trend</p>
                        </div>
                        <CustomDropdown
                            value={propertiesPeriod}
                            onChange={setPropertiesPeriod}
                            options={timePeriodOptions}
                            buttonClassName="w-full sm:w-auto min-w-[140px] py-2 text-sm"
                            className="w-full sm:w-auto"
                        />
                    </div>
                    <div className="flex-1 min-h-[250px] md:min-h-[300px] w-full">
                        <ChartContainer config={propertiesGrowthConfig} className="h-full w-full">
                            <AreaChart
                                accessibilityLayer
                                data={filteredPropertiesData}
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
                                    dataKey="properties"
                                    type="natural"
                                    fill="#6366F1"
                                    fillOpacity={0.4}
                                    stroke="#6366F1"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </div>
                </div>

                {/* Occupancy Trend Chart */}
                <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900">Occupancy Trend</h3>
                            <p className="text-xs md:text-sm text-gray-500">Monthly occupied vs vacant units</p>
                        </div>
                        <CustomDropdown
                            value={occupancyPeriod}
                            onChange={setOccupancyPeriod}
                            options={timePeriodOptions}
                            buttonClassName="w-full sm:w-auto min-w-[140px] py-2 text-sm"
                            className="w-full sm:w-auto"
                        />
                    </div>
                    <div className="flex-1 min-h-[250px] md:min-h-[300px] w-full">
                        <ChartContainer config={occupancyConfig} className="h-full w-full">
                            <BarChart accessibilityLayer data={filteredOccupancyData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent className="bg-white" />} />
                                <Bar dataKey="occupied" fill="#10B981" radius={[4, 4, 0, 0]} stackId="a" />
                                <Bar dataKey="vacant" fill="#EF4444" radius={[4, 4, 0, 0]} stackId="a" />
                            </BarChart>
                        </ChartContainer>
                    </div>
                </div>

                {/* Lease Status Chart */}
                <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="mb-4 md:mb-6">
                        <h3 className="text-base md:text-lg font-bold text-gray-900">Lease Status Distribution</h3>
                        <p className="text-xs md:text-sm text-gray-500">Current status of all property leases</p>
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

                {/* Property Type Distribution */}
                <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="mb-4 md:mb-6">
                        <h3 className="text-base md:text-lg font-bold text-gray-900">Property Types</h3>
                        <p className="text-xs md:text-sm text-gray-500">Distribution by property category</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full">
                        <div className="w-full md:w-1/3 space-y-3">
                            {propertyTypeData.map((item) => (
                                <div key={item.type} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                                        <span className="text-sm font-medium text-gray-700">{item.type}</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">{item.count}</span>
                                </div>
                            ))}
                        </div>

                        <div className="w-full md:w-2/3 h-[250px]">
                            <ChartContainer config={propertyTypeConfig} className="mx-auto aspect-square max-h-[250px]">
                                <PieChart>
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel className="bg-white" />} />
                                    <Pie
                                        data={propertyTypeData}
                                        dataKey="count"
                                        nameKey="type"
                                        innerRadius={60}
                                        outerRadius={90}
                                        strokeWidth={5}
                                    >
                                        {propertyTypeData.map((entry, index) => (
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

export default PropertiesPage;
