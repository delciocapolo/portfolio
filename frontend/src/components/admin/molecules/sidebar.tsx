import { Link, type LinkProps } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { SignOutButton, useUser } from "@clerk/tanstack-react-start";
import { adminServices } from "@src/services/admin";
import { adminKeys } from "@src/services/admin/keys";
import { env } from "@src/env";

interface INavItem {
  to: LinkProps["to"];
  label: string;
  icon: string;
  exact?: boolean;
  badge?: "messages";
}

const NAV: { group: string; items: INavItem[] }[] = [
  {
    group: "Geral",
    items: [
      {
        to: "/admin",
        label: "Dashboard",
        icon: "lucide:layout-dashboard",
        exact: true,
      },
    ],
  },
  {
    group: "Conteúdo",
    items: [
      { to: "/admin/artigos", label: "Artigos", icon: "lucide:file-text" },
      { to: "/admin/categorias", label: "Categorias", icon: "lucide:tags" },
      { to: "/admin/creative", label: "Creative", icon: "lucide:image" },
    ],
  },
  {
    group: "Portfolio",
    items: [
      {
        to: "/admin/projectos",
        label: "Projectos",
        icon: "lucide:folder-kanban",
      },
      {
        to: "/admin/experiencia",
        label: "Experiência",
        icon: "lucide:briefcase",
      },
      { to: "/admin/skills", label: "Skills e stack", icon: "lucide:code-xml" },
      { to: "/admin/depoimentos", label: "Depoimentos", icon: "lucide:quote" },
      {
        to: "/admin/servicos-faq",
        label: "Serviços e FAQ",
        icon: "lucide:circle-help",
      },
    ],
  },
  {
    group: "Site",
    items: [
      {
        to: "/admin/perfil",
        label: "Perfil do site",
        icon: "lucide:user-round",
      },
      {
        to: "/admin/mensagens",
        label: "Mensagens",
        icon: "lucide:inbox",
        badge: "messages",
      },
      { to: "/admin/newsletter", label: "Newsletter", icon: "lucide:mail" },
    ],
  },
];

export function Sidebar() {
  const { user } = useUser();
  const { data: unread = 0 } = useQuery({
    queryKey: adminKeys.messages,
    queryFn: adminServices.messages.list,
    select: (r) => r.data.filter((m) => m.status === "NEW").length,
  });

  const initials = (user?.fullName || env.VITE_APP_NAME)
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <aside className="sticky top-0 hidden h-dvh flex-col overflow-y-auto bg-ink px-3.5 pt-5.5 pb-4.5 text-white lg:flex">
      <div className="mb-4 flex items-center gap-2.5 border-b border-neutral-800 px-2.5 pb-5.5">
        <span className="block size-6 shrink-0 rounded-full bg-white" />
        <div>
          <div className="text-[15px] leading-tight font-bold tracking-tight">
            {env.VITE_APP_NAME}
          </div>
          <div className="mt-1 text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
            Backoffice
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-4.5">
        {NAV.map((g) => (
          <div key={g.group}>
            <div className="px-3 pb-2 text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
              {g.group}
            </div>
            <div className="flex flex-col gap-0.5">
              {g.items.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  activeOptions={{ exact: item.exact }}
                  className="group flex items-center gap-3 rounded-lg px-3 py-2.25 text-[13.5px] font-medium text-neutral-300 hover:bg-white/10 hover:text-white"
                  activeProps={{
                    className: "bg-white text-ink! hover:bg-white! is-active",
                  }}
                >
                  <Icon icon={item.icon} className="shrink-0 text-[17px]" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge === "messages" && unread > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-bold text-ink group-[.is-active]:bg-ink group-[.is-active]:text-white">
                      {unread}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-4 flex items-center gap-2.75 border-t border-neutral-800 px-2.5 pt-4">
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt=""
            className="size-8.5 shrink-0 rounded-full"
          />
        ) : (
          <span className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-extrabold text-ink">
            {initials}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold">
            {user?.fullName || "Délcio Capolo"}
          </div>
          <div className="text-[11px] text-neutral-500">Admin</div>
        </div>
        <SignOutButton redirectUrl="/">
          <button
            type="button"
            title="Sair"
            className="flex text-neutral-500 hover:text-white"
          >
            <Icon icon="lucide:log-out" className="text-[17px]" />
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
