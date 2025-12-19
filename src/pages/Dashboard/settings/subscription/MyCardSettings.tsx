import React, { useState } from "react";
import Button from "../../../../components/common/Button";
import { CreditCard, Trash2, Plus } from "lucide-react";
import { SubscriptionSettingsLayout } from "../../../../components/common/SubscriptionSettingsLayout";

const MyCardSettings: React.FC = () => {
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
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");

  const handleDeleteCard = (cardId: number) => {
    setSavedCards(savedCards.filter((card) => card.id !== cardId));
  };

  const handleSetDefault = (cardId: number) => {
    setSavedCards(
      savedCards.map((card) => ({
        ...card,
        isDefault: card.id === cardId,
      }))
    );
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    // Add card logic here
    const newCard = {
      id: savedCards.length + 1,
      last4: cardNumber.slice(-4),
      brand: cardNumber.startsWith("4") ? "Visa" : "Mastercard",
      expiryMonth: parseInt(expiryMonth),
      expiryYear: parseInt(expiryYear),
      isDefault: savedCards.length === 0,
    };
    setSavedCards([...savedCards, newCard]);
    setShowAddCard(false);
    // Reset form
    setCardNumber("");
    setCardName("");
    setExpiryMonth("");
    setExpiryYear("");
    setCvv("");
  };

  return (
    <SubscriptionSettingsLayout activeTab="my-card">
      {/* Saved Cards Section */}
      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-5 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Saved Cards</h2>
          {!showAddCard && (
            <Button
              className="bg-[#486370] hover:bg-[#3a505b] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2"
              onClick={() => setShowAddCard(true)}
            >
              <Plus size={16} />
              Add New Card
            </Button>
          )}
        </div>

        {/* Cards List */}
        {savedCards.length > 0 ? (
          <div className="space-y-3">
            {savedCards.map((card) => (
              <div
                key={card.id}
                className="border border-[#E8E8E8] rounded-xl bg-white p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#7CD947] to-[#6bc238] flex items-center justify-center">
                    <CreditCard className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {card.brand} •••• {card.last4}
                      </h3>
                      {card.isDefault && (
                        <span className="px-2 py-1 bg-[#7CD947] text-white text-xs font-semibold rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Expires {card.expiryMonth.toString().padStart(2, "0")}/{card.expiryYear}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!card.isDefault && (
                    <Button
                      variant="ghost"
                      className="text-[#486370] hover:bg-gray-100 px-4 py-2 text-sm"
                      onClick={() => handleSetDefault(card.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="mx-auto mb-3 text-gray-400" size={48} />
            <p>No saved cards. Add a card to get started.</p>
          </div>
        )}
      </section>

      {/* Add New Card Form */}
      {showAddCard && (
        <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-5 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Add New Card</h2>
            <button
              onClick={() => setShowAddCard(false)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddCard} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CD947]"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, "").slice(0, 16))}
                className="w-full px-4 py-2.5 border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CD947]"
                placeholder="1234 5678 9012 3456"
                maxLength={16}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month
                </label>
                <select
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CD947]"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <select
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CD947]"
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
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="w-full px-4 py-2.5 border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CD947]"
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="bg-[#486370] hover:bg-[#3a505b] text-white px-8 py-2 rounded-lg font-medium"
              >
                Add Card
              </Button>
            </div>
          </form>
        </section>
      )}
    </SubscriptionSettingsLayout>
  );
};

export default MyCardSettings;


