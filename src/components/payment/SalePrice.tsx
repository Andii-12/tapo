import { formatMnt } from "@/lib/pricing";

export function SalePrice({
  listPrice,
  size = "lg",
}: {
  listPrice: number;
  size?: "md" | "lg" | "xl";
}) {
  const listClass =
    size === "xl"
      ? "font-serif text-2xl text-ink-soft line-through md:text-3xl"
      : size === "lg"
        ? "font-serif text-xl text-ink-soft line-through"
        : "font-serif text-base text-ink-soft line-through";
  const saleClass =
    size === "xl"
      ? "mt-1 font-serif text-4xl"
      : size === "lg"
        ? "mt-1 font-serif text-3xl"
        : "mt-0.5 font-serif text-xl";

  return (
    <div>
      <p className={listClass}>{formatMnt(listPrice)}</p>
      <p className={saleClass}>
        <span className="tracking-[0.08em] text-ink-soft">Sale</span>{" "}
        Үнэгүй
      </p>
    </div>
  );
}
