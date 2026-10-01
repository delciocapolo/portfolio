import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { toast } from "sonner";
import { adminServices } from "@src/services/admin";
import { adminKeys } from "@src/services/admin/keys";
import {
  PageBody,
  PageHeader,
} from "@src/components/admin/molecules/page-header";
import {
  POST_STATUS,
  StatusPill,
} from "@src/components/admin/atoms/status-pill";
import { Toggle } from "@src/components/admin/atoms/toggle";
import { ui } from "@src/components/admin/atoms/ui";
import { cn } from "@src/lib/utils";

export const Route = createFileRoute("/admin/_panel/")({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: posts = [] } = useQuery({
    queryKey: adminKeys.posts,
    queryFn: adminServices.posts.list,
    select: (r) => r.data,
  });
  const { data: messages = [] } = useQuery({
    queryKey: adminKeys.messages,
    queryFn: adminServices.messages.list,
    select: (r) => r.data,
  });
  const { data: subscribers = [] } = useQuery({
    queryKey: adminKeys.subscribers,
    queryFn: adminServices.subscribers.list,
    select: (r) => r.data,
  });
  const { data: artworks = [] } = useQuery({
    queryKey: adminKeys.artworks,
    queryFn: adminServices.artworks.list,
    select: (r) => r.data,
  });
  const { data: profile } = useQuery({
    queryKey: adminKeys.profile,
    queryFn: adminServices.profile.get,
    select: (r) => r.data,
  });

  const availability = useMutation({
    mutationFn: (isAvailable: boolean) =>
      adminServices.profile.update({ isAvailable }),
    onSuccess: (r) => {
      qc.setQueryData(adminKeys.profile, r);
      toast.success(
        r.data.isAvailable ? "Selo ligado no site" : "Selo desligado no site",
      );
    },
  });

  const published = posts.filter((p) => p.status === "PUBLISHED");
  const unread = messages.filter((m) => m.status === "NEW");
  const pipeline = posts.filter(
    (p) => p.status === "DRAFT" || p.status === "SCHEDULED",
  );
  const recent = messages.filter((m) => m.status !== "SPAM").slice(0, 4);
  const confirmed = subscribers.filter((s) => s.confirmed).length;

  const stats = [
    {
      label: "Artigos publicados",
      value: published.length,
      note: `${published.reduce((a, p) => a + p.views, 0).toLocaleString("pt-PT")} leituras no total`,
      icon: "lucide:file-text",
      to: "/admin/artigos" as const,
    },
    {
      label: "Mensagens novas",
      value: unread.length,
      note: `${messages.length} na caixa`,
      icon: "lucide:inbox",
      to: "/admin/mensagens" as const,
    },
    {
      label: "Subscritores",
      value: confirmed,
      note: `${subscribers.length - confirmed} por confirmar`,
      icon: "lucide:mail",
      to: "/admin/newsletter" as const,
    },
    {
      label: "Peças creative",
      value: artworks.length,
      note: `${artworks.filter((a) => a.isVideo).length} vídeos`,
      icon: "lucide:image",
      to: "/admin/creative" as const,
    },
  ];

  const today = new Intl.DateTimeFormat("pt-PT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <>
      <PageHeader
        crumb="Visão geral"
        title="Dashboard"
        action={{
          label: "Novo artigo",
          icon: "lucide:plus",
          onClick: () =>
            navigate({ to: "/admin/artigos/$slug", params: { slug: "novo" } }),
        }}
      />
      <PageBody className="flex flex-col gap-8">
        <div>
          <h2 className="mb-2 text-[40px] leading-[1.1] font-medium tracking-[-0.03em]">
            Olá,{" "}
            <span className="font-extrabold">
              {profile?.name.split(" ")[0] ?? "Délcio"}
            </span>
            .
          </h2>
          <div className="text-sm text-neutral-600 first-letter:uppercase">
            {today} · {unread.length} mensagens por ler
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-6">
          {stats.map((s) => (
            <Link
              key={s.label}
              to={s.to}
              className={cn(ui.card, ui.lift, "p-5.5")}
            >
              <div className="mb-4.5 flex items-center justify-between">
                <span className={ui.eyebrow}>{s.label}</span>
                <Icon icon={s.icon} className="text-lg" />
              </div>
              <div className="text-[44px] leading-none font-extrabold tracking-[-0.04em]">
                {s.value}
              </div>
              <div className="mt-2.5 text-[12.5px] text-neutral-600">
                {s.note}
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-start gap-6">
          <section className={cn(ui.card, "min-w-0 flex-[1.3_1_380px]")}>
            <div className="flex items-center justify-between border-b-2 border-ink px-5.5 py-4.5">
              <h3 className="text-base font-bold">Mensagens recentes</h3>
              <Link
                to="/admin/mensagens"
                className="border-b-2 border-ink text-[13px] font-semibold"
              >
                Abrir caixa
              </Link>
            </div>
            {recent.map((m) => (
              <Link
                key={m.id}
                to="/admin/mensagens"
                search={{ id: m.id }}
                className="flex items-start gap-3.5 border-b border-neutral-200 px-5.5 py-4 last:border-b-0 hover:bg-neutral-50"
              >
                <span
                  className={cn(
                    "mt-1.75 size-2 shrink-0 rounded-full",
                    m.status === "NEW" ? "bg-ink" : "bg-neutral-300",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3">
                    <span className="text-sm font-bold">{m.name}</span>
                    <span className="text-xs whitespace-nowrap text-neutral-500">
                      {formatDistanceToNow(new Date(m.createdAt), {
                        addSuffix: true,
                        locale: pt,
                      })}
                    </span>
                  </div>
                  <div className="mt-0.5 truncate text-[13px] text-neutral-600">
                    {m.subject}
                  </div>
                </div>
              </Link>
            ))}
            {recent.length === 0 && (
              <div className="px-5.5 py-9 text-center text-sm text-neutral-600">
                Sem mensagens por agora.
              </div>
            )}
          </section>

          <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-6">
            <section className="rounded-lg bg-ink p-5.5 text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className={cn(ui.eyebrow, "mb-2 text-neutral-500")}>
                    Selo no site
                  </div>
                  <div className="text-[17px] font-bold">
                    {profile?.isAvailable
                      ? "Disponível para novos projectos"
                      : "Agenda fechada"}
                  </div>
                </div>
                <Toggle
                  tone="success"
                  inverse
                  label="Disponibilidade"
                  checked={!!profile?.isAvailable}
                  onChange={(v) => availability.mutate(v)}
                />
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-neutral-400">
                Aparece na página Contact Me e no CTA da home.
              </p>
            </section>

            <section className={ui.card}>
              <div className="flex items-center justify-between border-b-2 border-ink px-5.5 py-4.5">
                <h3 className="text-base font-bold">Pipeline editorial</h3>
                <Link
                  to="/admin/artigos"
                  className="border-b-2 border-ink text-[13px] font-semibold"
                >
                  Artigos
                </Link>
              </div>
              {pipeline.map((p) => (
                <Link
                  key={p.id}
                  to="/admin/artigos/$slug"
                  params={{ slug: p.slug }}
                  className="flex items-center justify-between gap-3 border-b border-neutral-200 px-5.5 py-3.5 last:border-b-0 hover:bg-neutral-50"
                >
                  <div className="min-w-0">
                    <div className="truncate text-[13.5px] font-semibold">
                      {p.title}
                    </div>
                    <div className="mt-0.5 text-xs text-neutral-500">
                      {p.postedAt || "Sem data"}
                    </div>
                  </div>
                  <StatusPill {...POST_STATUS[p.status]} />
                </Link>
              ))}
              {pipeline.length === 0 && (
                <div className="px-5.5 py-7 text-center text-sm text-neutral-600">
                  Nada em rascunho nem agendado.
                </div>
              )}
            </section>
          </div>
        </div>
      </PageBody>
    </>
  );
}
