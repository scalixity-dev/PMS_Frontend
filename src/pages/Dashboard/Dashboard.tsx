import React, { useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import profilePic from "../../assets/images/profilepic.png";
import propertyPic from "../../assets/images/propertypic.png";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useGetDashboardStats } from '../../hooks/useDashboardQueries';
import { useGetAllTasks } from '../../hooks/useTaskQueries';
import { useGetAllApplications } from '../../hooks/useApplicationQueries';
import { useGetAllMaintenanceRequests } from '../../hooks/useMaintenanceRequestQueries';
import { useGetAllProperties } from '../../hooks/usePropertyQueries';
import { useGetAllLeases } from '../../hooks/useLeaseQueries';

export default function Dashboard() {
  const navigate = useNavigate();
  const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>() || { sidebarCollapsed: false };
  const { data: dashboardStats } = useGetDashboardStats();
  const { data: tasksData = [] } = useGetAllTasks();
  const { data: applicationsResponse = [] } = useGetAllApplications();
  const { data: maintenanceData = [] } = useGetAllMaintenanceRequests(true);
  const { data: propertiesData = [] } = useGetAllProperties(true, false);
  const { data: leasesData = [] } = useGetAllLeases(undefined, undefined, true);

  const applicationsData = useMemo(() => {
    if (Array.isArray(applicationsResponse)) return applicationsResponse;
    return applicationsResponse?.data || applicationsResponse?.applications || [];
  }, [applicationsResponse]);

  const accountingData = useMemo(() => ([
    { name: 'Income', value: Number(dashboardStats?.financial.thisMonthIncome || 0) },
    { name: 'Expenses', value: Number(dashboardStats?.financial.thisMonthExpenses || 0) },
    { name: 'NOI', value: Number(dashboardStats?.financial.thisMonthNOI || 0) },
    { name: 'Overdue', value: Number(dashboardStats?.financial.overdueInvoicesAmount || 0) },
  ]), [dashboardStats]);

  const leasesFunnelData = useMemo(() => ([
    { name: 'Pending Apps', value: Number(dashboardStats?.applications.pending || 0), color: '#3b82f6' },
    { name: 'Approved Apps', value: Number(dashboardStats?.applications.approved || 0), color: '#06b6d4' },
    { name: 'Rejected Apps', value: Number(dashboardStats?.applications.rejected || 0), color: '#f97316' },
    { name: 'Active Tenants', value: Number(dashboardStats?.overview.tenantsCount || 0), color: '#fbbf24' },
  ]), [dashboardStats]);

  const propertiesUnitsData = useMemo(() => {
    const total = propertiesData.length;
    if (!total) {
      return [
        { name: 'Occupied', value: 0, color: '#8b5cf6' },
        { name: 'Vacant', value: 0, color: '#c084fc' },
      ];
    }
    const vacant = propertiesData.filter((property: any) =>
      property.leasing?.occupancyStatus === 'VACANT' || !property.leasing?.occupancyStatus
    ).length;
    const occupied = Math.max(total - vacant, 0);
    return [
      { name: 'Occupied', value: occupied, color: '#8b5cf6' },
      { name: 'Vacant', value: vacant, color: '#c084fc' },
    ];
  }, [propertiesData]);

  const depositsData = useMemo(() => ([
    { name: 'Income', value: Number(dashboardStats?.financial.thisMonthIncome || 0), color: '#f97316' },
    { name: 'Expenses', value: Number(dashboardStats?.financial.thisMonthExpenses || 0), color: '#06b6d4' },
    { name: 'Overdue', value: Number(dashboardStats?.financial.overdueInvoicesAmount || 0), color: '#fbbf24' },
  ]), [dashboardStats]);

  const tasks = useMemo(() => {
    return (tasksData as any[]).slice(0, 3).map((task) => ({
      id: task.id,
      title: task.title || 'Untitled Task',
      subtitle: task.property || task.date || '-',
      avatar: task.avatar || profilePic,
    }));
  }, [tasksData]);

  const applications = useMemo(() => {
    return (applicationsData as any[]).slice(0, 3).map((app: any) => {
      const property = app.leasing?.property;
      const address = property?.address
        ? [
          property.address.streetAddress,
          property.address.city,
          property.address.stateRegion,
          property.address.zipCode,
        ].filter(Boolean).join(', ')
        : '-';
      return {
        id: app.id,
        title: property?.propertyName || 'Application',
        subtitle: address,
        avatar: app.imageUrl || profilePic,
      };
    });
  }, [applicationsData]);

  const maintenanceItems = useMemo(() => {
    return (maintenanceData as any[]).slice(0, 3).map((item: any) => {
      const assignment = Array.isArray(item.assignments) ? item.assignments[0] : undefined;
      const assigneeName =
        assignment?.serviceProvider?.companyName ||
        assignment?.assignedToUser?.fullName ||
        assignment?.assignedToUser?.email ||
        'Unassigned';
      return {
        id: item.id,
        iconType: item.category === 'ELECTRICAL' ? 'bolt' : item.category === 'HVAC' ? 'snowflake' : 'wrench',
        type: item.category || 'Maintenance',
        location: item.property?.propertyName || '-',
        request: item.id?.slice(0, 8) || '-',
        issue: item.title || item.subcategory || '-',
        assignee: assigneeName,
        avatar: profilePic,
      };
    });
  }, [maintenanceData]);

  const properties = useMemo(() => {
    return (propertiesData as any[]).slice(0, 3).map((property: any) => {
      const address = property.address
        ? [
          property.address.streetAddress,
          property.address.city,
          property.address.stateRegion,
        ].filter(Boolean).join(', ')
        : property.propertyName || '-';
      // Occupancy comes from propertyLeasing table, not listings
      const occupancyStatus = property.leasing?.occupancyStatus;
      let status: 'Vacant' | 'Occupied' | 'Partial' = 'Vacant';
      if (occupancyStatus === 'OCCUPIED') status = 'Occupied';
      else if (occupancyStatus === 'PARTIALLY_OCCUPIED') status = 'Partial';
      else status = 'Vacant';

      return {
        id: property.id,
        image: property.coverPhotoUrl || property.photos?.[0]?.photoUrl || propertyPic,
        address,
        unit: property.propertyName || 'Property',
        status,
      };
    });
  }, [propertiesData]);

  const leases = useMemo(() => {
    return (leasesData as any[])
      .filter((lease: any) => !!lease.endDate)
      .sort((a: any, b: any) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
      .slice(0, 3)
      .map((lease: any) => {
        const property = lease.property;
        const address = property?.address
          ? [
            property.address.streetAddress,
            property.address.city,
            property.address.stateRegion,
          ].filter(Boolean).join(', ')
          : '-';
        return {
          id: lease.id,
          property: property?.propertyName || 'Lease',
          address,
          avatar: lease.tenant?.tenantProfile?.profilePhotoUrl || profilePic,
          tenant: lease.tenant?.fullName || lease.tenant?.email || 'Tenant',
        };
      });
  }, [leasesData]);

  const leaseAverageWeeks = useMemo(() => {
    const now = Date.now();
    const activeLeasesWithEndDate = (leasesData as any[])
      .filter((lease: any) => lease?.endDate && new Date(lease.endDate).getTime() > now);
    if (activeLeasesWithEndDate.length === 0) return 0;

    const avgWeeks = activeLeasesWithEndDate
      .map((lease: any) => (new Date(lease.endDate).getTime() - now) / (1000 * 60 * 60 * 24 * 7))
      .reduce((sum: number, weeks: number) => sum + weeks, 0) / activeLeasesWithEndDate.length;

    return Number(avgWeeks.toFixed(2));
  }, [leasesData]);

  const depositsHeldPercent = useMemo(() => {
    const total = depositsData.reduce((sum, item) => sum + Number(item.value || 0), 0);
    if (total <= 0) return 0;
    const incomeValue = Number(depositsData.find((item) => item.name === 'Income')?.value || 0);
    return Math.round((incomeValue / total) * 100);
  }, [depositsData]);

  const todayLabel = useMemo(
    () => new Date().toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'short' }),
    [],
  );

  const metrics = [
    {
      label: "Total Income",
      value: `${dashboardStats?.financial.thisMonthIncome ? Math.round((dashboardStats.financial.thisMonthIncome / (dashboardStats.financial.thisMonthIncome + dashboardStats.financial.thisMonthExpenses) * 100)) || 0 : 0}%`,
      amount: `$${(dashboardStats?.financial.thisMonthIncome || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "Live",
      color: "text-orange-500",
    },
    {
      label: "Total Overdue",
      value: `${dashboardStats?.financial.overdueInvoicesCount || 0} invoices`,
      amount: `$${(dashboardStats?.financial.overdueInvoicesAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "Live",
      color: "text-blue-600",
    },
    {
      label: "Total Expenses",
      value: `${dashboardStats?.financial.thisMonthExpenses ? Math.round((dashboardStats.financial.thisMonthExpenses / (dashboardStats.financial.thisMonthIncome + dashboardStats.financial.thisMonthExpenses) * 100)) || 0 : 0}%`,
      amount: `$${(dashboardStats?.financial.thisMonthExpenses || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "Live",
      color: "text-orange-500",
    },
  ];

  return (
    <div className={`space-y-5 ${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto transition-all duration-300`}>
      {/* Top Row - Overview, Tasks, Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Overview Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E7EEE9' }}>
                <svg className="w-5 h-5" style={{ color: '#617C6C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
            </div>
            <button onClick={() => navigate('/dashboard/calendar')} className="text-sm text-[var(--color-primary)] hover:opacity-90 font-semibold">
              View All
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{todayLabel}</p>
              <p className="text-xs text-gray-500">There are no reminders for today</p>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E7EEE9' }}>
                <svg className="w-5 h-5" style={{ color: '#617C6C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/dashboard/tasks', { state: { openAddModal: true } })} className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add
              </button>
              <button onClick={() => navigate('/dashboard/tasks')} className="text-sm text-[var(--color-primary)] hover:opacity-90 font-semibold">
                View All
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-sm text-gray-500">No tasks found.</p>
            ) : tasks.map((task, idx) => (
              <div key={task.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-900 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500">{task.subtitle}</p>
                    </div>
                  </div>
                  {idx < tasks.length - 1 && <div className="border-b border-gray-100 mt-3" />}
                </div>
                <img src={task.avatar} alt="User" className="w-8 h-8 rounded-full ml-4" />
              </div>
            ))}
          </div>
        </div>

        {/* Applications Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E7EEE9' }}>
                <svg className="w-5 h-5" style={{ color: '#617C6C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
            </div>
            <button onClick={() => navigate('/dashboard/leasing/applications')} className="text-sm text-[var(--color-primary)] hover:opacity-90 font-semibold">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {applications.length === 0 ? (
              <p className="text-sm text-gray-500">No applications found.</p>
            ) : applications.map((app, idx) => (
              <div key={app.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-900 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{app.title}</p>
                      <p className="text-xs text-gray-500">{app.subtitle}</p>
                    </div>
                  </div>
                  {idx < applications.length - 1 && <div className="border-b border-gray-100 mt-3" />}
                </div>
                <img src={app.avatar} alt="User" className="w-8 h-8 rounded-full ml-4" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row - Accounting and Lease Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Accounting Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Accounting</h2>
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Weekly
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                ${Number(dashboardStats?.financial.thisMonthIncome || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-sm text-gray-500">This Month</span>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accountingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leases Funnel Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Lease funnel</h2>
            <button onClick={() => navigate('/dashboard/leasing/leases')} className="text-sm text-[var(--color-primary)] hover:opacity-90 font-semibold">
              View All
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="h-64 flex-shrink-0 relative" style={{ width: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leasesFunnelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {leasesFunnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{leaseAverageWeeks.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">Average Weeks</div>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-3 w-full sm:w-auto">
              {leasesFunnelData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Third Row - Maintenance and Recently Viewed */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Maintenance */}
        <div className="bg-white rounded-lg p-6 shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Maintenance</h2>
            <button onClick={() => navigate('/dashboard/maintenance/requests')} className="text-sm text-[var(--color-primary)] hover:text-blue-700 font-semibold">
              See All
            </button>
          </div>
          <div className="space-y-4">
            {maintenanceItems.length === 0 ? (
              <p className="text-sm text-gray-500">No maintenance requests found.</p>
            ) : maintenanceItems.map((item, idx) => (
              <React.Fragment key={item.id}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 last:pb-0 gap-3 sm:gap-0">
                  <div className="flex-1 w-full sm:w-auto">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E7EEE9' }}>
                        {item.iconType === 'wrench' && (
                          <svg className="w-5 h-5" style={{ color: '#617C6C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                        {item.iconType === 'bolt' && (
                          <svg className="w-5 h-5" style={{ color: '#617C6C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        )}
                        {item.iconType === 'snowflake' && (
                          <svg className="w-5 h-5" style={{ color: '#617C6C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20M2 12h20M6.34 6.34l11.32 11.32M17.66 6.34L6.34 17.66M8 4l4 4M4 8l4 4M8 20l4-4M4 16l4-4M16 4l-4 4M20 8l-4 4M16 20l-4-4M20 16l-4-4" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">{item.type}</span>
                          <span className="text-sm text-gray-500 truncate">| {item.location}</span>
                        </div>
                        <p className="text-xs text-gray-500">Request ID: {item.request}</p>
                      </div>
                      <div className="flex-1 hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">{item.issue}</p>
                      </div>
                    </div>
                    {/* Mobile Issue display */}
                    <div className="mt-2 sm:hidden pl-14">
                      <p className="text-sm font-medium text-gray-900">{item.issue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-14 sm:ml-4">
                    <img src={item.avatar} alt={item.assignee} className="w-8 h-8 rounded-full" />
                    <span className="text-sm text-gray-700">{item.assignee}</span>
                  </div>
                </div>
                {idx < maintenanceItems.length - 1 && <div className="border-b border-gray-100 mt-3" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Recently Viewed */}
        <div className="bg-white rounded-lg p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recently viewed</h2>
            <button onClick={() => navigate('/dashboard/properties')} className="text-sm text-[var(--color-primary)] hover:opacity-90 font-semibold">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {properties.length === 0 ? (
              <p className="text-sm text-gray-500">No properties found.</p>
            ) : properties.map((property, idx) => (
              <div key={property.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <img
                      src={property.image}
                      alt={property.address}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{property.address}</p>
                      <p className="text-xs text-gray-500">{property.unit}</p>
                    </div>
                  </div>
                  {idx < properties.length - 1 && <div className="border-b border-gray-100 mt-3" />}
                </div>
                <button
                  className={`px-4 py-1.5 text-xs font-medium rounded-full ${property.status === "Vacant"
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                >
                  {property.status}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fourth Row - Properties/Financial/Deposits and Expiring Leases/Overdue Invoices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Properties & Units Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Properties & Units</h2>
            <button onClick={() => navigate('/dashboard/properties')} className="text-sm text-[var(--color-primary)] font-semibold">
              View All
            </button>
          </div>
          <div className="h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertiesUnitsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={0}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {propertiesUnitsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4">
            {propertiesUnitsData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col space-y-4">
          {metrics.map((metric, index) => {
            const pct = parseInt(metric.value, 10) || 0;
            const radius = 44; // increased radius
            const strokeW = 12; // increased stroke width
            const center = 56; // center = radius + strokeW/2 => 44 + 6 = 50 (rounded to 56 to match svg size)
            const circumference = 2 * Math.PI * radius;
            const dash = (pct / 100) * circumference;

            return (
              <div key={index} className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle
                      cx={center}
                      cy={center}
                      r={radius}
                      stroke="#f0f0f0"
                      strokeWidth={strokeW}
                      fill="none"
                    />
                    <circle
                      cx={center}
                      cy={center}
                      r={radius}
                      stroke={metric.color.includes('orange') ? '#f97316' : '#3b82f6'}
                      strokeWidth={strokeW}
                      fill="none"
                      strokeDasharray={`${dash} ${circumference}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-xl font-bold text-gray-900">{metric.value}</div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                  {metric.amount && (
                    <p className="text-lg font-bold text-gray-900">{metric.amount}</p>
                  )}
                  <p className={`text-xs font-medium ${metric.change.startsWith('+') ? 'text-green-600' : metric.change.startsWith('-') ? 'text-red-600' : 'text-gray-500'}`}>
                    {metric.change}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deposits Held Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Deposits held</h2>
          <div className="h-48 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={depositsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {depositsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">{depositsHeldPercent}%</div>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {depositsData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expiring Leases and Overdue Invoices Stacked */}
        <div className="space-y-6">
          {/* Expiring Leases */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E7EEE9' }}>
                  <svg className="w-5 h-5" style={{ color: '#617C6C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Expiring leases</h2>
              </div>
              <button onClick={() => navigate('/dashboard/leasing/leases')} className="text-sm text-[var(--color-primary)] hover:opacity-90 font-semibold">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {leases.length === 0 ? (
                <p className="text-sm text-gray-500">No expiring leases found.</p>
              ) : leases.map((lease, idx) => (
                <div key={lease.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-900 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-900">{lease.property}</p>
                        <p className="text-xs text-gray-500">{lease.address}</p>
                      </div>
                    </div>
                    {idx < leases.length - 1 && <div className="border-b border-gray-100 mt-3" />}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <img src={lease.avatar} alt={lease.tenant} className="w-6 h-6 rounded-full" />
                    <span className="text-xs text-gray-700">{lease.tenant}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overdue Invoices */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E7EEE9' }}>
                  <svg className="w-5 h-5" style={{ color: '#617C6C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Overdue Invoices</h2>
              </div>
              <button onClick={() => navigate('/dashboard/accounting/transactions')} className="text-sm text-[var(--color-primary)] hover:opacity-90 font-semibold">
                View All
              </button>
            </div>
            <div className="text-center py-8">
              <p className="text-base font-semibold text-gray-900">
                {Number(dashboardStats?.financial.overdueInvoicesCount || 0) === 0
                  ? 'No overdue invoices'
                  : `${dashboardStats?.financial.overdueInvoicesCount || 0} overdue invoices`}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Amount: ${Number(dashboardStats?.financial.overdueInvoicesAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
