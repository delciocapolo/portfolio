import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { faqService } from "@src/services/faq/index.service";

export function Faq() {
  const { data: faqs = [] } = useQuery({
    queryKey: ["all-faqs"],
    queryFn: async () => {
      const { data } = await faqService.list();
      return data;
    },
  });
  const [aberta, setAberta] = useState(0);

  return (
    <div className="border-ink flex flex-col border-t-2">
      {faqs?.map((f, i) => (
        <div key={f.question} className="border-ink border-b-2">
          <button
            type="button"
            onClick={() => setAberta(aberta === i ? -1 : i)}
            className="flex w-full items-center justify-between gap-6 py-6 text-left"
          >
            <span className="text-[17px] font-semibold tracking-[-0.01em]">
              {f.question}
            </span>
            <span className="text-[22px] leading-none">
              {aberta === i ? "-" : "+"}
            </span>
          </button>
          {aberta === i && (
            <p className="m-0 max-w-[680px] pb-6.5 text-[15px] leading-relaxed text-neutral-600">
              {f.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
