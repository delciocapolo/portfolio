import { cn } from "@src/lib/utils";

interface SocialsProps {
  firstFull?: boolean;
}

const socials = [
  {
    label: "in",
    description: "Linkedin",
    href: "https://www.linkedin.com/in/delciocapolo",
  },
  {
    label: "Gh",
    description: "Github",
    href: "https://www.github.com/delciocapolo",
  },
  {
    label: "X",
    description: "X/Twitter",
    href: "https://x.com/delciocapolo",
  },
  {
    label: "Dr",
    description: "Discord",
    href: "https://discord.com/users/1011389097799077959",
  },
];

export function Socials({ firstFull = false }: SocialsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {socials?.map((social, i) => (
        <a
          key={social.label}
          href={social.href}
          title={social.description}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "border-ink flex size-14 items-center justify-center rounded border-2 text-sm font-bold no-underline hover:bg-black hover:text-white",
            firstFull && i === 0 ? "bg-ink text-white" : "",
          )}
        >
          {social.label}
        </a>
      ))}
    </div>
  );
}
