/** Grid/thumbnail width — enough for 2× retina up to 6-column layout. */
export const CARD_THUMB_WIDTH = 400;

export function isRasterCardImage(url?: string | null): boolean {
  return Boolean(url && /\.(png|jpe?g|webp|gif|avif)$/i.test(url));
}

/** Small WebP for grids; falls back to original when thumb missing. */
export function cardThumbUrl(imageUrl: string): string {
  const match = imageUrl.match(/\/cards\/card-(\d{3})\.(png|jpe?g|webp)$/i);
  if (!match) return imageUrl;
  return `/cards/thumbs/card-${match[1]}.webp`;
}

export function cardImageSizes(grid = true): string {
  if (!grid) return "(max-width: 768px) 224px, 280px";
  return "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw";
}
