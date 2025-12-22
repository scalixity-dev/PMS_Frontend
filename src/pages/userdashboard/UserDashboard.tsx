import profilePic from "../../assets/images/profilepic.png";

export default function UserDashboard() {
    const accountOverview = [
        { label: "My Balance", value: "₹ 5,000.00", color: "text-blue-600" },
        { label: "Next Payment", value: "01 Jan 2026", color: "text-orange-500" },
        { label: "Pending Requests", value: "2", color: "text-green-600" },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, User!</h1>
                    <p className="text-gray-500 mt-1">Here's what's happening with your property.</p>
                </div>
                <img src={profilePic} alt="User" className="w-16 h-16 rounded-full border-2 border-[var(--color-primary)]" />
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {accountOverview.map((item, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm font-medium text-gray-500 mb-2">{item.label}</p>
                        <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 py-3 border-b border-gray-50">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Rent Payment Received</p>
                                <p className="text-xs text-gray-500">12 Dec 2025</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 py-3 border-b border-gray-50">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Maintenance Request Updated</p>
                                <p className="text-xs text-gray-500">10 Dec 2025</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Property Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-500">Address</span>
                            <span className="text-sm font-medium text-gray-900">123 Maple Avenue, Springfield</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-500">Unit</span>
                            <span className="text-sm font-medium text-gray-900">Apartment 4B</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-500">Lease Term</span>
                            <span className="text-sm font-medium text-gray-900">Jan 2025 - Dec 2025</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
