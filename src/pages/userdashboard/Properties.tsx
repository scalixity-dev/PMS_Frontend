import React, { useState, useMemo } from "react";
import { Filter, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import PropertyFilters from "./components/PropertyFilters";
import type { Property, FilterState } from "./types";

// --- Internal Components ---

const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
  return (
    <Link
      to={`/userdashboard/properties/${property.id}`}
      className="block transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="relative w-full aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden group shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-shadow duration-300">
        {/* Background Image */}
        <img
          src={property.image || (property.images && property.images[0])}
          alt={property.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Tag */}
        {(property.tag || property.discount) && (
          <div className="absolute top-3 left-3 bg-[var(--dashboard-accent)] text-white px-4 py-1.5 rounded-md text-sm font-semibold shadow-[var(--shadow-sm)]">
            {property.tag || property.discount}
          </div>
        )}

        {/* Info Overlay */}
        <div className="absolute bottom-5 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-[var(--radius-md)] p-4 shadow-[var(--shadow-sm)]">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5 pr-8">
              <h3 className="text-[var(--dashboard-text-main)] text-md font-semibold leading-tight">
                {property.title}
              </h3>
              <p className="text-gray-600 text-[12px] leading-snug">
                {property.address}
              </p>
              <p className="text-gray-500 text-[12px] mt-0.5">
                {property.type}
              </p>
            </div>
            <button
              className="text-gray-600 hover:text-red-500 transition-colors mt-0.5"
              onClick={(e) => {
                e.preventDefault();
                // handle favorite 
              }}
            >
              <Heart size={18} />
            </button>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-[var(--dashboard-text-main)] text-md font-semibold">
              {property.price || `${property.currency}${property.rent}`}
            </span>
            <span className="text-gray-500 text-[10px]">month</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Properties: React.FC = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState | null>(null);

  const mockProperties: Property[] = [
    {
      id: 1,
      title: "2 Bedroom Available",
      address: "3042 Washington Blvd, Ogden, UT, 84401, us",
      type: "Apartment",
      price: "$1424",
      tag: "$500 off move in!",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000",
    },
    {
      id: 2,
      title: "3 Bedroom Luxury Villa",
      address: "123 Ocean View Los Angeles, CA, 90210, us",
      type: "Villa",
      price: "$8500",
      tag: "Beachfront",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
    },
    {
      id: 3,
      title: "1 Bedroom Modern Loft",
      address: "789 Downtown Ave, New York, NY, 10001, us",
      type: "Apartment",
      price: "$3200",
      tag: "High Floor",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1000",
    },
    {
      id: 4,
      title: "4 Bedroom Family Home",
      address: "456 Suburban Way, Austin, TX, 78701, us",
      type: "Builder Floor",
      price: "$4500",
      tag: "Family Friendly",
      image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=1000",
    },
    {
      id: 5,
      title: "Prime Commercial Plot",
      address: "11 Business Hub, Chicago, IL, 60601, us",
      type: "Plot",
      price: "$12000",
      tag: "Investment",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000",
    },
  ];

  const filteredProperties = useMemo(() => {
    return mockProperties.filter(property => {
      if (!filters) return true;

      const { search, propertyType, minPrice, maxPrice, bedrooms } = filters;

      // Search filter
      if (search &&
        !property.title.toLowerCase().includes(search.toLowerCase()) &&
        !property.address.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // Property Type filter
      if (propertyType && propertyType !== "All" && property.type !== propertyType) {
        return false;
      }

      // Price filter
      const price = parseInt((property.price || "").replace(/[$,]/g, ""));
      if (!isNaN(price)) {
        if (price < minPrice) return false;
        if (price > maxPrice) return false;
      }

      // Bedrooms filter
      if (bedrooms && bedrooms !== "All" && bedrooms !== "Any") {
        const match = property.title.match(/(\d+)\s*Bedroom/i);
        const propertyBedrooms = match ? parseInt(match[1]) : 0;

        if (bedrooms === "4+") {
          if (propertyBedrooms < 4) return false;
        } else {
          if (propertyBedrooms !== parseInt(bedrooms)) return false;
        }
      }

      return true;
    });
  }, [filters]);

  return (
    <div className="relative h-[calc(100vh-64px)] bg-white overflow-hidden flex flex-col">
      <PropertyFilters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApply={(newFilters) => setFilters(newFilters)}
      />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-2 text-lg font-medium">
            <span className="text-[var(--dashboard-accent)]">Dashboard</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">Properties</span>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setIsFiltersOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors bg-[#F7F7F7] border-[0.97px] border-white shadow-[0px_3.9px_3.9px_0px_#00000040]"
            >
              <Filter size={18} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
              <button
                onClick={() => setFilters(null)}
                className="mt-4 text-[var(--dashboard-accent)] font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
