import React, { useState } from "react";
import { translations } from "../i18n/translations";
import { Sparkles, Check, CreditCard, ShieldCheck, X } from "lucide-react";

interface PremiumModalProps {
  currentLang: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  currentLang,
  isOpen,
  onClose,
  onSuccess
}) => {
  if (!isOpen) return null;

  const t = translations[currentLang] || translations.en;

  // Checkout states
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number with spaces every 4 digits
    const value = e.target.value.replace(/\D/g, "").substring(0, 16);
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(" "));
    } else {
      setCardNumber(value);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format expiry as MM/YY
    const value = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (value.length >= 2) {
      setExpiry(`${value.substring(0, 2)}/${value.substring(2, 4)}`);
    } else {
      setExpiry(value);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 3);
    setCvc(value);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (cardNumber.replace(/\s/g, "").length < 16) {
      setError("Please enter a valid 16-digit credit card number.");
      return;
    }
    if (expiry.length < 5) {
      setError("Please enter expiration date (MM/YY).");
      return;
    }
    if (cvc.length < 3) {
      setError("Please enter 3-digit CVV security code.");
      return;
    }

    setLoading(true);

    // Simulate secure Stripe subscription api connection
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onSuccess(email);
        onClose();
        // Reset states
        setSuccess(false);
        setCardNumber("");
        setExpiry("");
        setCvc("");
        setEmail("");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 transition-all duration-300 transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header visual accent bar */}
        <div className="h-2 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          /* Success Screen */
          <div className="p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[450px]">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mb-6 animate-bounce">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              {t.checkoutSuccess}
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 max-w-md">
              Your unlimited converter access has been unlocked. Ads have been permanently removed! Enjoy ultra-fast transfers.
            </p>
            {/* Tiny Confetti Visual Simulation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-1/4 w-2 h-2 bg-indigo-500 rounded-full animate-ping duration-1000" />
              <div className="absolute top-1/3 right-1/4 w-3.5 h-3.5 bg-yellow-500 rounded-full animate-pulse duration-700" />
              <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-pink-500 rounded-full animate-ping duration-1500" />
            </div>
          </div>
        ) : (
          /* Main Subscription Screen */
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Side: Features and Pricing */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-full dark:bg-indigo-950/50 dark:text-indigo-400 mb-4 uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                  Premium Upgrade
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">
                  {t.upgradeModalTitle}
                </h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
                  {t.upgradeModalSub}
                </p>

                {/* Checklist */}
                <ul className="space-y-3 mb-6">
                  {t.premiumFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
                      <div className="flex-shrink-0 mt-0.5 p-0.5 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Tag Footer */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-zinc-950 dark:border-zinc-850 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Price</div>
                  <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">{t.premiumPlanPrice}</div>
                </div>
                <div className="text-xs text-slate-500 dark:text-zinc-400 text-right">
                  Secure Billing<br />Cancel anytime
                </div>
              </div>
            </div>

            {/* Right Side: Mock Credit Card Checkout Form */}
            <div className="flex flex-col justify-center border-t border-slate-100 pt-6 md:pt-0 md:border-t-0 md:border-l md:pl-8 dark:border-zinc-800">
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-500" />
                Secure Checkout
              </h4>

              {error && (
                <div className="mb-4 p-3 text-xs font-semibold text-rose-600 bg-rose-50 rounded-xl dark:bg-rose-950/30 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubscribe} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:bg-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                    {t.checkoutCard}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4242 4242 4242 4242"
                      required
                      className="w-full px-4 py-3 pl-11 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:bg-zinc-900"
                    />
                    <div className="absolute left-4 top-3.5 text-slate-400 dark:text-zinc-600">
                      <CreditCard className="w-4.5 h-4.5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                      {t.checkoutExpiry}
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      required
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:bg-zinc-900 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                      {t.checkoutCvc}
                    </label>
                    <input
                      type="text"
                      value={cvc}
                      onChange={handleCvcChange}
                      placeholder="123"
                      required
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:bg-zinc-900 text-center"
                    />
                  </div>
                </div>

                {/* Guarantee Indicator */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-zinc-500 justify-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span>Stripe Secure SSL Encryption Enabled</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 font-bold text-white bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-xl transition-all shadow-lg shadow-indigo-600/25 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Securing Connection...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span>{t.checkoutBtn}</span>
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
