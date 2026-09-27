import Logo from "../../atoms/logo";
import Container from "../../atoms/container";
import NavbarDesktop from "./components/navbar-desktop";
import NavbarMobile, { ItemsNavbarMobile } from "./components/navbar-mobile";
import { useEffect, useRef } from "react";
import { useClickOutside } from "@src/lib/hooks/use-click-outside";
import { resetNavbarStore, store, updateNavbarIsActive } from "./store";
import { useSelector } from "@tanstack/react-store";
import { useLocation } from "@tanstack/react-router";

export function Nav() {
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const { isActive } = useSelector(store, (state) => state);
  const location = useLocation();

  useClickOutside(navbarRef, () => {
    if (isActive) updateNavbarIsActive(false);
  });

  useEffect(resetNavbarStore, [location.pathname]);

  return (
    <header
      ref={navbarRef}
      className="border-line sticky top-0 z-50 border-b bg-white"
    >
      <Container className="flex flex-wrap items-center justify-between gap-6 px-6 py-4">
        <Logo />
        <NavbarDesktop />
        <NavbarMobile />

        <ItemsNavbarMobile />
      </Container>
    </header>
  );
}
