import { cn } from "@src/lib/utils";

type Props = {
  label: string;
  className?: string;
  /** altura em px; omite quando o contentor já define a altura */
  height?: number;
  dark?: boolean;
};

/**
 * Espaço reservado para imagem. Substitui por <img src="..." className="h-full w-full object-cover" />
 * quando tiveres as fotografias reais.
 */
export function Placeholder({
  label,
  height,
  dark = false,
  className = "",
}: Props) {
  return (
    <div
      style={height ? { height } : undefined}
      className={cn(
        "flex h-full w-full items-center justify-center text-center text-xs font-medium tracking-wide",
        dark ? "bg-panel text-neutral-500" : "bg-neutral-100 text-neutral-400",
        className,
      )}
    >
      {label}
    </div>
  );
}
