import { cn } from "@src/lib/utils";
import type { MessageStatus, PostStatus } from "@src/shared/@types/admin";

export type PillTone =
  "ink" | "outline" | "muted" | "success" | "warning" | "error";

export interface IPill {
  label: string;
  tone: PillTone;
}

const TONES: Record<PillTone, string> = {
  ink: "bg-ink text-white border-ink",
  outline: "bg-white text-ink border-ink",
  muted: "bg-neutral-100 text-neutral-500 border-neutral-100",
  success: "bg-(--success-100) text-(--success-700) border-(--success-200)",
  warning: "bg-(--warning-100) text-(--warning-700) border-(--warning-200)",
  error: "bg-(--error-100) text-(--error-700) border-(--error-200)",
};

export const POST_STATUS: Record<PostStatus, IPill> = {
  DRAFT: { label: "Rascunho", tone: "muted" },
  SCHEDULED: { label: "Agendado", tone: "outline" },
  PUBLISHED: { label: "Publicado", tone: "ink" },
  ARCHIVED: { label: "Arquivado", tone: "muted" },
};

export const MESSAGE_STATUS: Record<MessageStatus, IPill> = {
  NEW: { label: "Nova", tone: "ink" },
  READ: { label: "Lida", tone: "outline" },
  REPLIED: { label: "Respondida", tone: "success" },
  ARCHIVED: { label: "Arquivada", tone: "muted" },
  SPAM: { label: "Spam", tone: "error" },
};

export function StatusPill({
  label,
  tone,
  className,
}: IPill & { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border-[1.5px] px-2.5 py-0.75 text-[11px] font-bold",
        TONES[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
