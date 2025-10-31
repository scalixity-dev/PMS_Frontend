import React from 'react';

export interface TestimonialCardProps {
  brand?: 'capterra' | 'generic';
  title: string;
  content: string;
  rating?: number; // 0-5
  authorName: string;
  authorRole: string;
  avatarUrl?: string;
  className?: string;
}

const Star: React.FC<{ filled?: boolean; className?: string }> = ({ filled = true, className }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill={filled ? '#F59E0B' : 'none'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.048 2.927c.3-.921 1.604-.921 1.902 0l1.2 3.674a1 1 0 00.95.69h3.862c.969 0 1.371 1.24.588 1.81l-3.127 2.272a1 1 0 00-.364 1.118l1.194 3.654c.3.918-.755 1.688-1.54 1.118l-3.14-2.248a1 1 0 00-1.163 0l-3.14 2.248c-.784.57-1.838-.2-1.539-1.118l1.193-3.654a1 1 0 00-.363-1.118L2.45 9.101c-.783-.57-.38-1.81.588-1.81h3.862a1 1 0 00.95-.69l1.198-3.674z"
      stroke={filled ? 'none' : '#F59E0B'}
      strokeWidth="1.5"
    />
  </svg>
);

const BrandBadge: React.FC<{ brand?: 'capterra' | 'generic' }> = ({ brand = 'generic' }) => {
  if (brand === 'capterra') {
    return (
      <div className="inline-flex items-center gap-2">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4l8 8-8 8V4z" fill="#FF6A00" />
          <path d="M12 4l8 8-8 8V4z" fill="#0066FF" />
        </svg>
        <span className="font-semibold text-(--color-heading)">Capterra</span>
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#FF6A3D" />
      </svg>
      <span className="font-semibold text-(--color-heading)">Reviews</span>
    </div>
  );
};

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  brand = 'generic',
  title,
  content,
  rating = 5,
  authorName,
  authorRole,
  avatarUrl,
  className,
}) => {
  const fullStars = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <article className={`rounded-2xl border border-(--color-active) bg-white p-6 shadow-sm ${className ?? ''}`.trim()}>
      <header className="mb-4 flex items-center justify-between">
        <BrandBadge brand={brand} />
        <span className="text-3xl text-(--color-active)">”</span>
      </header>

      <h3 className="mb-3 text-[18px] font-semibold text-(--color-heading)">{title}</h3>
      <p className="mb-4 text-[14px] leading-7 text-(--color-subheading)">{content}</p>

      <div className="mb-4 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} filled={i < fullStars} />
        ))}
      </div>

      <footer className="mt-6 flex items-center gap-3">
        {avatarUrl ? (
          <img src={avatarUrl} alt={authorName} className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-header-bg) text-(--color-heading)">{authorName.charAt(0)}</div>
        )}
        <div>
          <p className="text-[15px] font-medium text-(--color-heading)">{authorName}</p>
          <p className="text-[12px] text-(--color-subheading)">{authorRole}</p>
        </div>
      </footer>
    </article>
  );
};

export default TestimonialCard;


