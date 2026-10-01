import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { z } from "zod";
import { adminServices } from "@src/services/admin";
import { adminKeys } from "@src/services/admin/keys";
import type { IAdminArtwork } from "@src/shared/@types/admin";
import {
  PageBody,
  PageHeader,
  PageIntro,
} from "@src/components/admin/molecules/page-header";
import {
  EntityDrawer,
  type IField,
} from "@src/components/admin/molecules/entity-drawer";
import { Placeholder } from "@src/components/atoms/placeholder";
import { ui } from "@src/components/admin/atoms/ui";
import { cn } from "@src/lib/utils";

export const Route = createFileRoute("/admin/_panel/creative")({
  component: Creative,
});

const schema = z.object({
  legend: z.string().trim().min(1, "A legenda é obrigatória"),
  height: z
    .number()
    .min(200, "Altura mínima 200px")
    .max(600, "Altura máxima 600px"),
});

function Creative() {
  const qc = useQueryClient();
  const [category, setCategory] = useState("all");
  const [editing, setEditing] = useState<IAdminArtwork | "new" | null>(null);

  const { data: artworks = [], isLoading } = useQuery({
    queryKey: adminKeys.artworks,
    queryFn: adminServices.artworks.list,
    select: (r) => r.data,
  });
  const { data: categories = [] } = useQuery({
    queryKey: adminKeys.categories,
    queryFn: adminServices.categories.list,
    select: (r) =>
      r.data
        .filter((c) => c.type === "creative")
        .sort((a, b) => a.order - b.order),
  });

  const titleOf = (slug: string) =>
    categories.find((c) => c.slug === slug)?.title ?? slug;
  const visible = artworks.filter(
    (a) => category === "all" || a.category === category,
  );

  const fields = useMemo<IField<IAdminArtwork>[]>(
    () => [
      { key: "cover", label: "Imagem ou frame de vídeo", type: "image" },
      { key: "legend", label: "Legenda", type: "text" },
      {
        key: "location",
        label: "Local",
        type: "text",
        placeholder: "Luanda, Angola",
      },
      {
        key: "category",
        label: "Categoria",
        type: "select",
        options: categories.map((c) => ({ value: c.slug, label: c.title })),
      },
      {
        key: "height",
        label: "Altura no masonry (px)",
        type: "number",
        hint: "Entre 280 e 480. Define o ritmo da grelha.",
      },
      {
        key: "isVideo",
        label: "Vídeo",
        type: "toggle",
        on: "É um vídeo",
        off: "Imagem estática",
      },
    ],
    [categories],
  );

  const initial = useMemo<Partial<IAdminArtwork>>(
    () =>
      editing === "new"
        ? {
            legend: "",
            location: "",
            category: categories[0]?.slug ?? "",
            height: 360,
            isVideo: false,
            cover: "",
          }
        : (editing ?? {}),
    [editing, categories],
  );

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: adminKeys.artworks });

  const save = useMutation({
    mutationFn: (values: Partial<IAdminArtwork>) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message);
      return editing === "new" || !editing
        ? adminServices.artworks.create(values as Omit<IAdminArtwork, "id">)
        : adminServices.artworks.update(editing.id, values);
    },
    onSuccess: () => {
      toast.success(
        editing === "new" ? "Peça adicionada" : "Alterações guardadas",
      );
      setEditing(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: adminServices.artworks.remove,
    onSuccess: () => {
      toast.success("Peça eliminada");
      setEditing(null);
      invalidate();
    },
  });

  return (
    <>
      <PageHeader
        crumb="Conteúdo"
        title="Creative"
        action={{
          label: "Adicionar peça",
          icon: "lucide:plus",
          onClick: () => setEditing("new"),
        }}
      />
      <PageBody className="flex flex-col gap-5">
        <PageIntro>
          Peças da galeria Creative. A ordem aqui é a ordem do masonry no site.
        </PageIntro>

        <div className="flex flex-wrap gap-2">
          {[{ slug: "all", title: "Tudo" }, ...categories].map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCategory(c.slug)}
              className={ui.chip(category === c.slug)}
            >
              {c.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-5">
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="flex min-h-67.5 flex-col items-center justify-center gap-2.5 rounded-lg border-2 border-dashed border-ink text-sm font-semibold hover:bg-neutral-50"
          >
            <Icon icon="lucide:plus" className="text-[26px]" />
            Adicionar peça
          </button>

          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-67.5 animate-pulse rounded-lg bg-neutral-100"
              />
            ))}

          {visible.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setEditing(a)}
              className={cn(ui.card, ui.lift, "overflow-hidden text-left")}
            >
              <div className="relative h-47.5 border-b-2 border-ink">
                {a.cover ? (
                  <img
                    src={a.cover}
                    alt={a.legend}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Placeholder label={a.legend} />
                )}
                {a.isVideo && (
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold tracking-widest text-white">
                    ▶ VÍDEO
                  </span>
                )}
              </div>
              <div className="flex items-start justify-between gap-2.5 px-3.5 py-3">
                <div className="min-w-0">
                  <div className="truncate text-[13.5px] font-bold">
                    {a.legend}
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-neutral-500">
                    {a.location}
                  </div>
                </div>
                <span className="rounded-full border border-ink px-2.25 py-0.75 text-[10px] font-bold tracking-[0.12em] whitespace-nowrap uppercase">
                  {titleOf(a.category)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </PageBody>

      <EntityDrawer<IAdminArtwork>
        open={editing !== null}
        eyebrow="Creative"
        title={editing === "new" ? "Nova peça" : "Editar peça"}
        fields={fields}
        initial={initial}
        saving={save.isPending}
        onClose={() => setEditing(null)}
        onSave={(v) => save.mutate(v)}
        onDelete={
          editing && editing !== "new"
            ? () => remove.mutate(editing.id)
            : undefined
        }
      />
    </>
  );
}
