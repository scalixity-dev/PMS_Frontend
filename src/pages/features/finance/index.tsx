import React from "react";
import AIFeaturesSection from "../../../components/AIFeaturesSection";
import FeatureHighlightSection from "../../../components/FeatureHighlightSection";
import KeyPointsSection from "../../../components/KeyPointsSection";

const featuresData = {
  core: [
    {
      image:
        "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png",
      title: "Easy accounting & tax setup",
      description:
        "Save hours during tax season with automatic invoices, QuickBooks sync, and customizable reports. We'll even help you set up your payments so they're tailored to your business from the start.",
    },
    {
      image:
        "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png",
      title: "Free ACH payments for PMS",
      description:
        "Give PMS 50 ACH fees when they set up active rent reporting to build credit history with their rent payments each month ($4.95/month).",
    },
    {
      image:
        "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png",
      title: "Why landlords love online pay",
      description:
        "With faster payments, convenient tax tools, and a dashboard that gives you full visibility — it's no wonder why nearly 80% of PMScloud users recommend our online payments.",
    },
  ],
  screenshotSetA: [
    {
      image:
        "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png",
      title: "See Where Your Money Goes",
      description:
        "View your entire payment history, from rent collection to refunds. With real-time updates and reporting, you'll never have to dig through spreadsheets again.",
    },
    {
      image:
        "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png",
      title: "Stay Current with Bank Reconciliation",
      description:
        "Match your PmsCloud transactions to your bank statement. Spot errors like missing or duplicate entries fast, so your books stay accurate and stress-free.",
    },
    {
      image:
        "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png",
      title: "24/7 Financial Reporting",
      description:
        "Track all your invoices, rent payments, and business receipts in one place, then generate custom tax and financial reports in seconds.",
    },
  ],
  taxCards: [
    {
      image:
        "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png",
      title: "Prep for tax season",
      description:
        "Use the Tax Preparation Report and 1099 Tax Form to calculate all income and expenses, management fees paid, depreciation and interest expenses, and prepare your taxes.",
    },
    {
      image:
        "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png",
      title: "Stay competitive with Rentability Report",
      description:
        "Take the guesswork out of pricing. Powered by RentRange, the Rentability Report gives you accurate data on rental rates, vacancy trends, and market demand.",
    },
    {
      image:
        "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png",
      title: "Track loan details with ease",
      description:
        "Easily monitor amortization and depreciation for tax reporting and financial planning. Stay on top of loan balances, interest, and principal payments.",
    },
  ],
};

const FinancePage: React.FC = () => {
  return (
    <section className="w-full">

      {/* Every Feature You'll Need */}
      <KeyPointsSection/>

      {/*AI features section (original) */}
      <AIFeaturesSection
        features={featuresData.core}
        color="#20CC95"
        textColor="white"
        buttonText="Set up online payments"
      />

      {/*AI features section (from screenshot) */}
      <AIFeaturesSection features={featuresData.screenshotSetA} />

      <FeatureHighlightSection
        subtitle=""
        title="Access dozens of rental reports in seconds"
        description="Create comprehensive reports to manage your rentals at the touch of a button. Check monthly stats, track transactions, view rent rolls, manage maintenance, and more."
        imageSrc="https://res.cloudinary.com/dxwspucxw/image/upload/v1762334681/Dashboard_1_attvl2.png"
      />

      {/*AI features section (screenshot set 3) */}
      <AIFeaturesSection features={featuresData.taxCards} />

      {/* Connect any Account */}
      <FeatureHighlightSection
        subtitle=""
        title="Connect any account"
        description="Reconcile and organize your transactions in seconds. Simply connect your bank account to PMSCloud through Stripe."
        imageSrc="https://res.cloudinary.com/dxwspucxw/image/upload/v1762335597/Clip_path_group_1_v4onjf.png"
      />

      {/*AI features section (repeat from screenshot, styled) */}
      <AIFeaturesSection
        features={featuresData.taxCards}
        color="#9AD4AD"
      />



    </section>
  );
};

export default FinancePage;
