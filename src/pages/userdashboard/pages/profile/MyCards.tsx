import React from "react";
import UserAccountSettingsLayout from "../../components/layout/UserAccountSettingsLayout";

const MyCards: React.FC = () => {

    return (
        <UserAccountSettingsLayout activeTab="My Cards">
            <div className="px-8 py-6 min-h-[400px]">
                <p className="text-gray-500">My Cards content coming soon...</p>
            </div>
        </UserAccountSettingsLayout>
    );
};

export default MyCards;
