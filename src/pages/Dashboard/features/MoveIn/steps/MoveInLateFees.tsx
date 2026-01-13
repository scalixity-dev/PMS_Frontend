import React, { useState } from 'react';
import { useMoveInStore } from '../store/moveInStore';

interface MoveInLateFeesProps {
    onNext: (enableLateFees: boolean) => void;
    onBack: () => void;
}

const MoveInLateFees: React.FC<MoveInLateFeesProps> = ({ onNext }) => {
    const { setLateFees } = useMoveInStore();
    const [selection, setSelection] = useState<'yes' | 'no' | null>(null);

    const handleSelect = (value: 'yes' | 'no') => {
        setSelection(value);
        const enabled = value === 'yes';
        setLateFees({ enabled });
        onNext(enabled);
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-12">
                <h2 className="text-xl font-bold mb-2 text-[#374151] max-w-lg mx-auto">Do you want to enable automatic Late fees?</h2>
                <p className="text-[#6B7280] max-w-xl mx-auto leading-relaxed">The system will automatically generate the following late fee once the tenant's grace period has expired.</p>
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

export default MoveInLateFees;
