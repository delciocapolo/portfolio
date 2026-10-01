import type { ReactNode } from "react";
import { cn } from "@src/lib/utils";
import { StatusPill, type IPill } from "../atoms/status-pill";
import { ui } from "../atoms/ui";

export interface IColumn<T> {
  key: keyof T & string;
  label: string;
  /** Faixa do grid, ex.: "minmax(0,2fr)" ou "110px" */
  width: string;
  kind?: "strong" | "text" | "mono" | "pill";
  pill?: (row: T) => IPill;
  render?: (row: T) => ReactNode;
  empty?: string;
}

interface IDataTableProps<T extends { id: string }> {
  columns: IColumn<T>[];
  rows: T[];
  onRowClick: (row: T) => void;
  empty?: ReactNode;
  loading?: boolean;
}

const display = (value: unknown, fallback = "—") => {
  if (Array.isArray(value)) return value.length ? value.join(" · ") : fallback;
  if (value === "" || value === null || value === undefined) return fallback;
  return String(value);
};

function Cell<T>({ column, row }: { column: IColumn<T>; row: T }) {
  if (column.render) return <>{column.render(row)}</>;
  if (column.kind === "pill" && column.pill)
    return <StatusPill {...column.pill(row)} />;

  const text = display(row[column.key], column.empty);
  return (
    <div
      className={cn(
        "truncate",
        column.kind === "strong" && "text-sm font-bold tracking-[-0.01em]",
        column.kind === "mono" && cn(ui.mono, "text-neutral-600"),
        (!column.kind || column.kind === "text") &&
          "text-[13px] text-neutral-600",
      )}
    >
      {text}
    </div>
  );
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  onRowClick,
  empty,
  loading,
}: IDataTableProps<T>) {
  const grid = { gridTemplateColumns: columns.map((c) => c.width).join(" ") };

  return (
    <div className="overflow-hidden rounded-lg border-2 border-ink bg-white">
      <div
        style={grid}
        className="grid gap-4 border-b-2 border-ink bg-neutral-50 px-5.5 py-3.25"
      >
        {columns.map((c) => (
          <div key={c.key} className={cn(ui.eyebrow, "min-w-0 truncate")}>
            {c.label}
          </div>
        ))}
      </div>

      {loading &&
        Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="border-b border-neutral-200 px-5.5 py-4.5 last:border-b-0"
          >
            <div className="h-3.5 w-2/5 animate-pulse rounded bg-neutral-100" />
          </div>
        ))}

      {!loading &&
        rows.map((row) => (
          <button
            type="button"
            key={row.id}
            style={grid}
            onClick={() => onRowClick(row)}
            className="grid w-full items-center gap-4 border-b border-neutral-200 px-5.5 py-3.75 text-left last:border-b-0 hover:bg-neutral-50"
          >
            {columns.map((c) => (
              <div key={c.key} className="min-w-0">
                <Cell column={c} row={row} />
              </div>
            ))}
          </button>
        ))}

      {!loading && rows.length === 0 && empty}
    </div>
  );
}
