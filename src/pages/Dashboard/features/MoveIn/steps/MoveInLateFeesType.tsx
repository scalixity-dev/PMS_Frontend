import React from 'react';
import { Clock, Calendar } from 'lucide-react';

interface MoveInLateFeesTypeProps {
    onNext: (type: 'one-time' | 'daily' | 'both') => void;
    onBack: () => void;
}

const MoveInLateFeesType: React.FC<MoveInLateFeesTypeProps> = ({ onNext }) => {
    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-12">
                <h2 className="text-xl font-bold mb-2 text-[#374151]">What type of Automatic Late Fees?</h2>
                <p className="text-[#6B7280]">Select the option below.</p>
            </div>

            <div className="bg-[#F3F4F6] rounded-[2rem] md:rounded-full p-4 flex flex-col md:flex-row gap-4 items-center justify-center shadow-inner w-full max-w-4xl">
                <button
                    onClick={() => onNext('one-time')}
                    className="flex items-center gap-3 px-6 md:px-8 py-3.5 rounded-xl md:rounded-full font-medium text-white transition-all bg-[#7BD747] hover:bg-[#6ac13c] shadow-md w-full md:w-auto md:min-w-[240px] justify-center"
                >
                    <Clock size={20} className="text-white" />
                    <span>One time rent late fee</span>
                </button>

                <button
                    onClick={() => onNext('daily')}
                    className="flex items-center gap-3 px-6 md:px-8 py-3.5 rounded-xl md:rounded-full font-medium text-white transition-all bg-[#6B7280] hover:bg-[#5a606b] shadow-md w-full md:w-auto md:min-w-[240px] justify-center"
                >
                    <Calendar size={20} className="text-white" />
                    <span>Daily rent late fee</span>
                </button>

                <button
                    onClick={() => onNext('both')}
                    className="flex items-center gap-3 px-6 md:px-8 py-3.5 rounded-xl md:rounded-full font-medium text-white transition-all bg-[#3D7475] hover:bg-[#2c5251] shadow-md w-full md:w-auto md:min-w-[240px] justify-center"
                >
                    <Clock size={20} className="text-white" />
                    <span className="mx-1">+</span>
                    <Calendar size={20} className="text-white" />
                    <span>Both</span>
                </button>
            </div>
        </div>
    );
};

export default MoveInLateFeesType;
