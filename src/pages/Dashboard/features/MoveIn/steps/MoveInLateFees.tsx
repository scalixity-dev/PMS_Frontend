import React, { useState } from 'react';

interface MoveInLateFeesProps {
    onNext: (enableLateFees: boolean) => void;
    onBack: () => void;
}

const MoveInLateFees: React.FC<MoveInLateFeesProps> = ({ onNext }) => {
    const [selection, setSelection] = useState<'yes' | 'no' | null>(null);

    const handleSelect = (value: 'yes' | 'no') => {
        setSelection(value);
        onNext(value === 'yes');
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-12">
                <h2 className="text-xl font-bold mb-2 text-[#374151] max-w-lg mx-auto">Do you want to enable automatic Late fees?</h2>
                <p className="text-[#6B7280] max-w-xl mx-auto leading-relaxed">The system will automatically generate the following late fee once the tenant's grace period has expired.</p>
            </div>

            <div className="bg-[#F0F2F5] rounded-full p-4 flex gap-8 items-center justify-center shadow-inner max-w-lg w-full">
                <button
                    onClick={() => handleSelect('yes')}
                    className={`
            px-16 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105
            ${selection === 'yes'
                            ? 'bg-[#7BD747] text-white shadow-md'
                            : 'bg-[#7BD747] text-white shadow-sm hover:shadow-md'
                        }
          `}
                >
                    Yes
                </button>

                <button
                    onClick={() => handleSelect('no')}
                    className={`
            px-16 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105
            ${selection === 'no'
                            ? 'bg-[#6B7280] text-white shadow-md'
                            : 'bg-[#6B7280] text-white shadow-sm hover:shadow-md'
                        }
          `}
                >
                    No
                </button>
            </div>
        </div>
    );
};

export default MoveInLateFees;
