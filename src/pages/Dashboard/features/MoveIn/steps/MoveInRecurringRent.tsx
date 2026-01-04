import React, { useState } from 'react';

interface MoveInRecurringRentProps {
    onNext: (enableRecurring: boolean) => void;
    onBack: () => void;
}

const MoveInRecurringRent: React.FC<MoveInRecurringRentProps> = ({ onNext }) => {
    const [selection, setSelection] = useState<'yes' | 'no' | null>(null);

    const handleSelect = (value: 'yes' | 'no') => {
        setSelection(value);
        // Auto-advance or wait for next button? 
        // Screenshot shows just the selection buttons in a container. 
        // Usually these act as the "Next" action triggers themselves or set state.
        // Given the design (big toggle-like buttons), let's make them selectable first, 
        // but looking closely they look like action buttons.
        // However, usually wizard steps have an explicit Next. 
        // But the design shows them inside a pill-shaped container.
        // Let's assume clicking them selects the value, and we might need a Next button or they trigger next immediately.
        // Re-reading user request: "Do you want to add... Yes / No".
        // I will implement them as a toggle.

        // Actually, looking at the UI, it looks like a single choice question. 
        // Clicking Yes or No likely proceeds. I'll add an explicit Next for safety or trigger on click.
        // Let's assume trigger on click for "Easy" flow feels right, but consistent navigation usually needs "Next".
        // Wait, the previous steps had a "Next" button. This screen doesn't show one in the screenshot?
        // The previous screenshot for Share Lease had a Next button.
        // This screenshot DOES NOT show a Next button below the pill. 
        // It implies clicking Yes/No might be the action. 
        // OR the Next button is cropped out. 
        // I will implement selection state and auto-advance for now, or add a Next button if needed.
        // Let's stick to the screenshot: The pill container holds the Yes/No buttons.

        onNext(value === 'yes');
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-12">
                <h2 className="text-xl font-bold mb-2 text-[#374151]">Do you want to add automatic Recurring Rent?</h2>
                <p className="text-[#6B7280]">Enable the automatic lease rent invoicing.</p>
            </div>

            <div className="bg-[#F0F2F5] rounded-[2rem] md:rounded-full p-4 flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-center shadow-inner max-w-lg w-full">
                <button
                    onClick={() => handleSelect('yes')}
                    className={`
            w-full md:w-auto px-8 md:px-16 py-3 rounded-xl md:rounded-full font-bold text-lg transition-all transform hover:scale-105
            ${selection === 'yes'
                            ? 'bg-[#7BD747] text-white shadow-md'
                            : 'bg-[#7BD747] text-white shadow-sm hover:shadow-md' // "Yes" is green in design
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
                            : 'bg-[#6B7280] text-white shadow-sm hover:shadow-md' // "No" is dark gray
                        }
          `}
                >
                    No
                </button>
            </div>
        </div>
    );
};

export default MoveInRecurringRent;
