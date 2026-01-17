import React, { useState } from "react";
import UserAccountSettingsLayout from "../../components/layout/UserAccountSettingsLayout";
import Button from "../../../../components/common/Button";
import { CreditCard, Trash2, Plus } from "lucide-react";

const MyCards: React.FC = () => {
    const [savedCards, setSavedCards] = useState([
        {
            id: 1,
            last4: "4242",
            brand: "Visa",
            expiryMonth: 12,
            expiryYear: 2025,
            isDefault: true,
        },
    ]);

    const [showAddCard, setShowAddCard] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiryMonth, setExpiryMonth] = useState("");
    const [expiryYear, setExpiryYear] = useState("");
    const [cvv, setCvv] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const validateLuhn = (number: string) => {
        let sum = 0;
        let shouldDouble = false;
        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number.charAt(i));
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return sum % 10 === 0;
    };

    const getCardBrand = (number: string) => {
        if (number.startsWith("4")) return "Visa";
        if (/^5[1-5]/.test(number) || /^2[2-7]/.test(number)) return "Mastercard";
        if (/^3[47]/.test(number)) return "Amex";
        if (/^6(?:011|5)/.test(number)) return "Discover";
        return "Unknown";
    };

    const handleDeleteCard = (cardId: number) => {
        const cardToDelete = savedCards.find((card) => card.id === cardId);
        const remainingCards = savedCards.filter((card) => card.id !== cardId);

        // If deleting the default card and there are remaining cards, set the first one as default
        if (cardToDelete?.isDefault && remainingCards.length > 0) {
            setSavedCards(
                remainingCards.map((card, index) => ({
                    ...card,
                    isDefault: index === 0,
                }))
            );
        } else {
            setSavedCards(remainingCards);
        }
    };

    const handleSetDefault = (cardId: number) => {
        setSavedCards(
            savedCards.map((card) => ({
                ...card,
                isDefault: card.id === cardId,
            }))
        );
    };

    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        // Basic Validation
        if (!cardNumber || !cardName || !expiryMonth || !expiryYear || !cvv) {
            setErrorMsg("Please fill in all fields.");
            return;
        }

        const rawCardNumber = cardNumber.replace(/\s/g, "");
        const brand = getCardBrand(rawCardNumber);

        // Card Number Length & Luhn
        if (rawCardNumber.length < 13 || rawCardNumber.length > 19 || !validateLuhn(rawCardNumber)) {
            setErrorMsg("Invalid card number.");
            return;
        }

        // CVV Validation
        const expectedCvvLength = brand === "Amex" ? 4 : 3;
        if (cvv.length !== expectedCvvLength) {
            setErrorMsg(`Invalid CVV for ${brand}.`);
            return;
        }

        // Expiry Date Validation
        const month = parseInt(expiryMonth);
        const year = parseInt(expiryYear);
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        if (isNaN(month) || isNaN(year) || year < currentYear || (year === currentYear && month < currentMonth)) {
            setErrorMsg("Card has expired.");
            return;
        }

        setIsSubmitting(true);

        try {
            /** 
             * SIMULATED TOKENIZATION CALL
             * In a real scenario, this is where we send raw data to a payment gateway (e.g., Stripe)
             * to receive a secure token. This ensures our app never stores raw PAN/CVV.
             * The backend dev will replace this mock with the actual API integration.
             */
            await new Promise(resolve => setTimeout(resolve, 1500));

            const newCard = {
                id: Date.now(),
                last4: cardNumber.slice(-4),
                brand: brand === "Unknown" ? "Credit Card" : brand,
                expiryMonth: month,
                expiryYear: year,
                isDefault: savedCards.length === 0,
                // token: "tok_mock_123...", // This would be returned from the payment provider
            };

            setSavedCards([...savedCards, newCard]);
            setShowAddCard(false);

            // Reset form and clear raw data from memory immediately
            setCardNumber("");
            setCardName("");
            setExpiryMonth("");
            setExpiryYear("");
            setCvv("");
            setErrorMsg("");
        } catch (error) {
            setErrorMsg("Failed to securely process card. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <UserAccountSettingsLayout activeTab="My Cards">
            <div className="px-3 sm:px-4 md:px-8 pb-6 sm:pb-8 md:pb-10">
                {/* Saved Cards Section */}
                <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-3 sm:px-4 md:px-6 py-4 md:py-5 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Saved Cards</h2>
                        {!showAddCard && (
                            <Button
                                className="bg-[#486370] hover:bg-[#3a505b] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 w-full sm:w-auto justify-center"
                                onClick={() => setShowAddCard(true)}
                            >
                                <Plus size={16} />
                                <span className="sm:inline">Add New Card</span>
                            </Button>
                        )}
                    </div>

                    {/* Cards List */}
                    {savedCards.length > 0 ? (
                        <div className="space-y-3">
                            {savedCards.map((card) => (
                                <div
                                    key={card.id}
                                    className="border border-[#E8E8E8] rounded-lg lg:rounded-xl bg-white p-3 sm:p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
                                >
                                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-[#7CD947] to-[#6bc238] flex items-center justify-center flex-shrink-0">
                                            <CreditCard className="text-white" size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                                                    {card.brand} •••• {card.last4}
                                                </h3>
                                                {card.isDefault && (
                                                    <span className="px-2 py-1 bg-[#7CD947] text-white text-xs font-semibold rounded">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                                Expires {card.expiryMonth.toString().padStart(2, "0")}/{card.expiryYear}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                                        {!card.isDefault && (
                                            <Button
                                                variant="ghost"
                                                className="text-[#486370] hover:bg-gray-100 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
                                                onClick={() => handleSetDefault(card.id)}
                                            >
                                                <span className="hidden sm:inline">Set as Default</span>
                                                <span className="sm:hidden">Default</span>
                                            </Button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteCard(card.id)}
                                            className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 sm:py-8 text-gray-500">
                            <CreditCard className="mx-auto mb-3 text-gray-400" size={40} />
                            <p className="text-sm sm:text-base">No saved cards. Add a card to get started.</p>
                        </div>
                    )}
                </section>

                {/* Add New Card Form */}
                {showAddCard && (
                    <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-3 sm:px-4 md:px-6 py-4 md:py-5 space-y-4 mt-6 sm:mt-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Add New Card</h2>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#7CD947]"></span>
                                    Your payment information is encrypted and secure
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowAddCard(false);
                                    setErrorMsg("");
                                }}
                                disabled={isSubmitting}
                                className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm disabled:opacity-50 self-end sm:self-auto"
                            >
                                Cancel
                            </button>
                        </div>

                        {errorMsg && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleAddCard} className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                                    Cardholder Name
                                </label>
                                <input
                                    type="text"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CD947] text-sm sm:text-base"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                                    Card Number
                                </label>
                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ").slice(0, 19);
                                        setCardNumber(formattedValue);
                                    }}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CD947] text-sm sm:text-base"
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                <div className="col-span-1">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                                        Month
                                    </label>
                                    <select
                                        value={expiryMonth}
                                        onChange={(e) => setExpiryMonth(e.target.value)}
                                        className="w-full px-2 sm:px-4 py-2 sm:py-2.5 border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CD947] text-sm sm:text-base"
                                        required
                                    >
                                        <option value="">MM</option>
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                            <option key={month} value={month.toString().padStart(2, "0")}>
                                                {month.toString().padStart(2, "0")}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                                        Year
                                    </label>
                                    <select
                                        value={expiryYear}
                                        onChange={(e) => setExpiryYear(e.target.value)}
                                        className="w-full px-2 sm:px-4 py-2 sm:py-2.5 border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CD947] text-sm sm:text-base"
                                        required
                                    >
                                        <option value="">YYYY</option>
                                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CD947] text-sm sm:text-base"
                                        placeholder="123"
                                        maxLength={4}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[#486370] hover:bg-[#3a505b] text-white px-6 sm:px-8 py-2 sm:py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        "Add Card"
                                    )}
                                </Button>
                                <div className="flex items-center gap-3 sm:gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300 justify-center sm:justify-start">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/100px-Visa_Inc._logo.svg.png" alt="Visa" className="h-3 sm:h-4" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/100px-Mastercard-logo.svg.png" alt="Mastercard" className="h-5 sm:h-6" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/100px-PayPal.svg.png" alt="PayPal" className="h-3 sm:h-4" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/American_Express_logo.svg/100px-American_Express_logo.svg.png" alt="Amex" className="h-5 sm:h-6" />
                                </div>
                            </div>
                        </form>
                    </section>
                )}
            </div>
        </UserAccountSettingsLayout>
    );
};

export default MyCards;
