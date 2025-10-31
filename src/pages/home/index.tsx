import React from 'react';
import { ArrowRight, Home } from 'lucide-react';
import FeaturesSection from '../../components/FeaturesSection';
import EverythingElseSection from '../../components/EverythingElseSection';
import ScalableSolutionSection from '../../components/ScalableSolutionSection';
import ExplorePropertiesBanner from '../../components/ExplorePropertiesBanner';

const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--color-header-bg)] to-white py-20 px-6 rounded-xl">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
            {/* Left Content */}
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <h1 
                  className="text-5xl font-bold leading-tight lg:text-6xl"
                  style={{ 
                    fontFamily: 'var(--font-heading)', 
                    color: 'var(--color-heading)' 
                  }}
                >
                  Discover Your Dream Property
                </h1>
                <p 
                  className="text-lg leading-relaxed lg:text-xl"
                  style={{ color: 'var(--color-subheading)' }}
                >
                  Find the perfect home with our comprehensive property management solutions. 
                  We make buying, selling, and managing properties effortless.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="group flex items-center gap-2 rounded-full bg-[var(--color-active)] px-8 py-3 font-semibold text-white shadow-lg transition-all hover:bg-[#17a878] hover:shadow-xl">
                  Browse Properties
                  <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
                </button>
                <button className="rounded-full border-2 border-[var(--color-primary)] bg-white px-8 py-3 font-semibold text-[var(--color-primary)] transition-all hover:bg-[var(--color-primary)] hover:text-white">
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <h3 className="text-3xl font-bold text-[var(--color-primary)]">200+</h3>
                  <p className="text-sm text-[var(--color-subheading)]">Properties</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-[var(--color-primary)]">50+</h3>
                  <p className="text-sm text-[var(--color-subheading)]">Happy Clients</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-[var(--color-primary)]">10+</h3>
                  <p className="text-sm text-[var(--color-subheading)]">Years Experience</p>
                </div>
              </div>
            </div>

            {/* Right Image/Illustration */}
            <div className="relative flex items-center justify-center">
              <div className="relative h-96 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] shadow-2xl lg:h-[500px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Home size={200} className="text-white opacity-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Everything Else Section*/}
      <EverythingElseSection />

      {/* ScalableSolution Section*/}
      <ScalableSolutionSection />

      <ExplorePropertiesBanner/>

      
    </div>
  );
};

export default HomePage;

