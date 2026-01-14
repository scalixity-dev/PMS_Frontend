import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Placeholder for random avatar generation
const getRandomAvatar = () => {
    const avatars = [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
};

const Welcome: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { fullName, email, invited } = location.state || { fullName: 'User', email: 'user@example.com', invited: false };

    // Extract First Name for the Title
    const firstName = fullName.split(' ')[0];
    const avatar = getRandomAvatar();

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-white px-6">
            {/* Background Abstract Shapes */}
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#4CAF50] md:h-[600px] md:w-[600px]"></div>
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#4CAF50] md:h-[500px] md:w-[500px]"></div>

            <div className="z-10 flex w-full max-w-lg flex-col items-center text-center">
                <h1 className="mb-2 text-4xl font-bold text-black">Welcome, {firstName}</h1>

                {/* Invitation Text - Conditional */}
                {invited && (
                    <>
                        <p className="mb-6 text-xl font-medium text-black">You've been invited to connect</p>
                        <p className="mb-12 text-gray-600">
                            Your property manager has invited you to set up a <br /> Service Pro account
                        </p>
                    </>
                )}
                {!invited && <div className="mb-12"></div>}


                {/* User Profile Card */}
                <div className="mb-4 flex flex-col items-center">
                    <div className="mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
                        <img
                            src={avatar}
                            alt="User Avatar"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <h2 className="text-xl font-bold text-black">{fullName}</h2>
                    <p className="text-gray-500">{email}</p>
                </div>

                <div className="mt-12 w-full max-w-40">
                    <button
                        onClick={() => navigate('/service-dashboard/select-profession', { state: { fullName, email } })}
                        className="w-full rounded-lg bg-[#7CD947] border border-white border-2 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#7CB342] focus:outline-none"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
