import type { ComponentProps } from "react";

export function Eyebrow({ children }: Pick<ComponentProps<"div">, "children">) {
  return (
    <div className="mb-4.5 text-[13px] font-semibold tracking-[0.22em] text-neutral-500 uppercase">
      {children}
    </div>
  );
}
