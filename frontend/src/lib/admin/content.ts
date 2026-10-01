export type MdBlock = { type: "h2" | "p" | "quote" | "code"; text: string };

/** Parser mínimo para a pré-visualização do editor. O site renderiza o MDX real. */
export function parseBlocks(md: string): MdBlock[] {
  const out: MdBlock[] = [];
  (md || "").split(/```[a-z]*\n?/).forEach((part, i) => {
    if (i % 2 === 1) {
      out.push({ type: "code", text: part.replace(/\n$/, "") });
      return;
    }
    part
      .split(/\n{2,}/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((b) => {
        if (b.startsWith("## ")) out.push({ type: "h2", text: b.slice(3) });
        else if (b.startsWith("> "))
          out.push({ type: "quote", text: b.replace(/^> /gm, "") });
        else out.push({ type: "p", text: b });
      });
  });
  return out;
}

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const countWords = (value: string) =>
  value.trim().split(/\s+/).filter(Boolean).length;

export const readTime = (words: number) =>
  `${Math.max(1, Math.round(words / 200))} min`;

export const parseTags = (value: string) =>
  value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const MONTHS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

/** Mesmo formato de postedAt usado em src/data/posts.ts ("12 Mar 2026"). */
export const formatPostDate = (date = new Date()) =>
  `${String(date.getDate()).padStart(2, "0")} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

export function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
