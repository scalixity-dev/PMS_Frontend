import React from 'react';
import { ArrowRight, Home, TrendingUp, Shield, Award } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--color-header-bg)] to-white py-20 px-6">
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
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 
              className="mb-4 text-4xl font-bold"
              style={{ 
                fontFamily: 'var(--font-heading)', 
                color: 'var(--color-heading)' 
              }}
            >
              Why Choose Us
            </h2>
            <p 
              className="mx-auto max-w-2xl text-lg"
              style={{ color: 'var(--color-subheading)' }}
            >
              We provide comprehensive property management solutions tailored to your needs
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="group rounded-2xl bg-gradient-to-br from-[var(--color-card-1)] to-white p-8 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md">
                <Home className="text-[var(--color-primary)]" size={28} />
              </div>
              <h3 className="mb-3 text-xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-heading)' }}>
                Wide Range of Properties
              </h3>
              <p style={{ color: 'var(--color-subheading)' }}>
                From cozy apartments to luxury villas, we have the perfect property waiting for you.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group rounded-2xl bg-gradient-to-br from-[var(--color-card-2)] to-white p-8 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md">
                <TrendingUp className="text-[var(--color-primary)]" size={28} />
              </div>
              <h3 className="mb-3 text-xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-heading)' }}>
                Market Insights
              </h3>
              <p style={{ color: 'var(--color-subheading)' }}>
                Get real-time market data and trends to make informed property decisions.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group rounded-2xl bg-gradient-to-br from-[var(--color-card-3)] to-white p-8 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md">
                <Shield className="text-[var(--color-primary)]" size={28} />
              </div>
              <h3 className="mb-3 text-xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-heading)' }}>
                Secure Transactions
              </h3>
              <p style={{ color: 'var(--color-subheading)' }}>
                Your transactions are protected with industry-leading security measures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] py-16 px-6 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <Award size={48} className="mx-auto mb-6" />
          <h2 className="mb-4 text-3xl font-bold md:text-4xl" style={{ fontFamily: 'var(--font-heading)' }}>
            Ready to Find Your Perfect Property?
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Join thousands of satisfied customers who found their dream homes with us
          </p>
          <button className="rounded-full bg-white px-8 py-3 font-semibold text-[var(--color-primary)] shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

