import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { CrudPage } from "@src/components/admin/organisms/crud-page";
import { subscribersConfig } from "@src/components/admin/crud/configs";
import { ui } from "@src/components/admin/atoms/ui";
import { downloadCsv } from "@src/lib/admin/content";
import { cn } from "@src/lib/utils";
import type { ISubscriber } from "@src/shared/@types/admin";

export const Route = createFileRoute("/admin/_panel/newsletter")({
  component: Newsletter,
});

function Stats({ rows }: { rows: ISubscriber[] }) {
  const confirmed = rows.filter((r) => r.confirmed).length;
  const stats = [
    { label: "Total", value: rows.length },
    { label: "Confirmados", value: confirmed },
    { label: "Pendentes", value: rows.length - confirmed },
    {
      label: "Taxa de confirmação",
      value: rows.length
        ? `${Math.round((confirmed / rows.length) * 100)}%`
        : "—",
    },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
      {stats.map((s) => (
        <div key={s.label} className={cn(ui.card, "px-4.5 py-4")}>
          <div className={cn(ui.eyebrow, "mb-2")}>{s.label}</div>
          <div className="text-3xl leading-none font-extrabold tracking-[-0.03em]">
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function Newsletter() {
  return (
    <CrudPage
      config={subscribersConfig}
      aboveTable={(rows) => <Stats rows={rows} />}
      action={(rows) => ({
        label: "Exportar CSV",
        icon: "lucide:download",
        disabled: rows.length === 0,
        onClick: () => {
          downloadCsv("subscritores.csv", [
            ["email", "estado", "subscreveu"],
            ...rows.map((r) => [
              r.email,
              r.confirmed ? "confirmado" : "pendente",
              r.createdAt,
            ]),
          ]);
          toast.success("CSV exportado");
        },
      })}
    />
  );
}
