import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@src/components/admin/organisms/crud-page";
import { faqConfig, servicesConfig } from "@src/components/admin/crud/configs";
import { ui } from "@src/components/admin/atoms/ui";

export const Route = createFileRoute("/admin/_panel/servicos-faq")({
  component: ServicesFaq,
});

type Tab = "services" | "faq";

function ServicesFaq() {
  const [tab, setTab] = useState<Tab>("services");

  const tabs = () => (
    <div className="flex gap-2">
      {(
        [
          ["services", "Serviços"],
          ["faq", "FAQ"],
        ] as const
      ).map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => setTab(value)}
          className={ui.chip(tab === value)}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return tab === "services" ? (
    <CrudPage
      key="services"
      config={servicesConfig}
      title="Serviços e FAQ"
      aboveTable={tabs}
    />
  ) : (
    <CrudPage
      key="faq"
      config={faqConfig}
      title="Serviços e FAQ"
      aboveTable={tabs}
    />
  );
}
