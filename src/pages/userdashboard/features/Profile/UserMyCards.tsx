import React, { useEffect, useMemo, useState } from "react";
import UserAccountSettingsLayout from "../../components/layout/UserAccountSettingsLayout";
import Button from "../../../../components/common/Button";
import { CreditCard, Trash2, Plus, Loader2 } from "lucide-react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { paymentsService, type SavedCard } from "../../../../services/payments.service";
import { useToast } from "../../../../components/common/Toast";
import DeleteConfirmationModal from "../../../../components/common/modals/DeleteConfirmationModal";
import { toFriendlyErrorMessage } from "@/utils/errorMessage.utils";

/**
 * My Cards — Stripe-powered. Uses SetupIntent + Stripe Elements to tokenize
 * card details client-side. Raw PAN/CVV never touches our servers.
 */

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

const cardBrandLabel = (brand?: string | null) => {
    if (!brand) return "Card";
    return brand.charAt(0).toUpperCase() + brand.slice(1);
};

const AddCardForm: React.FC<{ onSaved: () => void; onCancel: () => void; hasExistingCards: boolean }> = ({
    onSaved,
    onCancel,
    hasExistingCards,
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [cardholderName, setCardholderName] = useState("");
    const [setAsDefault, setSetAsDefault] = useState(!hasExistingCards);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [nameError, setNameError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setNameError("");
        if (!stripe || !elements) {
            setErrorMsg("Stripe has not loaded yet. Please try again.");
            return;
        }
        if (!cardholderName.trim()) {
            setNameError("Cardholder name is required");
            return;
        }

        setIsSubmitting(true);
        try {
            const { clientSecret } = await paymentsService.createSetupIntent();
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) throw new Error("Card element not ready");

            const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: { name: cardholderName.trim() },
                },
            });
            // Stripe's own decline/validation messages are already written for
            // end users, so show them as-is rather than genericizing them.
            if (error) throw new Error(error.message || "Card setup failed. Please check your card details and try again.");
            if (!setupIntent?.payment_method) throw new Error("Setup incomplete");

            const pmId = typeof setupIntent.payment_method === "string"
                ? setupIntent.payment_method
                : setupIntent.payment_method.id;

            await paymentsService.saveCard(pmId, setAsDefault);

            cardElement.clear();
            setCardholderName("");
            onSaved();
        } catch (err) {
            setErrorMsg(toFriendlyErrorMessage(err, "We could not save this card. Please try again."));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Cardholder Name
                </label>
                <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => {
                        setCardholderName(e.target.value);
                        if (nameError) setNameError("");
                    }}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CD947] text-sm sm:text-base ${nameError ? 'border-red-500' : 'border-[#E8E8E8]'}`}
                    placeholder="John Doe"
                    required
                />
                {nameError && <p className="mt-1.5 text-xs text-red-600">{nameError}</p>}
            </div>
            <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Card Details
                </label>
                <div className={`w-full px-3 sm:px-4 py-3 border rounded-lg bg-white focus-within:ring-2 focus-within:ring-[#7CD947] ${errorMsg ? 'border-red-400' : 'border-[#E8E8E8]'}`}>
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
                {errorMsg && <p className="mt-1.5 text-xs text-red-600">{errorMsg}</p>}
            </div>
            {hasExistingCards && (
                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={setAsDefault}
                        onChange={(e) => setSetAsDefault(e.target.checked)}
                        className="rounded text-[#7CD947] focus:ring-[#7CD947]"
                    />
                    Set as default payment method
                </label>
            )}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                    type="submit"
                    disabled={isSubmitting || !stripe}
                    className="bg-[#486370] hover:bg-[#3a505b] text-white px-6 sm:px-8 py-2 sm:py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Add Card"
                    )}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="text-gray-700 border border-gray-200 hover:bg-gray-50 px-6 sm:px-8 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};

const MyCards: React.FC = () => {
    const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [showAddCard, setShowAddCard] = useState(false);
    const [busyCardId, setBusyCardId] = useState<string | null>(null);
    const [cardToDelete, setCardToDelete] = useState<string | null>(null);
    const toast = useToast();

    const loadCards = async () => {
        setIsLoading(true);
        setLoadError(null);
        try {
            const cards = await paymentsService.listCards();
            setSavedCards(cards);
        } catch (err) {
            setLoadError(toFriendlyErrorMessage(err, "We could not load your saved cards. Please try again."));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCards();
    }, []);

    const handleDeleteCard = (cardId: string) => {
        setCardToDelete(cardId);
    };

    const confirmDeleteCard = async () => {
        if (!cardToDelete) return;
        setBusyCardId(cardToDelete);
        try {
            await paymentsService.deleteCard(cardToDelete);
            setCardToDelete(null);
            await loadCards();
        } catch (err) {
            toast.error(toFriendlyErrorMessage(err, "We could not remove this card. Please try again."));
        } finally {
            setBusyCardId(null);
        }
    };

    const handleSetDefault = async (cardId: string) => {
        setBusyCardId(cardId);
        try {
            await paymentsService.setDefaultCard(cardId);
            await loadCards();
        } catch (err) {
            toast.error(toFriendlyErrorMessage(err, "We could not set this as your default card. Please try again."));
        } finally {
            setBusyCardId(null);
        }
    };

    const stripeMissing = useMemo(() => !stripePromise, []);

    return (
        <UserAccountSettingsLayout activeTab="My Cards">
            <DeleteConfirmationModal
                isOpen={!!cardToDelete}
                onClose={() => setCardToDelete(null)}
                onConfirm={confirmDeleteCard}
                isLoading={!!busyCardId}
                title="Remove Card"
                message="Remove this card from your account? This cannot be undone."
                confirmText="Remove"
            />
            <div className="px-3 sm:px-4 md:px-8 pb-6 sm:pb-8 md:pb-10">
                <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-3 sm:px-4 md:px-6 py-4 md:py-5 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Saved Cards</h2>
                        {!showAddCard && !stripeMissing && (
                            <Button
                                className="bg-[#486370] hover:bg-[#3a505b] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 w-full sm:w-auto justify-center"
                                onClick={() => setShowAddCard(true)}
                            >
                                <Plus size={16} />
                                <span className="sm:inline">Add New Card</span>
                            </Button>
                        )}
                    </div>

                    {stripeMissing && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg">
                            Stripe is not configured. Set <code>VITE_STRIPE_PUBLISHABLE_KEY</code> in the frontend
                            and <code>STRIPE_SECRET_KEY</code> on the backend to enable card management.
                        </div>
                    )}

                    {loadError && (
                        <p className="text-sm text-red-600">{loadError}</p>
                    )}

                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-[#7CD947]" />
                        </div>
                    ) : savedCards.length > 0 ? (
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
                                                    {cardBrandLabel(card.brand)} •••• {card.last4}
                                                </h3>
                                                {card.isDefault && (
                                                    <span className="px-2 py-1 bg-[#7CD947] text-white text-xs font-semibold rounded">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                                Expires {String(card.expMonth ?? 0).padStart(2, "0")}/{card.expYear ?? ""}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                                        {!card.isDefault && (
                                            <Button
                                                variant="ghost"
                                                disabled={busyCardId === card.id}
                                                className="text-[#486370] hover:bg-gray-100 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm disabled:opacity-50"
                                                onClick={() => handleSetDefault(card.id)}
                                            >
                                                <span className="hidden sm:inline">Set as Default</span>
                                                <span className="sm:hidden">Default</span>
                                            </Button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteCard(card.id)}
                                            disabled={busyCardId === card.id}
                                            className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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

                {showAddCard && stripePromise && (
                    <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-3 sm:px-4 md:px-6 py-4 md:py-5 space-y-4 mt-6 sm:mt-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Add New Card</h2>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#7CD947]"></span>
                                    Payment details are tokenized by Stripe — your card never touches our servers.
                                </p>
                            </div>
                        </div>

                        <Elements stripe={stripePromise}>
                            <AddCardForm
                                hasExistingCards={savedCards.length > 0}
                                onSaved={async () => {
                                    setShowAddCard(false);
                                    await loadCards();
                                }}
                                onCancel={() => setShowAddCard(false)}
                            />
                        </Elements>
                    </section>
                )}
            </div>
        </UserAccountSettingsLayout>
    );
};

export default MyCards;
