import { useEffect, useRef, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { z } from "zod";
import { adminServices } from "@src/services/admin";
import { adminKeys } from "@src/services/admin/keys";
import type { IAdminPost, PostStatus } from "@src/shared/@types/admin";
import {
  PageBody,
  PageHeader,
} from "@src/components/admin/molecules/page-header";
import {
  POST_STATUS,
  StatusPill,
} from "@src/components/admin/atoms/status-pill";
import { Toggle } from "@src/components/admin/atoms/toggle";
import { ImageInput } from "@src/components/admin/atoms/image-input";
import { ui } from "@src/components/admin/atoms/ui";
import {
  countWords,
  formatPostDate,
  parseBlocks,
  parseTags,
  readTime,
  slugify,
} from "@src/lib/admin/content";
import { cn } from "@src/lib/utils";

export const Route = createFileRoute("/admin/_panel/artigos/$slug")({
  component: ArticleEditor,
});

type Draft = Omit<IAdminPost, "id">;

const EMPTY: Draft = {
  slug: "",
  category: "Arquitectura",
  title: "",
  summary: "",
  postedAt: "",
  readTime: "1 min",
  status: "DRAFT",
  views: 0,
  featured: false,
  tags: [],
  content: "",
  cover: "",
};

const schema = z.object({
  title: z.string().trim().min(1, "O título é obrigatório"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug: só minúsculas, números e hífens"),
  summary: z.string().max(200, "O resumo tem no máximo 200 caracteres"),
});

const TOOLBAR = [
  {
    icon: "lucide:heading-2",
    label: "Subtítulo",
    snippet: "\n\n## Subtítulo\n\n",
  },
  { icon: "lucide:bold", label: "Negrito", snippet: "**texto**" },
  { icon: "lucide:italic", label: "Itálico", snippet: "_texto_" },
  { icon: "lucide:quote", label: "Citação", snippet: "\n\n> Citação\n\n" },
  {
    icon: "lucide:code",
    label: "Bloco de código",
    snippet: "\n\n```ts\n// código\n```\n\n",
  },
  { icon: "lucide:link", label: "Link", snippet: "[texto](https://)" },
  {
    icon: "lucide:image",
    label: "Imagem",
    snippet: "\n\n![descrição](/imagens/)\n\n",
  },
];

function ArticleEditor() {
  const { slug } = Route.useParams();
  const isNew = slug === "novo";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const textarea = useRef<HTMLTextAreaElement>(null);
  const loadedFor = useRef<string | null>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: adminKeys.posts,
    queryFn: adminServices.posts.list,
    select: (r) => r.data,
  });
  const { data: categories = [] } = useQuery({
    queryKey: adminKeys.categories,
    queryFn: adminServices.categories.list,
    select: (r) =>
      r.data.filter((c) => c.type === "blog").sort((a, b) => a.order - b.order),
  });

  const post = posts?.find((p) => p.slug === slug);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [tags, setTags] = useState("");
  const [mode, setMode] = useState<"write" | "preview">("write");

  useEffect(() => {
    if (isNew && loadedFor.current !== "novo") {
      setDraft(EMPTY);
      setTags("");
      loadedFor.current = "novo";
    } else if (post && loadedFor.current !== post.id) {
      const { id: _id, ...rest } = post;
      setDraft(rest);
      setTags(post.tags.join(", "));
      loadedFor.current = post.id;
    }
  }, [isNew, post]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({
      ...d,
      [key]: value,
      ...(key === "title" && isNew ? { slug: slugify(String(value)) } : {}),
    }));

  const words = countWords(draft.content);

  const insert = (snippet: string) => {
    const el = textarea.current;
    const start = el?.selectionStart ?? draft.content.length;
    const end = el?.selectionEnd ?? draft.content.length;
    const next =
      draft.content.slice(0, start) + snippet + draft.content.slice(end);
    set("content", next);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + snippet.length, start + snippet.length);
    });
  };

  const save = useMutation({
    mutationFn: async (status?: PostStatus) => {
      const payload: Draft = {
        ...draft,
        tags: parseTags(tags),
        readTime: readTime(words),
        status: status ?? draft.status,
        postedAt:
          status === "PUBLISHED" && !draft.postedAt
            ? formatPostDate()
            : draft.postedAt,
      };
      const parsed = schema.safeParse(payload);
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message);
      return isNew || !post
        ? adminServices.posts.create(payload)
        : adminServices.posts.update(post.id, payload);
    },
    onSuccess: (r, status) => {
      qc.invalidateQueries({ queryKey: adminKeys.posts });
      setDraft((d) => ({
        ...d,
        status: r.data.status,
        postedAt: r.data.postedAt,
      }));
      toast.success(status === "PUBLISHED" ? "Artigo publicado" : "Guardado");
      if (isNew || r.data.slug !== slug) {
        loadedFor.current = r.data.id;
        navigate({
          to: "/admin/artigos/$slug",
          params: { slug: r.data.slug },
          replace: true,
        });
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!isNew && !isLoading && !post) {
    return (
      <>
        <PageHeader crumb="Artigos" title="Artigo não encontrado" />
        <PageBody>
          <Link to="/admin/artigos" className={ui.btnOutline}>
            Voltar aos artigos
          </Link>
        </PageBody>
      </>
    );
  }

  return (
    <>
      <PageHeader crumb="Artigos" title={draft.title || "Novo artigo"} />
      <PageBody className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/admin/artigos"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <Icon icon="lucide:arrow-left" />
            Artigos
          </Link>
          <div className="flex flex-wrap items-center gap-2.5">
            <StatusPill {...POST_STATUS[draft.status]} />
            <button
              type="button"
              disabled={save.isPending}
              onClick={() =>
                save.mutate(draft.status === "PUBLISHED" ? undefined : "DRAFT")
              }
              className={ui.btnOutline}
            >
              {draft.status === "PUBLISHED" ? "Guardar" : "Guardar rascunho"}
            </button>
            <button
              type="button"
              disabled={save.isPending}
              onClick={() => save.mutate("PUBLISHED")}
              className={ui.btnPrimary}
            >
              {draft.status === "PUBLISHED" ? "Actualizar" : "Publicar"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-7">
          <div className="flex min-w-0 flex-[3_1_440px] flex-col gap-4.5">
            <input
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Título do artigo"
              className="w-full min-w-0 border-b-2 border-ink pt-1 pb-3 text-[clamp(24px,3vw,34px)] font-extrabold tracking-[-0.025em] outline-none"
            />
            <div className="flex overflow-hidden rounded-lg border border-neutral-300 focus-within:border-ink">
              <span
                className={cn(
                  ui.mono,
                  "border-r border-neutral-300 bg-neutral-100 px-3 py-2.75 whitespace-nowrap text-neutral-500",
                )}
              >
                delciocapolo.dev/blog/
              </span>
              <input
                value={draft.slug}
                onChange={(e) => set("slug", e.target.value)}
                className={cn(
                  ui.mono,
                  "min-w-0 flex-1 px-3 py-2.75 outline-none",
                )}
              />
            </div>
            <textarea
              rows={2}
              value={draft.summary}
              onChange={(e) => set("summary", e.target.value)}
              placeholder="Resumo — aparece no card do blog e como meta description"
              className={cn(ui.input, "resize-y leading-relaxed")}
            />

            <div className="overflow-hidden rounded-lg border-2 border-ink">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink bg-neutral-50 px-2.5 py-2">
                <div className="flex flex-wrap gap-0.5">
                  {TOOLBAR.map((b) => (
                    <button
                      key={b.label}
                      type="button"
                      title={b.label}
                      disabled={mode === "preview"}
                      onClick={() => insert(b.snippet)}
                      className="flex size-8.5 items-center justify-center rounded-lg hover:bg-ink hover:text-white disabled:opacity-30"
                    >
                      <Icon icon={b.icon} className="text-[17px]" />
                    </button>
                  ))}
                </div>
                <div className="flex overflow-hidden rounded-full border-[1.5px] border-ink">
                  {(["write", "preview"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={cn(
                        "px-3.5 py-1.25 text-xs font-bold",
                        mode === m ? "bg-ink text-white" : "bg-white",
                      )}
                    >
                      {m === "write" ? "Escrever" : "Pré-visualizar"}
                    </button>
                  ))}
                </div>
              </div>

              {mode === "write" ? (
                <textarea
                  ref={textarea}
                  value={draft.content}
                  onChange={(e) => set("content", e.target.value)}
                  placeholder="Escreve em MDX…"
                  className="block min-h-120 w-full resize-y px-5.5 py-5 font-code text-[13.5px] leading-[1.8] text-neutral-900 outline-none"
                />
              ) : (
                <article className="prose prose-neutral min-h-120 max-w-180 px-8 pt-7 pb-9 prose-headings:font-extrabold prose-headings:tracking-[-0.02em] prose-blockquote:border-l-4 prose-blockquote:border-ink prose-blockquote:bg-neutral-100 prose-blockquote:py-1">
                  {parseBlocks(draft.content).map((b, i) =>
                    b.type === "h2" ? (
                      <h2 key={i}>{b.text}</h2>
                    ) : b.type === "quote" ? (
                      <blockquote key={i}>{b.text}</blockquote>
                    ) : b.type === "code" ? (
                      <pre key={i}>
                        <code>{b.text}</code>
                      </pre>
                    ) : (
                      <p key={i}>{b.text}</p>
                    ),
                  )}
                </article>
              )}

              <div className="flex justify-between gap-3 border-t border-neutral-200 px-4 py-2.5 text-xs text-neutral-500">
                <span>
                  {words} palavras · {readTime(words)} de leitura
                </span>
                <span>MDX</span>
              </div>
            </div>
          </div>

          <aside className="flex min-w-0 flex-[1_1_280px] flex-col gap-4.5">
            <section className={cn(ui.card, "p-4.5")}>
              <div className={cn(ui.eyebrow, "mb-3.5")}>Publicação</div>
              <div className="flex flex-col gap-3">
                <label className={ui.label}>
                  Estado
                  <select
                    value={draft.status}
                    onChange={(e) =>
                      set("status", e.target.value as PostStatus)
                    }
                    className={ui.input}
                  >
                    {Object.entries(POST_STATUS).map(([value, { label }]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={ui.label}>
                  Data de publicação
                  <input
                    value={draft.postedAt}
                    onChange={(e) => set("postedAt", e.target.value)}
                    placeholder={formatPostDate()}
                    className={ui.input}
                  />
                </label>
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div>
                    <div className="text-[12.5px] font-semibold">
                      Destaque na home
                    </div>
                    <div className="text-[11.5px] text-neutral-500">
                      Bloco "Do Blog"
                    </div>
                  </div>
                  <Toggle
                    checked={draft.featured}
                    onChange={(v) => set("featured", v)}
                    label="Destaque na home"
                  />
                </div>
              </div>
            </section>

            <section className={cn(ui.card, "p-4.5")}>
              <div className={cn(ui.eyebrow, "mb-3.5")}>Organização</div>
              <div className="flex flex-col gap-3">
                <label className={ui.label}>
                  Categoria
                  <select
                    value={draft.category}
                    onChange={(e) => set("category", e.target.value)}
                    className={ui.input}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={ui.label}>
                  Tags
                  <input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="TypeScript, Nest.js"
                    className={ui.input}
                  />
                </label>
              </div>
            </section>

            <section className={cn(ui.card, "p-4.5")}>
              <div className={cn(ui.eyebrow, "mb-3.5")}>Capa</div>
              <ImageInput
                value={draft.cover}
                onChange={(v) => set("cover", v)}
                className="h-40"
                label="Arrasta a capa"
              />
            </section>
          </aside>
        </div>
      </PageBody>
    </>
  );
}
