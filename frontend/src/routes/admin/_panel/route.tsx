import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { Sidebar } from "@src/components/admin/molecules/sidebar";
import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { Toaster } from "sonner";
import { env } from "@src/env";

/**
 * Sessão lida no servidor. O papel vem de publicMetadata.role,
 * exposto no token em Clerk → Sessions → Customize session token: { "metadata": "{{user.public_metadata}}" }
 */
const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const { isAuthenticated, userId, sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role || null;
  return { isAuthenticated, userId, role };
});

export const Route = createFileRoute("/admin/_panel")({
  beforeLoad: async () => {
    try {
      const session = await getAdminSession();
      if (!session.isAuthenticated) {
        throw redirect({ to: "/admin/sign-in/$", params: { _splat: "" } });
      }
      if (session.role !== "admin") {
        throw redirect({ to: "/" });
      }
      return { session };
    } catch (error) {
      console.error((error as Error).message);
    }
  },
  head: () => ({
    meta: [
      { title: `Backoffice — ${env.VITE_APP_NAME}` },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="grid min-h-dvh bg-white lg:grid-cols-[248px_minmax(0,1fr)]">
      <Sidebar />
      <main className="flex min-w-0 flex-col">
        <Outlet />
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast:
              "rounded-lg! bg-ink! text-white! border-0! shadow-[6px_6px_0_#d0d0d0]! font-sans! text-[13.5px]! font-semibold!",
          },
        }}
      />
    </div>
  );
}
