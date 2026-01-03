import React from "react";
import UserAccountSettingsLayout from "../../components/layout/UserAccountSettingsLayout";

const Notifications: React.FC = () => {

    return (
        <UserAccountSettingsLayout activeTab="Notifications">
            <div className="px-8 py-6 min-h-[400px]">
                <p className="text-gray-500">Notifications content coming soon...</p>
            </div>
        </UserAccountSettingsLayout>
    );
};

export default Notifications;
