import { cn } from "@src/lib/utils";

interface SocialsProps {
  firstFull?: boolean;
}

const redes = [
  { label: "Fb", href: "#" },
  { label: "Dr", href: "#" },
  { label: "X", href: "#" },
  { label: "in", href: "#" },
];

export function Socials({ firstFull = false }: SocialsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {redes?.map((r, i) => (
        <a
          key={r.label}
          href={r.href}
          className={cn(
            "border-ink flex size-14 items-center justify-center rounded border-2 text-sm font-bold no-underline hover:bg-black hover:text-white",
            firstFull && i === 0 ? "bg-ink text-white" : "",
          )}
        >
          {r.label}
        </a>
      ))}
    </div>
  );
}
