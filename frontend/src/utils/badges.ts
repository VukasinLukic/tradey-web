import type { UserProfile } from '../types/entities';

/**
 * Check if user qualifies for Trusted Trader badge
 * Requirements: Rating > 4.0
 */
export function isTrustedTrader(user: UserProfile | null): boolean {
  if (!user) return false;
  return (user.rating || 0) > 4.0;
}

/**
 * Check if user qualifies for Power Seller badge
 * Requirements: 10+ published posts
 */
export function isPowerSeller(postsCount: number): boolean {
  return postsCount >= 10;
}

/**
 * Get user's badges
 */
export function getUserBadges(
  user: UserProfile | null,
  postsCount: number
): Array<'trusted-trader' | 'power-seller'> {
  const badges: Array<'trusted-trader' | 'power-seller'> = [];

  if (isTrustedTrader(user)) {
    badges.push('trusted-trader');
  }

  if (isPowerSeller(postsCount)) {
    badges.push('power-seller');
  }

  return badges;
}
