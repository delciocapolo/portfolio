import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminServices } from "@src/services/admin";
import { adminKeys } from "@src/services/admin/keys";
import type { IAdminPost, PostStatus } from "@src/shared/@types/admin";
import {
  PageBody,
  PageHeader,
  PageIntro,
} from "@src/components/admin/molecules/page-header";
import {
  DataTable,
  type IColumn,
} from "@src/components/admin/molecules/data-table";
import { EmptyState } from "@src/components/admin/molecules/empty-state";
import { POST_STATUS } from "@src/components/admin/atoms/status-pill";
import { ui } from "@src/components/admin/atoms/ui";

export const Route = createFileRoute("/admin/_panel/artigos/")({
  component: Articles,
});

const TABS: { value: PostStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todos" },
  { value: "PUBLISHED", label: "Publicados" },
  { value: "SCHEDULED", label: "Agendados" },
  { value: "DRAFT", label: "Rascunhos" },
];

const COLUMNS: IColumn<IAdminPost>[] = [
  { key: "title", label: "Título", kind: "strong", width: "minmax(0,2fr)" },
  {
    key: "category",
    label: "Categoria",
    kind: "text",
    width: "minmax(100px,1fr)",
  },
  {
    key: "status",
    label: "Estado",
    kind: "pill",
    width: "100px",
    pill: (r) => POST_STATUS[r.status],
  },
  { key: "postedAt", label: "Data", kind: "text", width: "100px" },
  { key: "views", label: "Leituras", kind: "mono", width: "80px" },
];

function Articles() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<PostStatus | "ALL">("ALL");
  const [q, setQ] = useState("");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: adminKeys.posts,
    queryFn: adminServices.posts.list,
    select: (r) => r.data,
  });

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return posts
      .filter((p) => tab === "ALL" || p.status === tab)
      .filter(
        (p) =>
          !term ||
          `${p.title} ${p.category} ${p.tags.join(" ")}`
            .toLowerCase()
            .includes(term),
      );
  }, [posts, tab, q]);

  const openNew = () =>
    navigate({ to: "/admin/artigos/$slug", params: { slug: "novo" } });

  return (
    <>
      <PageHeader
        crumb="Conteúdo"
        title="Artigos"
        search={{ value: q, onChange: setQ }}
        action={{ label: "Novo artigo", icon: "lucide:plus", onClick: openNew }}
      />
      <PageBody className="flex flex-col gap-5">
        <PageIntro>
          Tudo o que aparece em /blog. Rascunhos e agendados só ficam visíveis
          aqui.
        </PageIntro>

        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={ui.chip(tab === t.value)}
            >
              {t.label}
              <span className="opacity-60">
                {t.value === "ALL"
                  ? posts.length
                  : posts.filter((p) => p.status === t.value).length}
              </span>
            </button>
          ))}
        </div>

        <DataTable
          columns={COLUMNS}
          rows={rows}
          loading={isLoading}
          onRowClick={(p) =>
            navigate({ to: "/admin/artigos/$slug", params: { slug: p.slug } })
          }
          empty={
            <EmptyState
              title={q ? "Sem resultados" : "Nenhum artigo nesta vista"}
              text={
                q
                  ? `Nada corresponde a "${q}".`
                  : "Escreve o primeiro e guarda como rascunho."
              }
              action={
                q ? undefined : { label: "Novo artigo", onClick: openNew }
              }
            />
          }
        />
        <div className="text-[12.5px] text-neutral-500">
          {rows.length} de {posts.length} · clica numa linha para editar
        </div>
      </PageBody>
    </>
  );
}
