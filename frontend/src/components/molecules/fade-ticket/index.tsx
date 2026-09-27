import { useEffect, useState } from "react";
import { INTERVALO_MS, SAMPLES } from "./constants";
import { cn } from "@src/lib/utils";

interface IFadeTicker {
  data?: string[];
}

export default function FadeTicker({ data = SAMPLES }: IFadeTicker) {
  const [index, setIndex] = useState(0);
  const emIndex = Number.isInteger(index) ? data[index].indexOf("em") : 0;

  useEffect(() => {
    const timer = setInterval(() => {
      if (data.length === 0) return;
      setIndex((i) => (i + 1) % data.length);
    }, INTERVALO_MS);
    return () => clearInterval(timer);
  }, [data.length]);

  return (
    <div
      className={cn(
        "max-h-14 overflow-hidden w-fit max-w-full inline-flex items-center gap-2 bg-background py-2 px-0",
        "max-lg:max-h-8",
      )}
    >
      {/* Keyframes */}
      <style>
        {`
            @keyframes msgFadeIn {
              from { opacity: 0.25; transform: translateY(6px); }
              to   { opacity: 1;    transform: translateY(0); }
            }
            .msg-enter {
              animation: msgFadeIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
            }
        `}
      </style>

      <div className="relative h-full flex-1 overflow-hidden">
        <div className="msg-enter flex items-center gap-2 text-headline-48 font-medium text-foreground whitespace-nowrap">
          <span>{data[index].slice(0, emIndex + 2)}</span>
          <span className="font-extrabold text-stroke">
            {data[index].slice(emIndex + 2)}.
          </span>
        </div>
      </div>
    </div>
  );
}
