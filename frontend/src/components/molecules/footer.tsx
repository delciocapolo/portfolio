import Logo from "../atoms/logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink px-6 py-7 text-white">
      <div className="mx-auto flex max-w-[1216px] flex-wrap items-center justify-between gap-6">
        <Logo inverseLogo={true} />
        <div className="text-xs text-neutral-400">&copy; {currentYear}</div>
      </div>
    </footer>
  );
}
