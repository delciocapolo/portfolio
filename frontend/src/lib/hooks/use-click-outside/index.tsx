import { useEffect, type RefObject } from "react";

export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
) => {
  function handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (ref.current && ref.current.contains(target)) return;
    if (target.closest("[data-dialog-content]")) return;

    onClose();
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onClose]);
};
