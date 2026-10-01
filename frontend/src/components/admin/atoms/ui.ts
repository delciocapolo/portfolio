import { cn } from "@src/lib/utils";

/** Classes partilhadas do backoffice — mesma linguagem do site: tinta, traço de 2px, sombra sólida. */
export const ui = {
  btnPrimary:
    "inline-flex h-10.5 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-ink px-4 text-[13.5px] font-semibold text-white hover:opacity-85 disabled:pointer-events-none disabled:opacity-50",
  btnOutline:
    "inline-flex h-10.5 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 border-ink bg-white px-4 text-[13.5px] font-semibold hover:bg-ink hover:text-white",
  input:
    "w-full min-w-0 rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink",
  mono: "font-code text-[12.5px]",
  label: "flex flex-col gap-1.5 text-[12.5px] font-semibold",
  card: "rounded-lg border-2 border-ink bg-white",
  lift: "transition-[transform,box-shadow] duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_#000]",
  eyebrow: "text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500",
  chip: (active: boolean) =>
    cn(
      "inline-flex items-center gap-2 rounded-full border-2 border-ink px-4 py-1.5 text-[13px] font-semibold",
      active ? "bg-ink text-white" : "bg-white text-ink",
    ),
};
