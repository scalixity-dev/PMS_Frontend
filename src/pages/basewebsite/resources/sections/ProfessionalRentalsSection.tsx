import HeroCard from "../../../../components/common/cards/HeroCard"

export const ProfessionalRentalsSection = () => {
    return (
        <HeroCard
            title="Professional rental forms at your fingertips"
            betweenTitleAndDescription="Each form has been thoroughly vetted by real estate attorneys to ensure compliance, accuracy, and protection for landlords. Plus, with built-in customization options, you can personalize documents while maintaining legal integrity."
            description="Free with your SmartTenantAICloud Pro/Business plans or available for purchase on Starter/Growth plans."
            features={[]}
            learnMoreLabel=""
            showStamp={false}
            showBackgroundCard={false}
            imageSrc="/professional_dashboard.png"
            imageWidth={450}
            imageHeight={300}
            backgroundImageSrc="/bg_vector2.png"
            reverseLayout={true}
            showImageShadow={false}
            imageNoTranslate={true}
            imageContain={true}
            imageMaxHeight="max-h-[40rem]"
            titleMarginBottom="mb-4"
            descriptionMarginBottom="mb-6"
        />
    )
}