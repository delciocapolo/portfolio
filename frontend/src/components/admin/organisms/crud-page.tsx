import { useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";
import type { ICrudService } from "@src/services/utils/crud";
import {
  PageBody,
  PageHeader,
  PageIntro,
  type IPageAction,
} from "../molecules/page-header";
import { DataTable, type IColumn } from "../molecules/data-table";
import { EntityDrawer, type IField } from "../molecules/entity-drawer";
import { EmptyState } from "../molecules/empty-state";

export interface ICrudConfig<T extends { id: string }> {
  queryKey: readonly unknown[];
  service: ICrudService<T>;
  crumb: string;
  title: string;
  description: string;
  singular: string;
  newLabel: string;
  createdLabel: string;
  columns: IColumn<T>[];
  fields: IField<T>[];
  defaults: Omit<T, "id">;
  schema?: z.ZodType;
}

interface ICrudPageProps<T extends { id: string }> {
  config: ICrudConfig<T>;
  /** Substitui o título do header (ex.: página com separadores) */
  title?: string;
  aboveTable?: (rows: T[]) => ReactNode;
  /** Substitui a acção "Novo …" do header */
  action?: (rows: T[]) => IPageAction;
}

export function CrudPage<T extends { id: string }>({
  config,
  title,
  aboveTable,
  action,
}: ICrudPageProps<T>) {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<T | "new" | null>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: config.queryKey,
    queryFn: config.service.list,
    select: (r) => r.data,
  });

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return term
      ? rows.filter((r) => JSON.stringify(r).toLowerCase().includes(term))
      : rows;
  }, [rows, q]);

  const invalidate = () => qc.invalidateQueries({ queryKey: config.queryKey });

  const save = useMutation({
    mutationFn: (values: Partial<T>) =>
      editing === "new" || !editing
        ? config.service.create(values as Omit<T, "id">)
        : config.service.update(editing.id, values),
    onSuccess: () => {
      toast.success(
        editing === "new" ? config.createdLabel : "Alterações guardadas",
      );
      setEditing(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => config.service.remove(id),
    onSuccess: () => {
      toast.success("Eliminado");
      setEditing(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const initial = useMemo<Partial<T>>(
    () =>
      editing === "new"
        ? ({ ...config.defaults } as Partial<T>)
        : (editing ?? {}),
    [editing, config.defaults],
  );

  const onSave = (values: Partial<T>) => {
    if (config.schema) {
      const parsed = config.schema.safeParse(values);
      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message ?? "Dados inválidos");
        return;
      }
    }
    save.mutate(values);
  };

  const openNew = () => setEditing("new");

  return (
    <>
      <PageHeader
        crumb={config.crumb}
        title={title ?? config.title}
        search={{ value: q, onChange: setQ }}
        action={
          action
            ? action(rows)
            : { label: config.newLabel, icon: "lucide:plus", onClick: openNew }
        }
      />
      <PageBody className="flex flex-col gap-5">
        <PageIntro>{config.description}</PageIntro>
        {aboveTable?.(rows)}
        <DataTable
          columns={config.columns}
          rows={filtered}
          loading={isLoading}
          onRowClick={(row) => setEditing(row)}
          empty={
            q ? (
              <EmptyState
                icon="lucide:search-x"
                title="Sem resultados"
                text={`Nada corresponde a "${q}".`}
              />
            ) : (
              <EmptyState
                title={`Ainda não há ${config.title.toLowerCase()}`}
                text="O que criares aqui aparece no site assim que guardares."
                action={{ label: config.newLabel, onClick: openNew }}
              />
            )
          }
        />
        <div className="text-[12.5px] text-neutral-500">
          {filtered.length} de {rows.length} · clica numa linha para editar
        </div>
      </PageBody>

      <EntityDrawer<T>
        open={editing !== null}
        eyebrow={config.title}
        title={editing === "new" ? "Novo registo" : `Editar ${config.singular}`}
        fields={config.fields}
        initial={initial}
        saving={save.isPending}
        onClose={() => setEditing(null)}
        onSave={onSave}
        onDelete={
          editing && editing !== "new"
            ? () => remove.mutate(editing.id)
            : undefined
        }
      />
    </>
  );
}
