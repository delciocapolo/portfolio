import { Link } from "@tanstack/react-router";
import { MENUS } from "../constants";
import { Icon } from "@iconify/react";
import { cn } from "@src/lib/utils";

export default function NavbarDesktop() {
  return (
    <>
      <nav
        className={
          "hidden lg:flex flex-wrap items-center gap-7 text-body-14 font-medium"
        }
      >
        {MENUS?.map((menu) => (
          <Link
            key={menu.to}
            to={menu.to}
            className="border-b-2 border-transparent pb-0.5"
            activeProps={{ className: "border-b-2! border-ink! pb-0.5!" }}
          >
            {menu.label}
          </Link>
        ))}
      </nav>

      <a
        href="/resume.pdf"
        className={cn(
          "hidden",
          "lg:flex items-center gap-2.5 rounded-xl px-6.5 py-3.5 text-body-14! font-semibold text-white hover:opacity-85 bg-ink",
        )}
      >
        Resume
        <Icon icon={"akar-icons:download"} className="text-xl" />
      </a>
    </>
  );
}
