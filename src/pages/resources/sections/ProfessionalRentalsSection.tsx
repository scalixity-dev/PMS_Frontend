import HeroCard from "../../../components/common/cards/HeroCard"

export const ProfessionalRentalsSection = () => {
    return(
        <HeroCard
            title="Professional rental forms at your fingertips"
            betweenTitleAndDescription="Each form has been thoroughly vetted by real estate attorneys to ensure compliance, accuracy, and protection for landlords. Plus, with built-in customization options, you can personalize documents while maintaining legal integrity."
            description="Free with your PmsCloud Pro/Business plans or available for purchase on Starter/Growth plans."
            features={[]}
            learnMoreLabel=""
            getStartedLabel=""
            showStamp={false}
            showBackgroundCard={false}
            reverseLayout={true}
            imageSrc="/professionalRental.png"
            showImageShadow={false}
            imageNoTranslate={true}
            imageMaxHeight="max-h-[35rem]"
            imageHeight={460}
            titleMarginBottom="mb-6"
            descriptionMarginBottom="mt-6"
        />
    )
}