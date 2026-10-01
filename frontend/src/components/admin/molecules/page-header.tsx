import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { cn } from "@src/lib/utils";
import { ui } from "../atoms/ui";

export interface IPageAction {
  label: string;
  icon: string;
  onClick: () => void;
  disabled?: boolean;
}

interface IPageHeaderProps {
  crumb: string;
  title: string;
  search?: { value: string; onChange: (value: string) => void };
  action?: IPageAction;
}

export function PageHeader({ crumb, title, search, action }: IPageHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex min-h-(--header-height) items-center justify-between gap-4 border-b border-neutral-200 bg-white px-8 py-3">
      <div className="min-w-35 flex-[1_1_180px]">
        <div className={ui.eyebrow}>{crumb}</div>
        <h1 className="truncate text-[21px] font-extrabold tracking-[-0.02em]">
          {title}
        </h1>
      </div>

      <div className="flex min-w-0 flex-[0_1_auto] items-center gap-2.5">
        {search && (
          <label className="flex h-10.5 w-50 min-w-27.5 flex-[1_1_200px] items-center gap-2 rounded-lg border border-neutral-300 px-3 focus-within:border-ink">
            <Icon
              icon="lucide:search"
              className="shrink-0 text-base text-neutral-500"
            />
            <input
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              placeholder="Pesquisar"
              className="min-w-0 flex-1 bg-transparent text-[13.5px] outline-none"
            />
          </label>
        )}
        <Link to="/" target="_blank" className={ui.btnOutline}>
          Ver site
          <Icon icon="lucide:external-link" className="text-[15px]" />
        </Link>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            disabled={action.disabled}
            className={ui.btnPrimary}
          >
            <Icon icon={action.icon} className="text-base" />
            {action.label}
          </button>
        )}
      </div>
    </header>
  );
}

export function PageBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 flex-1 px-8 pt-7 pb-18", className)}>
      {children}
    </div>
  );
}

export function PageIntro({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-180 text-[14.5px] leading-[1.7] text-pretty text-neutral-600">
      {children}
    </p>
  );
}
