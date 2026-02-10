import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ServiceBreadCrumb from "../../../../components/ServiceBreadCrumb";
import ServiceTabs from "../../../../components/ServiceTabs";
import BankAccount from "./BankAccount";
import Entities from "./Entities";
import TaxForms from "./TaxForms";

const ServiceOnlinePayment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("bank-account");

    useEffect(() => {
        if (location.pathname.includes("bank-account")) {
            setActiveTab("bank-account");
        } else if (location.pathname.includes("entities")) {
            setActiveTab("entities");
        } else if (location.pathname.includes("tax-forms")) {
            setActiveTab("tax-forms");
        }
    }, [location.pathname]);

    const handleTabChange = (val: string) => {
        setActiveTab(val);
        if (val === "bank-account") navigate("/service-dashboard/settings/bank-account");
        if (val === "entities") navigate("/service-dashboard/settings/entities");
        if (val === "tax-forms") navigate("/service-dashboard/settings/tax-forms");
    };

    return (
        <div className="min-h-screen font-sans">
            <div className="w-full">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <ServiceBreadCrumb
                        items={[
                            { label: "Dashboard", to: "/service-dashboard" },
                            { label: "Settings", to: "/service-dashboard/settings" },
                            { label: "Online Payment", active: true },
                        ]}
                    />
                </div>

                {/* Main Content Card */}
                <div className="bg-[#F6F6F6] rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 py-4 md:px-6 border-b border-gray-200">
                        <h1 className="text-2xl font-semibold text-gray-800">Online Payment</h1>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 px-4 md:px-6 pt-2 overflow-x-auto no-scrollbar">
                        <ServiceTabs
                            tabs={[
                                { label: "Bank Account", value: "bank-account" },
                                { label: "Entities", value: "entities" },
                                { label: "Tax Forms", value: "tax-forms" },
                            ]}
                            activeTab={activeTab}
                            onTabChange={handleTabChange}
                            className="border-none"
                        />
                    </div>

                    <div className="p-4 md:p-8">
                        {activeTab === "bank-account" && <BankAccount />}

                        {activeTab === "entities" && <Entities />}

                        {activeTab === "tax-forms" && <TaxForms />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceOnlinePayment;
