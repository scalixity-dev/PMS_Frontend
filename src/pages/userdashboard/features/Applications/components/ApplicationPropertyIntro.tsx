import React, { useEffect, useState } from 'react';
import { BedDouble, Bath } from 'lucide-react';
import { API_ENDPOINTS } from '../../../../../config/api.config';
import PrimaryActionButton from '../../../../../components/common/buttons/PrimaryActionButton';

interface ApplicationPropertyIntroProps {
    propertyId: string;
    onNext: () => void;
}

interface PropertyIntroData {
    image: string;
    title: string;
    address: string;
    rent: number;
    currencySymbol: string;
    currencyCode: string;
    beds: number;
    baths: number;
    agentName: string;
}

const ApplicationPropertyIntro: React.FC<ApplicationPropertyIntroProps> = ({ propertyId, onNext }) => {
    const [data, setData] = useState<PropertyIntroData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        let isMounted = true;

        const fetchProperty = async () => {
            if (isMounted) {
                setData(null);
                setLoading(true);
                setError(null);
            }

            if (!propertyId || propertyId === 'prop_mock_123') {
                // Mock data for dev/testing if needed, or just handle gracefully
                // For now, if it's the specific mock ID, return mock data
                if (propertyId === 'prop_mock_123') {
                    if (isMounted) {
                        setData({
                            image: "https://images.unsplash.com/photo-1600596542815-e3289cab6558?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                            title: "Luxury Villa",
                            address: "Gandhi Path Rd, Jaipur, RJ 302020, IN",
                            rent: 30000,
                            currencySymbol: "₹",
                            currencyCode: "INR",
                            beds: 3,
                            baths: 2,
                            agentName: "Ashendra Sharma"
                        });
                        setLoading(false);
                    }
                    return;
                }
            }

            try {
                // Handle potential UUID length issues if necessary, similar to UserPropertyDetail
                let validId = propertyId;
                if (propertyId.length > 36) validId = propertyId.substring(0, 36);

                const response = await fetch(API_ENDPOINTS.PROPERTY.GET_PUBLIC_DETAIL(validId), {
                    signal: controller.signal
                });

                if (!response.ok) throw new Error('Failed to fetch property details');

                const apiData = await response.json();

                // Only update state if component is still mounted
                if (!isMounted) return;

                // Extract Data
                const addressObj = apiData.address || {};
                const address = `${addressObj.streetAddress || ''}, ${addressObj.city || ''}, ${addressObj.stateRegion || ''} ${addressObj.zipCode || ''}, ${addressObj.country || ''}`.replace(/^, |, $/g, '').replace(/, ,/g, ',');

                const listing = apiData.listing || {};
                const unit = apiData.singleUnitDetail || {};

                const rent = listing.monthlyRent ? parseFloat(listing.monthlyRent) : (listing.listingPrice ? parseFloat(listing.listingPrice) : 0);

                // Determine currency (simple logic as per UserPropertyDetail)
                const isIndia = addressObj.country === 'India' || addressObj.country === 'IN';
                const currencySymbol = isIndia ? '₹' : '$';
                const currencyCode = isIndia ? 'INR' : 'USD';

                const image = apiData.coverPhotoUrl || (apiData.photos && apiData.photos.length > 0 ? apiData.photos[0].photoUrl : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800");

                const agentName = apiData.manager?.fullName || apiData.listingContactName || "Property Manager";

                const beds = unit.beds ? parseFloat(unit.beds) : 0;
                const baths = unit.baths ? parseFloat(unit.baths) : 0;
                const title = listing.title || apiData.propertyName || "Property";

                setData({
                    image,
                    title,
                    address,
                    rent,
                    currencySymbol,
                    currencyCode,
                    beds,
                    baths,
                    agentName
                });
            } catch (err) {
                // Don't update state if request was aborted or component unmounted
                if (err instanceof Error && err.name === 'AbortError') {
                    return;
                }
                if (!isMounted) return;

                console.error("Error loading property intro:", err);
                setError("Could not load property details.");
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProperty();

        // Cleanup function to abort request and prevent state updates
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [propertyId]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading property details...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error} <br /> <button onClick={onNext} className="mt-4 text-[var(--dashboard-accent)] underline">Skip &gt;&gt;</button></div>;
    if (!data) return null;

    // Helper to format currency
    const formatMoney = (amount: number, code: string) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: code,
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="flex flex-col items-center justify-center py-6 animate-in fade-in duration-500">
            <h1 className="text-2xl font-medium text-[#1A1A1A] mb-2 text-center">Start the application process</h1>
            <p className="text-gray-500 text-md text-center mb-10 max-w-lg mx-auto">
                Fill out and submit the rental application for the property below listed by <span className="font-semibold  text-[#1A1A1A]">{data.agentName}</span>.
            </p>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.08)] p-4 max-w-sm w-full mb-10">
                <div className="aspect-[4/3] w-full rounded-xl overflow-hidden mb-4 bg-gray-100">
                    <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex justify-between items-start mb-2 px-1">
                    <div>
                        <h3 className="font-bold text-lg text-[#1A1A1A]">{data.title}</h3>
                    </div>
                    <div className="text-right">
                        <h3 className="font-bold text-lg text-[#1A1A1A]">{formatMoney(data.rent, data.currencyCode)}</h3>
                        <p className="text-xs text-gray-500">Rent/monthly</p>
                    </div>
                </div>

                <p className="text-[#4B5563] text-sm mb-6 px-1 leading-relaxed">
                    {data.address}
                </p>

                <div className="flex items-center gap-8 mb-2 px-1">
                    <div className="flex items-center gap-2">
                        <BedDouble className="text-[#1A1A1A]" size={20} />
                        <span className="font-bold text-[#1A1A1A]">x {data.beds}</span>
                        <span className="text-[#4B5563] text-sm">Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Bath className="text-[#1A1A1A]" size={20} />
                        <span className="font-bold text-[#1A1A1A]">x {data.baths}</span>
                        <span className="text-[#4B5563] text-sm">Bathrooms</span>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-center">
                <PrimaryActionButton
                    onClick={onNext}
                    className="bg-[var(--dashboard-accent)] hover:bg-[#6BC847] text-white font-bold py-3 px-12 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                    Next
                </PrimaryActionButton>
            </div>
        </div>
    );
};

export default ApplicationPropertyIntro;
