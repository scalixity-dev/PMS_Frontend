import Breadcrumb from '../../../../components/ui/Breadcrumb';

const ProfileSettings = () => {
    return (
        <div className="p-8">
            <div className="mb-6">
                <Breadcrumb
                    items={[
                        { label: 'Settings', path: '/service-dashboard/settings' },
                        { label: 'Profile' },
                    ]}
                />
            </div>
            <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
            <p>Profile Settings Page (Placeholder)</p>
        </div>
    );
};

export default ProfileSettings;
