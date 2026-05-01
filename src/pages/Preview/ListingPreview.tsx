import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api.config';
import { getCurrencySymbol } from '../../utils/currency.utils';

const ENUM_TO_MONTHS: Record<string, string> = {
  ONE_MONTH: '1', TWO_MONTHS: '2', THREE_MONTHS: '3', FOUR_MONTHS: '4',
  FIVE_MONTHS: '5', SIX_MONTHS: '6', SEVEN_MONTHS: '7', EIGHT_MONTHS: '8',
  NINE_MONTHS: '9', TEN_MONTHS: '10', ELEVEN_MONTHS: '11', TWELVE_MONTHS: '12',
  EIGHTEEN_MONTHS: '18', TWENTY_FOUR_MONTHS: '24', THIRTY_SIX_PLUS_MONTHS: '36',
};

const toNum = (v: any): number => {
  if (v == null) return 0;
  if (typeof v === 'string') return parseFloat(v) || 0;
  return Number(v) || 0;
};

const ListingPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(API_ENDPOINTS.LISTING.GET_PUBLIC(id));
        if (!res.ok) throw new Error(`Failed to load listing (${res.status})`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err: any) {
        if (!cancelled) setError(err?.message || 'Failed to load listing');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const listing = useMemo(() => {
    if (!data || !data.property) return null;
    const property = data.property;
    const address = property.address || {};
    const amenitiesObj = property.amenities || {};
    const photos = property.photos || [];
    const leasing = property.leasing || {};

    const addressParts = [address.streetAddress, address.city, address.stateRegion, address.zipCode, address.country].filter(Boolean);
    const addressStr = addressParts.length ? addressParts.join(', ') : 'Address not available';

    const primaryPhoto = photos.find((p: any) => p.isPrimary) || photos[0];
    const image = primaryPhoto?.photoUrl || '';
    const gallery: string[] = photos.map((p: any) => p.photoUrl).filter(Boolean);

    const price = toNum(data.monthlyRent || leasing.monthlyRent);
    const securityDeposit = toNum(data.securityDeposit || leasing.securityDeposit);
    const amountRefundable = toNum(data.amountRefundable || leasing.amountRefundable);
    const dateAvailable = data.availableFrom ? format(new Date(data.availableFrom), 'dd MMM, yyyy') : '';

    const minLeaseDuration = data.minLeaseDuration ? ENUM_TO_MONTHS[data.minLeaseDuration] : '';
    const maxLeaseDuration = data.maxLeaseDuration ? ENUM_TO_MONTHS[data.maxLeaseDuration] : '';
    const monthToMonth = data.minLeaseDuration === 'ONE_MONTH' && data.maxLeaseDuration === 'ONE_MONTH';

    const petCats: string[] = Array.isArray(data.petCategory) && data.petCategory.length
      ? data.petCategory
      : (Array.isArray(leasing.petCategory) ? leasing.petCategory : []);

    const singleUnit = property.singleUnitDetails || {};
    const unitType = property.propertyType || 'Property';
    const bedrooms = singleUnit.bedrooms != null ? String(singleUnit.bedrooms) : 'N/A';
    const bathrooms = singleUnit.bathrooms != null ? String(singleUnit.bathrooms) : 'N/A';
    const size = singleUnit.sizeSqFt ? `${singleUnit.sizeSqFt} sq ft` : 'N/A';
    const yearBuilt = property.yearBuilt || 'N/A';

    const parseList = (raw: any): string[] => {
      if (!raw) return [];
      if (Array.isArray(raw)) return raw;
      if (typeof raw === 'string') {
        try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; } catch { return []; }
      }
      return [];
    };
    const features = parseList(amenitiesObj.propertyFeatures);
    const amenitiesList = parseList(amenitiesObj.propertyAmenities);
    const basicAmenities: string[] = [];
    if (amenitiesObj.parking && amenitiesObj.parking !== 'NONE') basicAmenities.push(amenitiesObj.parking.replace(/_/g, ' '));
    if (amenitiesObj.laundry && amenitiesObj.laundry !== 'NONE') basicAmenities.push(amenitiesObj.laundry.replace(/_/g, ' '));
    if (amenitiesObj.airConditioning && amenitiesObj.airConditioning !== 'NONE') basicAmenities.push(amenitiesObj.airConditioning.replace(/_/g, ' '));

    return {
      id: data.id,
      name: data.title || property.propertyName || 'Property',
      addressStr,
      country: address.country,
      image,
      gallery,
      video: property.youtubeUrl || '',
      price,
      description: data.description || property.description || leasing.description || '',
      unitType, bedrooms, bathrooms, size, yearBuilt,
      leaseTerms: {
        dateAvailable, monthlyRent: price, securityDeposit, amountRefundable,
        minLeaseDuration, maxLeaseDuration, monthToMonth,
        details: data.description || property.description || leasing.description || '',
      },
      petPolicy: {
        petsAllowed: !!(data.petsAllowed ?? leasing.petsAllowed),
        petCategory: petCats as string[],
        petFee: toNum(leasing.petFee),
        petDeposit: toNum(leasing.petDeposit),
        petDescription: leasing.petDescription || '',
      },
      basicAmenities, features, amenitiesList,
      contact: {
        name: property.listingContactName || '',
        phone: [property.listingPhoneCountryCode, property.listingPhoneNumber].filter(Boolean).join(' '),
        email: property.listingEmail || '',
      },
    };
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#82D64D]" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Listing not found</h1>
          <p className="text-gray-600">{error || 'The listing you are looking for does not exist or has been removed.'}</p>
        </div>
      </div>
    );
  }

  const currency = getCurrencySymbol(listing.country);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6">
            {listing.image ? (
              <img src={listing.image} alt={listing.name} className="w-full md:w-64 h-64 object-cover rounded-2xl" />
            ) : (
              <div className="w-full md:w-64 h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center text-gray-500">No image</div>
            )}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{listing.name}</h1>
                <p className="text-gray-600 text-sm mb-4">{listing.addressStr}</p>
              </div>
              <div className="bg-gradient-to-r from-[#3A4E33] to-[#85B474] text-white px-6 py-3 rounded-2xl w-fit">
                <span className="text-xl font-bold">{currency}{listing.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                <span className="text-sm ml-2 opacity-80">/ month</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Chip label="Type" value={listing.unitType} />
                <Chip label="Bedrooms" value={listing.bedrooms} />
                <Chip label="Bathrooms" value={listing.bathrooms} />
                <Chip label="Size" value={listing.size} />
                <Chip label="Built" value={listing.yearBuilt} />
              </div>
            </div>
          </div>
        </div>

        {/* Lease terms */}
        <Section title="Lease terms">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Row label="Date available" value={listing.leaseTerms.dateAvailable || 'N/A'} />
            <Row label="Monthly rent" value={`${currency}${listing.leaseTerms.monthlyRent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} />
            <Row label="Security deposit" value={`${currency}${listing.leaseTerms.securityDeposit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} />
            <Row label="Amount refundable" value={`${currency}${listing.leaseTerms.amountRefundable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} />
            <Row label="Min lease duration" value={listing.leaseTerms.minLeaseDuration ? `${listing.leaseTerms.minLeaseDuration} Months` : 'N/A'} />
            <Row label="Max lease duration" value={listing.leaseTerms.maxLeaseDuration ? `${listing.leaseTerms.maxLeaseDuration} Months` : 'N/A'} />
            <Row label="Month-to-Month" value={listing.leaseTerms.monthToMonth ? 'Yes' : 'No'} />
          </div>
          {listing.leaseTerms.details && (
            <div className="mt-4 bg-[#E3EBDE] rounded-2xl p-4">
              <span className="text-xs font-medium text-gray-600 block mb-1">Details</span>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{listing.leaseTerms.details}</p>
            </div>
          )}
        </Section>

        {/* Pet policy */}
        <Section title="Pet policy">
          {!listing.petPolicy.petsAllowed ? (
            <p className="text-sm text-gray-600">Pets not allowed</p>
          ) : (
            <div className="space-y-3">
              {listing.petPolicy.petCategory.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {listing.petPolicy.petCategory.map((cat) => (
                    <span key={cat} className="bg-[#82D64D] text-white text-sm font-medium px-3 py-1 rounded-full">{cat}</span>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Row label="Pet fee" value={`${currency}${listing.petPolicy.petFee.toLocaleString()}`} />
                <Row label="Pet deposit" value={`${currency}${listing.petPolicy.petDeposit.toLocaleString()}`} />
              </div>
              {listing.petPolicy.petDescription && (
                <div className="bg-[#E5EAE0] rounded-xl p-3">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{listing.petPolicy.petDescription}</p>
                </div>
              )}
            </div>
          )}
        </Section>

        {/* Features + amenities */}
        {(listing.features.length > 0 || listing.amenitiesList.length > 0 || listing.basicAmenities.length > 0) && (
          <Section title="Features & amenities">
            <div className="space-y-3">
              {listing.basicAmenities.length > 0 && (
                <ChipList label="Basic amenities" items={listing.basicAmenities} />
              )}
              {listing.features.length > 0 && (
                <ChipList label="Property features" items={listing.features} />
              )}
              {listing.amenitiesList.length > 0 && (
                <ChipList label="Property amenities" items={listing.amenitiesList} />
              )}
            </div>
          </Section>
        )}

        {/* Media */}
        {listing.gallery.length > 0 && (
          <Section title="Gallery">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {listing.gallery.map((img, idx) => (
                <img key={idx} src={img} alt={`Gallery ${idx}`} className="w-full aspect-square object-cover rounded-2xl" />
              ))}
            </div>
          </Section>
        )}

        {listing.video && (
          <Section title="Video">
            <a href={listing.video} target="_blank" rel="noopener noreferrer" className="text-[#82D64D] underline text-sm">{listing.video}</a>
          </Section>
        )}

        {/* Description */}
        {listing.description && (
          <Section title="Description">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{listing.description}</p>
          </Section>
        )}

        {/* Contact */}
        {(listing.contact.name || listing.contact.phone || listing.contact.email) && (
          <Section title="Contact">
            <div className="space-y-2">
              {listing.contact.name && <Row label="Name" value={listing.contact.name} />}
              {listing.contact.phone && <Row label="Phone" value={listing.contact.phone} />}
              {listing.contact.email && <Row label="Email" value={listing.contact.email} />}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
    <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
    {children}
  </div>
);

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center bg-[#E3EBDE] p-3 rounded-full">
    <span className="text-xs font-medium text-gray-600 ml-2">{label}</span>
    <span className="text-xs font-bold text-gray-800 mr-2">{value}</span>
  </div>
);

const Chip: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <span className="bg-[#F0F0F6] text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
    <span className="text-gray-500 mr-1">{label}:</span>{value}
  </span>
);

const ChipList: React.FC<{ label: string; items: string[] }> = ({ label, items }) => (
  <div>
    <span className="text-xs font-medium text-gray-600 block mb-2">{label}</span>
    <div className="flex flex-wrap gap-2">
      {items.map((i) => (
        <span key={i} className="bg-[#DFF3C6] text-gray-800 text-xs font-medium px-3 py-1 rounded-full">{i}</span>
      ))}
    </div>
  </div>
);

export default ListingPreview;
