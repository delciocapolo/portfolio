import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { format, formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { toast } from "sonner";
import { z } from "zod";
import { adminServices } from "@src/services/admin";
import { adminKeys } from "@src/services/admin/keys";
import type { IContactMessage, MessageStatus } from "@src/shared/@types/admin";
import {
  PageBody,
  PageHeader,
} from "@src/components/admin/molecules/page-header";
import {
  MESSAGE_STATUS,
  StatusPill,
} from "@src/components/admin/atoms/status-pill";
import { ui } from "@src/components/admin/atoms/ui";
import { cn } from "@src/lib/utils";

const TABS = {
  inbox: {
    label: "Caixa",
    match: (m: IContactMessage) =>
      m.status !== "ARCHIVED" && m.status !== "SPAM",
  },
  new: { label: "Novas", match: (m: IContactMessage) => m.status === "NEW" },
  archived: {
    label: "Arquivadas",
    match: (m: IContactMessage) => m.status === "ARCHIVED",
  },
  spam: { label: "Spam", match: (m: IContactMessage) => m.status === "SPAM" },
} as const;

type TabKey = keyof typeof TABS;

export const Route = createFileRoute("/admin/_panel/mensagens")({
  validateSearch: z.object({
    id: z.string().optional(),
    tab: z.enum(["inbox", "new", "archived", "spam"]).optional(),
  }),
  component: Messages,
});

function Messages() {
  const { id, tab = "inbox" } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const qc = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: adminKeys.messages,
    queryFn: adminServices.messages.list,
    select: (r) => r.data,
  });

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MessageStatus }) =>
      adminServices.messages.update(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.messages }),
    onError: (e: Error) => toast.error(e.message),
  });

  const list = messages.filter(TABS[tab].match);
  const selected = messages.find((m) => m.id === id && TABS[tab].match(m));

  // Abrir uma mensagem nova marca-a como lida
  useEffect(() => {
    if (selected?.status === "NEW")
      setStatus.mutate({ id: selected.id, status: "READ" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  const open = (messageId?: string, nextTab: TabKey = tab) =>
    navigate({
      search: (s) => ({
        ...s,
        id: messageId,
        tab: nextTab === "inbox" ? undefined : nextTab,
      }),
    });

  const act = (status: MessageStatus, message: string) => {
    if (!selected) return;
    setStatus.mutate(
      { id: selected.id, status },
      { onSuccess: () => toast.success(message) },
    );
  };

  return (
    <>
      <PageHeader crumb="Site" title="Mensagens" />
      <PageBody>
        <div className="flex min-h-155 flex-wrap overflow-hidden rounded-lg border-2 border-ink">
          <div className="flex min-w-0 max-w-85 flex-[1_1_260px] flex-col border-r-2 border-ink">
            <div className="flex flex-wrap gap-1.5 border-b-2 border-ink p-3">
              {(Object.keys(TABS) as TabKey[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => open(undefined, t)}
                  className={cn(
                    "rounded-full border-[1.5px] border-ink px-3 py-1.25 text-xs font-semibold",
                    tab === t ? "bg-ink text-white" : "bg-white",
                  )}
                >
                  {TABS[t].label} {messages.filter(TABS[t].match).length}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoading && (
                <div className="p-5 text-sm text-neutral-500">A carregar…</div>
              )}
              {list.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => open(m.id)}
                  className={cn(
                    "block w-full border-b border-neutral-200 px-4.5 py-3.75 text-left hover:bg-neutral-50",
                    m.id === selected?.id && "bg-neutral-100",
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2.5">
                    <span
                      className={cn(
                        "truncate text-sm",
                        m.status === "NEW" ? "font-bold" : "font-medium",
                      )}
                    >
                      {m.name}
                    </span>
                    <span className="text-[11.5px] whitespace-nowrap text-neutral-500">
                      {formatDistanceToNow(new Date(m.createdAt), {
                        addSuffix: true,
                        locale: pt,
                      })}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "mt-0.75 truncate text-[13px]",
                      m.status === "NEW" ? "font-bold" : "font-medium",
                    )}
                  >
                    {m.subject}
                  </div>
                  <div className="mt-0.75 truncate text-[12.5px] text-neutral-500">
                    {m.message.replace(/\s+/g, " ")}
                  </div>
                </button>
              ))}
              {!isLoading && list.length === 0 && (
                <div className="px-4.5 py-12 text-center text-[13.5px] text-neutral-500">
                  Nada nesta vista.
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-[2_1_320px]">
            {selected ? (
              <div className="flex flex-col gap-5.5 px-6.5 py-6">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <h2 className="mb-1.5 text-2xl font-extrabold tracking-[-0.02em]">
                      {selected.subject}
                    </h2>
                    <div className="text-[13.5px] text-neutral-600">
                      <strong className="text-ink">{selected.name}</strong> ·{" "}
                      {selected.email}
                    </div>
                    <div className="mt-0.75 text-[12.5px] text-neutral-500">
                      {format(
                        new Date(selected.createdAt),
                        "d 'de' MMMM, HH:mm",
                        { locale: pt },
                      )}{" "}
                      · via {selected.origin === "home" ? "Home" : "Contact Me"}
                      {selected.website && ` · ${selected.website}`}
                    </div>
                  </div>
                  <StatusPill {...MESSAGE_STATUS[selected.status]} />
                </div>

                <p className="max-w-170 border-t-2 border-ink pt-5.5 text-[15px] leading-[1.8] whitespace-pre-line text-pretty text-neutral-900">
                  {selected.message}
                </p>

                <div className="flex flex-wrap gap-2.5 pt-2">
                  <a
                    href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                    onClick={() =>
                      setStatus.mutate({ id: selected.id, status: "REPLIED" })
                    }
                    className={cn(ui.btnPrimary, "hover:text-white")}
                  >
                    <Icon icon="lucide:reply" />
                    Responder por email
                  </a>
                  <button
                    type="button"
                    onClick={() => act("ARCHIVED", "Mensagem arquivada")}
                    className={ui.btnOutline}
                  >
                    <Icon icon="lucide:archive" />
                    Arquivar
                  </button>
                  <button
                    type="button"
                    onClick={() => act("SPAM", "Marcada como spam")}
                    className={ui.btnOutline}
                  >
                    <Icon icon="lucide:shield-alert" />
                    Spam
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-100 flex-col items-center justify-center gap-2.5 text-sm text-neutral-500">
                <Icon icon="lucide:inbox" className="text-3xl" />
                Escolhe uma mensagem
              </div>
            )}
          </div>
        </div>
      </PageBody>
    </>
  );
}
