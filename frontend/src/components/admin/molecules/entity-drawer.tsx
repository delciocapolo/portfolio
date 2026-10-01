import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@src/lib/utils";
import { parseTags } from "@src/lib/admin/content";
import { ui } from "../atoms/ui";
import { Toggle } from "../atoms/toggle";
import { ImageInput } from "../atoms/image-input";

export type FieldType =
  | "text"
  | "mono"
  | "number"
  | "textarea"
  | "select"
  | "toggle"
  | "tags"
  | "image";

export interface IField<T> {
  key: keyof T & string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  placeholder?: string;
  hint?: string;
  /** Texto ao lado do toggle */
  on?: string;
  off?: string;
}

interface IEntityDrawerProps<T> {
  open: boolean;
  eyebrow: string;
  title: string;
  fields: IField<T>[];
  initial: Partial<T>;
  saving?: boolean;
  onClose: () => void;
  onSave: (values: Partial<T>) => void;
  onDelete?: () => void;
}

type Draft = Record<string, any>;

/**
 * Painel lateral de criação/edição. Usa <dialog> nativo: camada de topo, foco preso e Esc a fechar.
 */
export function EntityDrawer<T>({
  open,
  eyebrow,
  title,
  fields,
  initial,
  saving,
  onClose,
  onSave,
  onDelete,
}: IEntityDrawerProps<T>) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState<Draft>({});
  const [tags, setTags] = useState<Record<string, string>>({});

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open) {
      const values = { ...(initial as Draft) };
      setDraft(values);
      setTags(
        Object.fromEntries(
          fields
            .filter((f) => f.type === "tags")
            .map((f) => [
              f.key,
              Array.isArray(values[f.key]) ? values[f.key].join(", ") : "",
            ]),
        ),
      );
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [open, initial, fields]);

  const set = (key: string, value: unknown) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const values: Draft = { ...draft };
    fields.forEach((f) => {
      if (f.type === "tags") values[f.key] = parseTags(tags[f.key] ?? "");
    });
    onSave(values as Partial<T>);
  };

  return (
    <dialog
      ref={dialog}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === dialog.current && onClose()}
      className="m-0 ml-auto h-dvh max-h-dvh w-full max-w-120 border-0 border-l-2 border-ink bg-white p-0 backdrop:bg-black/45"
    >
      <form onSubmit={submit} className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b-2 border-ink px-6.5 py-5.5">
          <div>
            <div className={cn(ui.eyebrow, "mb-1")}>{eyebrow}</div>
            <div className="text-xl font-extrabold tracking-[-0.02em]">
              {title}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className={cn(ui.btnOutline, "size-9.5 px-0")}
          >
            <Icon icon="lucide:x" className="text-lg" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6.5 py-5.5">
          {fields.map((f) => (
            <div key={f.key} className="flex flex-col gap-1.75">
              <label
                htmlFor={`field-${f.key}`}
                className="text-[12.5px] font-semibold"
              >
                {f.label}
              </label>

              {(f.type === "text" || f.type === "mono") && (
                <input
                  id={`field-${f.key}`}
                  value={draft[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={cn(ui.input, f.type === "mono" && ui.mono)}
                />
              )}
              {f.type === "tags" && (
                <input
                  id={`field-${f.key}`}
                  value={tags[f.key] ?? ""}
                  onChange={(e) =>
                    setTags((t) => ({ ...t, [f.key]: e.target.value }))
                  }
                  placeholder={f.placeholder}
                  className={ui.input}
                />
              )}
              {f.type === "number" && (
                <input
                  id={`field-${f.key}`}
                  type="number"
                  value={draft[f.key] ?? 0}
                  onChange={(e) => set(f.key, Number(e.target.value))}
                  className={cn(ui.input, "w-35")}
                />
              )}
              {f.type === "textarea" && (
                <textarea
                  id={`field-${f.key}`}
                  rows={5}
                  value={draft[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={cn(ui.input, "resize-y leading-[1.65]")}
                />
              )}
              {f.type === "select" && (
                <select
                  id={`field-${f.key}`}
                  value={draft[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  className={ui.input}
                >
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              )}
              {f.type === "toggle" && (
                <div className="flex items-center gap-3">
                  <Toggle
                    checked={!!draft[f.key]}
                    onChange={(v) => set(f.key, v)}
                    label={f.label}
                  />
                  <span className="text-[13.5px] text-neutral-600">
                    {draft[f.key] ? f.on : f.off}
                  </span>
                </div>
              )}
              {f.type === "image" && (
                <ImageInput
                  value={draft[f.key]}
                  onChange={(v) => set(f.key, v)}
                />
              )}

              {f.hint && (
                <div className="text-[11.5px] text-neutral-500">{f.hint}</div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t-2 border-ink px-6.5 py-4">
          <div>
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center gap-1.5 text-[13.5px] font-semibold text-(--error-700)"
              >
                <Icon icon="lucide:trash-2" className="text-base" />
                Eliminar
              </button>
            )}
          </div>
          <div className="flex gap-2.5">
            <button type="button" onClick={onClose} className={ui.btnOutline}>
              Cancelar
            </button>
            <button type="submit" disabled={saving} className={ui.btnPrimary}>
              {saving ? "A guardar…" : "Guardar"}
            </button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
