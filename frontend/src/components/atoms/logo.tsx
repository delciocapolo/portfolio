import { cn } from "@src/lib/utils";
import { Link } from "@tanstack/react-router";

interface LogoProps {
  inverseLogo?: boolean;
}

export default function Logo({ inverseLogo }: LogoProps) {
  return (
    <Link
      to="/"
      className={cn(
        "flex items-center gap-2.5 font-semibold",
        inverseLogo ? "text-sm" : "text-[17px] tracking-tight font-bold",
      )}
    >
      <span
        className={cn(
          "block size-5.5 rounded-full",
          inverseLogo ? "bg-white" : "bg-black",
        )}
      />
      Délcio Capolo
    </Link>
  );
}
