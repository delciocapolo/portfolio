import { cn } from "@src/lib/utils";

interface IChipsProps {
  active: string;
  items: Array<string>;
  onPick: (v: string) => void;
}

export function Chips({ items, active, onPick }: IChipsProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {items?.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onPick(item)}
          className={cn(
            "border-ink rounded-full border-2 px-5 py-2.5 text-body-14! font-semibold",
            item === active ? "bg-ink text-white" : "bg-white text-ink",
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
