import { cn } from "@src/lib/utils";
import type { ComponentProps } from "react";

interface ContainerProps extends ComponentProps<"section"> {}

export default function Container({
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <section
      className={cn("mx-auto max-w-304 px-6 py-24", className)}
      {...props}
    >
      {children}
    </section>
  );
}
