import Logo from "../../atoms/logo";
import Container from "../../atoms/container";
import NavbarDesktop from "./components/navbar-desktop";
import NavbarMobile, { ItemsNavbarMobile } from "./components/navbar-mobile";

export function Nav() {
  return (
    <header className="border-line sticky top-0 z-50 border-b bg-white">
      <Container className="flex flex-wrap items-center justify-between gap-6 px-6 py-4">
        <Logo />
        <NavbarDesktop />
        <NavbarMobile />

        <ItemsNavbarMobile />
      </Container>
    </header>
  );
}
