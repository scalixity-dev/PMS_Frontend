import React, { useEffect, useState } from "react";
import { CreditCard, Loader2, Plus, Trash2 } from "lucide-react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import Button from "../../../../components/common/Button";
import { SubscriptionSettingsLayout } from "../../../../components/common/SubscriptionSettingsLayout";
import { paymentsService, type SavedCard } from "../../../../services/payments.service";
import { useToast } from "../../../../components/common/Toast";
import DeleteConfirmationModal from "../../../../components/common/modals/DeleteConfirmationModal";
import { toFriendlyErrorMessage } from "@/utils/errorMessage.utils";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
const stripePromise: Promise<Stripe | null> | null = STRIPE_PUBLISHABLE_KEY
  ? loadStripe(STRIPE_PUBLISHABLE_KEY)
  : null;

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "15px",
      color: "#1f2937",
      fontFamily: "system-ui, sans-serif",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#ef4444" },
  },
};

// ─── Brand badge ────────────────────────────────────────────────────────────

const CardBrandBadge: React.FC<{ brand?: string | null }> = ({ brand }) => {
  const b = (brand ?? "").toLowerCase();
  if (b === "visa") return (
    <div className="w-12 h-12 shrink-0 rounded-lg bg-[#1434CB] flex items-center justify-center">
      <span className="text-white text-[10px] font-bold tracking-wide">VISA</span>
    </div>
  );
  if (b === "mastercard") return (
    <div className="w-12 h-12 shrink-0 rounded-lg bg-[#1F2937] flex items-center justify-center relative">
      <span className="w-4 h-4 rounded-full bg-[#EB001B] opacity-90 absolute left-3" />
      <span className="w-4 h-4 rounded-full bg-[#F79E1B] opacity-90 absolute right-3" />
    </div>
  );
  if (b === "amex" || b === "american express") return (
    <div className="w-12 h-12 shrink-0 rounded-lg bg-[#2E77BC] flex items-center justify-center">
      <span className="text-white text-[8px] font-bold tracking-wide text-center leading-tight">AMEX</span>
    </div>
  );
  return (
    <div className="w-12 h-12 shrink-0 rounded-lg bg-gradient-to-br from-[#7CD947] to-[#6bc238] flex items-center justify-center">
      <CreditCard className="text-white" size={24} />
    </div>
  );
};

// ─── Add card form (must be inside <Elements>) ───────────────────────────────

const AddCardForm: React.FC<{
  hasExistingCards: boolean;
  onSaved: (card: SavedCard) => void;
  onCancel: () => void;
}> = ({ hasExistingCards, onSaved, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast();
  const [cardholderName, setCardholderName] = useState("");
  const [setAsDefault, setSetAsDefault] = useState(!hasExistingCards);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      const { clientSecret } = await paymentsService.createSetupIntent();
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: cardholderName || undefined },
        },
      });

      if (error) {
        // Stripe's own decline/validation messages are already written for
        // end users, so show them as-is rather than genericizing them.
        setErrorMsg(error.message ?? "Card setup failed. Please check your card details and try again.");
        return;
      }

      const pmId = typeof setupIntent?.payment_method === "string"
        ? setupIntent.payment_method
        : setupIntent?.payment_method?.id;

      if (!pmId) throw new Error("No payment method returned");

      const saved = await paymentsService.saveCard(pmId, setAsDefault);
      toast.success("Card added successfully");
      cardElement.clear();
      onSaved(saved);
    } catch (err) {
      setErrorMsg(toFriendlyErrorMessage(err, "We could not add this card. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          className="w-full px-4 py-2.5 border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CD947]"
          placeholder="Name on card"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
        <div className={`px-4 py-3 border rounded-lg bg-white ${errorMsg ? 'border-red-400' : 'border-[#E8E8E8]'}`}>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        {errorMsg ? (
          <p className="mt-1.5 text-xs text-red-600">{errorMsg}</p>
        ) : (
          <p className="mt-1.5 text-xs text-gray-400 flex items-center gap-1">
            <span>🔒</span> Secured by Stripe — your card details never touch our servers
          </p>
        )}
      </div>
      {hasExistingCards && (
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={setAsDefault}
            onChange={(e) => setSetAsDefault(e.target.checked)}
            className="rounded"
          />
          Set as default payment method
        </label>
      )}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={!stripe || isSubmitting}
          className="bg-[#486370] hover:bg-[#3a505b] text-white px-8 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting && <Loader2 size={14} className="animate-spin" />}
          {isSubmitting ? "Saving…" : "Add Card"}
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

type DeleteTarget = { id: string; label: string } | null;

const MyCardSettings: React.FC = () => {
  const toast = useToast();
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  useEffect(() => {
    paymentsService.listCards()
      .then(setCards)
      .catch(() => toast.error("Failed to load saved cards"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCardSaved = (card: SavedCard) => {
    setCards((prev) => {
      const updated = card.isDefault
        ? prev.map((c) => ({ ...c, isDefault: false }))
        : [...prev];
      return [...updated, card];
    });
    setShowAddCard(false);
  };

  const handleSetDefault = async (id: string) => {
    setSettingDefaultId(id);
    try {
      await paymentsService.setDefaultCard(id);
      setCards((prev) => prev.map((c) => ({ ...c, isDefault: c.id === id })));
      toast.success("Default card updated");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update default card");
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const result = await paymentsService.deleteCard(deleteTarget.id);
      setCards((prev) => {
        const remaining = prev.filter((c) => c.id !== deleteTarget.id);
        if (result.newDefaultCardId) {
          return remaining.map((c) => ({ ...c, isDefault: c.id === result.newDefaultCardId }));
        }
        return remaining;
      });
      toast.success("Card removed");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to remove card");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <SubscriptionSettingsLayout activeTab="my-card">
      {/* Saved Cards */}
      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Saved Cards</h2>
          {!showAddCard && (
            <Button
              className="bg-[#486370] hover:bg-[#3a505b] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 w-full sm:w-auto justify-center"
              onClick={() => setShowAddCard(true)}
            >
              <Plus size={16} />
              Add New Card
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500 flex items-center justify-center gap-2">
            <Loader2 size={18} className="animate-spin" />
            Loading cards…
          </div>
        ) : cards.length === 0 && !showAddCard ? (
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="mx-auto mb-3 text-gray-400" size={48} />
            <p>No saved cards. Add a card to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className="border border-[#E8E8E8] rounded-xl bg-white p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <CardBrandBadge brand={card.brand} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {card.brand ? card.brand.charAt(0).toUpperCase() + card.brand.slice(1) : "Card"} ••••{" "}
                        {card.last4}
                      </h3>
                      {card.isDefault && (
                        <span className="px-2 py-1 bg-[#7CD947] text-white text-xs font-semibold rounded">
                          Default
                        </span>
                      )}
                    </div>
                    {card.expMonth && card.expYear && (
                      <p className="text-sm text-gray-600 mt-1">
                        Expires {String(card.expMonth).padStart(2, "0")}/{card.expYear}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {!card.isDefault && (
                    <Button
                      variant="ghost"
                      className="text-[#486370] hover:bg-gray-100 px-4 py-2 text-sm"
                      onClick={() => handleSetDefault(card.id)}
                      disabled={settingDefaultId === card.id}
                    >
                      {settingDefaultId === card.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        "Set as Default"
                      )}
                    </Button>
                  )}
                  <button
                    onClick={() =>
                      setDeleteTarget({
                        id: card.id,
                        label: `${card.brand ?? "card"} ending in ${card.last4}`,
                      })
                    }
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add New Card Form */}
      {showAddCard && (
        <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Add New Card</h2>
          {stripePromise ? (
            <Elements stripe={stripePromise}>
              <AddCardForm
                hasExistingCards={cards.length > 0}
                onSaved={handleCardSaved}
                onCancel={() => setShowAddCard(false)}
              />
            </Elements>
          ) : (
            <p className="text-red-500 text-sm">
              Stripe is not configured. Set VITE_STRIPE_PUBLISHABLE_KEY to enable card management.
            </p>
          )}
        </section>
      )}

      {/* Delete confirmation */}
      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Card"
        message={`Remove ${deleteTarget?.label ?? "this card"}? This action cannot be undone.`}
        confirmText="Remove"
        isLoading={isDeleting}
      />
    </SubscriptionSettingsLayout>
  );
};

export default MyCardSettings;
