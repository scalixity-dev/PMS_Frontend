import React, { useState } from 'react';

interface MoveInDepositProps {
    onNext: (hasDeposit: boolean) => void;
    onBack: () => void;
}

const MoveInDeposit: React.FC<MoveInDepositProps> = ({ onNext }) => {
    const [selection, setSelection] = useState<'yes' | 'no' | null>(null);

    const handleSelect = (value: 'yes' | 'no') => {
        setSelection(value);
        onNext(value === 'yes');
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-12">
                <h2 className="text-xl font-bold mb-2 text-[#374151]">Do you require a deposit?</h2>
                <p className="text-[#6B7280]">Invoice for any type of deposit and input the date it was paid or is due.</p>
            </div>

            <div className="bg-[#F0F2F5] rounded-[2rem] md:rounded-full p-4 flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-center shadow-inner max-w-lg w-full">
                <button
                    onClick={() => handleSelect('yes')}
                    className={`
            w-full md:w-auto px-8 md:px-16 py-3 rounded-xl md:rounded-full font-bold text-lg transition-all transform hover:scale-105
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
            w-full md:w-auto px-8 md:px-16 py-3 rounded-xl md:rounded-full font-bold text-lg transition-all transform hover:scale-105
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

export default MoveInDeposit;
