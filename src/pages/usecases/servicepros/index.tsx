import React from "react";
import FeatureShowcaseWithCards from "./sections/FeatureShowcaseWithCards";
import SkillFeaturesSection from "./sections/SkillFeaturesSection";
import ExplorePropertiesBanner from "../../../components/ExplorePropertiesBanner";
import { 
  Briefcase, 
  Award, 
  Home,
  MessageSquare,
  FileText,
  Calendar,
  Wrench,
  DollarSign,
  Users
} from "lucide-react";

const ServiceProsPage: React.FC = () => {
  return (
    <div className="w-full">
      <SkillFeaturesSection />
    
      {/* Section 1: Create a business profile in minutes */}
      <FeatureShowcaseWithCards
      reverse
        heading="Create a business profile in minutes"
        description="Stay organized with total control—giving you the time to manage your rentals now"
        buttonText="Get Started"
        imageSrc="https://res.cloudinary.com/dxwspucxw/image/upload/v1762936372/Dashboard_tzcyqm.png" 
        imageMaxWidth="500px"
        pushImageOuter={true}
        features={[
          {
            icon: <Briefcase size={24} />,
            title: "Show off your skills",
            description: "Build out your profile and showcase your expertise to attract new clients"
          },
          {
            icon: <Award size={24} />,
            title: "Add your experience",
            description: "Highlight your work history and past projects to build trust and credibility"
          },
          {
            icon: <Home size={24} />,
            title: "Build your reputation",
            description: "Collect reviews and ratings to establish a strong professional presence"
          }
        ]}
        backgroundColor="#ffffff"
      />

      {/* Section 2: Handle Maintenance Requests in One Place */}
      <FeatureShowcaseWithCards
        heading="Handle Maintenance Requests in One Place"
        description="No more phone logs or missed texts. With online tracking and notifications that allow you to help tenants in real-time. 24/7."
        buttonText="Get Started"
        imageSrc="https://res.cloudinary.com/dxwspucxw/image/upload/v1762936436/Content_1_v2o1fo.png" // Replace with actual image URL
        backgroundVectorSrc="https://res.cloudinary.com/dxwspucxw/image/upload/v1762936421/Rectangle_4437_mgh7ja.png" // Replace with actual vector background
        features={[
          {
            icon: <MessageSquare size={24} />,
            title: "Built-in messenger",
            description: "Chat through tasks and maintenance issues with clients directly in the app"
          },
          {
            icon: <FileText size={24} />,
            title: "Work lists to know",
            description: "See real time status in a single dashboard. Schedule jobs, track progress and stay on top"
          },
          {
            icon: <Calendar size={24} />,
            title: "Maintenance Overview",
            description: "Track all the maintenance activities and schedule upcoming work all in one place"
          }
        ]}
        backgroundColor="#ffffff"
      />

      {/* Section 3: Manage your service business from A to Z */}
      <FeatureShowcaseWithCards
      reverse
        heading="Manage your service business from A to Z"
        description="Stay organized and grow your business with tools that busy service pros, through receipts to payments, everything you need is right at your fingertips."
        buttonText="Get Started"
        imageSrc="https://res.cloudinary.com/dxwspucxw/image/upload/v1762936523/9a212322aec3cb78c17930176bcb8e7673408294_1_jw35ze.png" // Replace with actual image URL
        backgroundVectorSrc="https://res.cloudinary.com/dxwspucxw/image/upload/v1762936485/Rectangle_234_c1rrin.png"
        imageMaxWidth="500px"
        pushImageOuter={true}
        features={[
          {
            icon: <Wrench size={24} />,
            title: "Auto verification",
            description: "Allow landlords and property managers to verify that tenants are properly taken care"
          },
          {
            icon: <Users size={24} />,
            title: "Client relationships",
            description: "Work for top apartments and managers who are looking for quality service and reliability"
          },
          {
            icon: <DollarSign size={24} />,
            title: "Work on the go",
            description: "Use it on your desktop, laptop, and desktop, while mobile app keeps you connected."
          }
        ]}
        backgroundColor="#ffffff"
      />
        <ExplorePropertiesBanner />
    </div>
  );
};

export default ServiceProsPage;