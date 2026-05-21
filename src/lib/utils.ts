/**
 * Format a phone number for display
 */
export function formatPhone(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "");

  // Format as (555) 123-4567 for US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
}

/**
 * Generate star rating HTML class based on numeric rating
 */
export function starRatingClass(rating: number): string {
  return rating >= 4 ? "text-yellow-400" : "text-yellow-300";
}

/**
 * Get current year for copyright
 */
export function currentYear(): number {
  return new Date().getFullYear();
}
