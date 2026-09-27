import { Activity } from "react";
import { store } from "../store";
import { cn } from "@src/lib/utils";
import { Icon } from "@iconify/react";
import { MENUS } from "../constants";
import { Link } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";

export default function NavbarMobile() {
  const { isActive } = useSelector(store, (state) => state);
  const onToggleMenu = () => {
    store.setState((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };

  return (
    <button
      type="button"
      onClick={onToggleMenu}
      className={cn(
        "hidden",
        "max-lg:flex items-center rounded-xl px-4.5 py-2.5 font-semibold text-white hover:opacity-85 bg-ink",
      )}
    >
      {isActive ? (
        <Icon icon={"mdi:close"} className="text-3xl" />
      ) : (
        <Icon icon={"ci:menu-duo-lg"} className="text-3xl" />
      )}
    </button>
  );
}

export function ItemsNavbarMobile() {
  const { isActive } = useSelector(store, (state) => state);

  return (
    <Activity mode={isActive ? "visible" : "hidden"}>
      <nav
        className={cn(
          "hidden w-full overflow-hidden",
          "max-lg:flex flex-col items-start gap-1 text-body-18 font-medium duration-300",
        )}
      >
        {MENUS?.map((menu) => (
          <Link
            key={menu.to}
            to={menu.to}
            className="border-b-2 border-transparent py-3 w-full"
            activeProps={{ className: "font-extrabold" }}
          >
            {menu.label}
          </Link>
        ))}
      </nav>
    </Activity>
  );
}
