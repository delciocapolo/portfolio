import { cn } from "@src/lib/utils";

interface IToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  tone?: "ink" | "success";
  /** Para uso sobre fundo preto */
  inverse?: boolean;
}

export function Toggle({
  checked,
  onChange,
  label,
  tone = "ink",
  inverse,
}: IToggleProps) {
  const on =
    tone === "success" ? "bg-(--success-600)" : inverse ? "bg-white" : "bg-ink";
  const off = inverse ? "bg-neutral-700" : "bg-neutral-300";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6.5 w-11 shrink-0 rounded-full transition-colors",
        checked ? on : off,
      )}
    >
      <span
        className={cn(
          "absolute top-0.75 size-5 rounded-full transition-[left]",
          inverse && checked && tone !== "success" ? "bg-ink" : "bg-white",
          checked ? "left-5.25" : "left-0.75",
        )}
      />
    </button>
  );
}
