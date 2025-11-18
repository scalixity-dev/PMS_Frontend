import { MessageSquare, Smartphone, Monitor } from 'lucide-react';

export default function DualImageFeatureSection() {
  return (
    <div className="w-screen relative mt-5 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      {/* Teal background - only half height */}
  <div className="absolute inset-0 h-1/2 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)] overflow-hidden">
        {/* Decorative pattern in background - left 40% */}
        <div className="absolute left-0 top-0 w-[40%] h-full opacity-100">
          <img 
            src="https://res.cloudinary.com/dxwspucxw/image/upload/v1762762638/Layer_1_f8ryou.png"
            alt="Decorative pattern"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="relative py-16 max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-light text-white text-center mb-16">
          Reach your PMS more<br />ways than ever
        </h1>

        {/* Dashboard Images */}
        <div className="relative mb-20 flex px-20 items-start justify-center">
          {/* Main dashboard image (left) - larger */}
          <div className="bg-white rounded-lg overflow-hidden shadow-2xl z-10">
            <img
              src="https://res.cloudinary.com/dxwspucxw/image/upload/v1762755585/image_rlwchk.png"
              alt="Main dashboard"
              className="w-full h-auto"
            />
          </div>

          {/* Secondary dashboard (right) - smaller, overlapping with translucent background */}
          <div className="bg-gray-200/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl -ml-16 mt-8 z-20 p-4">
            <div className="aspect-[4/3] bg-white rounded-lg overflow-hidden">
              <img
                src="https://res.cloudinary.com/dxwspucxw/image/upload/v1762755489/03dfe1e6b9ccb7c3a37932d8a3e7948355c0f0e2_lewj9p.png"
                alt="Secondary dashboard"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 bg-white py-12">
          {/* Messenger & Property Board */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-green-200 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Messenger & Property Board
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Message Pms separately, share important forms, and notify all Pms at once in the communication portal.{' '}
                <a href="#" className="text-[var(--color-primary)] underline">Learn more</a>
              </p>
            </div>
          </div>

          {/* Mobile App */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-green-200 rounded-lg flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Mobile App
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Find service professionals in your area and assign it to them through our platform.{' '}
                <a href="#" className="text-[var(--color-primary)] underline">Learn more</a>
              </p>
            </div>
          </div>

          {/* Utility Set Up */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-green-200 rounded-lg flex items-center justify-center">
              <Monitor className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Utility Set Up
              </h3>
              <p className="text-sm text-gray-600">
                Find service professionals in your area and assign it to them through our platform.{' '}
                <a href="#" className="text-[var(--color-primary)] underline">Learn more</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}