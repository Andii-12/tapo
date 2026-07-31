"use client";

import { getCardIconSvg } from "@/lib/tarot/card-icons";

export function CardIcon({
  slug,
  className = "",
  size = 64,
}: {
  slug: string;
  className?: string;
  size?: number;
}) {
  const paths = getCardIconSvg(slug);
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      dangerouslySetInnerHTML={{ __html: paths }}
    />
  );
}

export function CardThumb({
  nameEn,
  nameMn,
  imageUrl,
  slug,
  className = "",
}: {
  nameEn: string;
  nameMn?: string;
  imageUrl?: string;
  slug?: string;
  className?: string;
}) {
  const label = nameEn || nameMn || "";
  const iconSlug = slug || "the-fool";

  const usePhoto = Boolean(imageUrl && /\.(png|jpe?g|webp|gif)$/i.test(imageUrl));

  return (
    <div
      className={`relative flex aspect-[2/3] w-full flex-col items-center overflow-hidden border border-ink/80 bg-bg-white ${className}`}
      title={label}
    >
      <div className="absolute inset-[3px] border border-border" />

      {usePhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={label}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-1 pt-3">
            <CardIcon slug={iconSlug} size={56} className="text-ink" />
          </div>
          <div className="relative z-10 w-full border-t border-border px-1 py-1.5">
            <p className="line-clamp-2 text-center font-serif text-[9px] leading-tight text-ink">
              {nameEn || label}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
