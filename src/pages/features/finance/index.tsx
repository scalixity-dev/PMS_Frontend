import React from "react";
import FinanceHeroSection from "./sections/hero";
import AccountingSection from "./sections/accounting";
import InvoicesSection from "./sections/invoices";
import EveryFeatureSection from "./sections/everyfeaturesection";
import ReconciliationSection from "./sections/reconciliation";
import EveryFeatureCenteredSection from "./sections/everyfeaturecentersection";
import FAQSection from "../../../pages/home/sections/faq";
import AIFeaturesSection from "../../../components/AIFeaturesSection";
import FeatureHighlightSection from "../../../components/FeatureHighlightSection";
import KeyPointsSection from "../../../components/KeyPointsSection";
import SplitHeroFeature from "../../../components/SplitHeroFeature";
import SplitHeroFeatureReverseInverse from "../../../components/SplitHeroFeatureReverseInverse";
import GradientFeatureList from "./sections/GradientFeatureList";
import { MailCheck } from "lucide-react";

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
      <FinanceHeroSection />
      {/* Every Feature You'll Need */}
      <KeyPointsSection/>

      {/* Fast Track your Money */}
      <SplitHeroFeature
        title="Fast-track your money"
        description={
          "Get quicker access to your funds with Faster Payments. Eligible PMSCloud users can enroll and receive ACH transactions in just 2-3 business days."
        }
        imageSrc={"https://res.cloudinary.com/dxwspucxw/image/upload/v1762414897/Screenshot_2025-11-06_131037_eadsof.png"}
        icon={<MailCheck className="w-10 h-10 text-white" />}
      />

      {/*AI features section (original) */}
      <AIFeaturesSection
        features={featuresData.core}
        color="#20CC95"
        textColor="white"
        buttonText="Set up online payments"
      />
      <AccountingSection />

      {/* Hero Line */}
      <div className="max-w-5xl mx-auto mt-20 text-center px-4 text-[var(--color-primary)] text-lg font-medium italic">
        “ Being able to do all of my accounting in one place allowed me to go from chasing down expenses I didn’t know existed, to being fully in control of the money coming in and out of my rental business. “
      </div>

      <GradientFeatureList/>

      <InvoicesSection />

      {/*AI features section (from screenshot) */}
      <AIFeaturesSection features={featuresData.screenshotSetA} />

      <SplitHeroFeatureReverseInverse
        title="All your rental reports, one easy dashboard"
        description={
          "The most comprehensive reporting tools for rental owners — track monthly stats, transactions, rent rolls, manage maintenance, and generate tax-ready reports in seconds."
        }
        imageSrc="https://res.cloudinary.com/dxwspucxw/image/upload/v1762414897/Screenshot_2025-11-06_131037_eadsof.png"
        icon={<MailCheck className="w-10 h-10" />}
        kicker="Reports"
      />

      <EveryFeatureSection />

      <FeatureHighlightSection
        subtitle=""
        title="Access dozens of rental reports in seconds"
        description="Create comprehensive reports to manage your rentals at the touch of a button. Check monthly stats, track transactions, view rent rolls, manage maintenance, and more."
        imageSrc="https://res.cloudinary.com/dxwspucxw/image/upload/v1762334681/Dashboard_1_attvl2.png"
      />

      {/*AI features section (screenshot set 3) */}
      <AIFeaturesSection features={featuresData.taxCards} />

      <ReconciliationSection />
      <EveryFeatureCenteredSection />

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

      <FAQSection />

    </section>
  );
};

export default FinancePage;
