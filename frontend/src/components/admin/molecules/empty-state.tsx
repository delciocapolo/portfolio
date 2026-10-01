import { Icon } from "@iconify/react";
import { ui } from "../atoms/ui";

interface IEmptyStateProps {
  title: string;
  text: string;
  action?: { label: string; onClick: () => void };
  icon?: string;
}

export function EmptyState({
  title,
  text,
  action,
  icon = "lucide:inbox",
}: IEmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-5.5 py-14 text-center">
      <Icon icon={icon} className="mb-3 text-3xl text-neutral-400" />
      <div className="mb-1.5 text-base font-bold">{title}</div>
      <div className="mb-4.5 text-[13.5px] text-neutral-600">{text}</div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={ui.btnOutline}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
