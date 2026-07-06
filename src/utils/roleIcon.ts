import tenantIcon from '../assets/images/tenant-icon.png';
import landlordIcon from '../assets/images/landlord-icon.png';
import tenantFavicon from '../assets/images/tenant-favicon.png';
import landlordFavicon from '../assets/images/landlord-favicon.png';

export { tenantIcon, landlordIcon, tenantFavicon, landlordFavicon };

/** Property managers and team members operate on the landlord side of the product. */
const LANDLORD_ROLES = new Set(['PROPERTY_MANAGER', 'TEAM_MEMBER']);

/**
 * Picks the role-appropriate app icon. Defaults to the tenant icon for public
 * pages, pre-auth screens, and any role without a dedicated icon (e.g. service pro).
 */
export function getRoleIcon(role?: string | null): string {
  return role && LANDLORD_ROLES.has(role.toUpperCase()) ? landlordIcon : tenantIcon;
}

export function getRoleFavicon(role?: string | null): string {
  return role && LANDLORD_ROLES.has(role.toUpperCase()) ? landlordFavicon : tenantFavicon;
}
