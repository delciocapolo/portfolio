import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/tanstack-react-start";
import { env } from "@src/env";

export const Route = createFileRoute("/admin/sign-in/$")({
  head: () => ({
    meta: [
      { title: "Entrar — Backoffice" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-ink p-6">
      <div className="flex items-center gap-2.5 text-white">
        <span className="block size-6 rounded-full bg-white" />
        <span className="text-base font-bold tracking-tight">
          {env.VITE_APP_NAME}
        </span>
        <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
          Backoffice
        </span>
      </div>
      <SignIn
        routing="path"
        path="/admin/sign-in"
        forceRedirectUrl="/admin"
        appearance={{
          variables: {
            colorPrimary: "#000000",
            colorText: "#000000",
            borderRadius: "3px",
            fontFamily: "Poppins, sans-serif",
          },
          elements: {
            card: "border-2 border-black shadow-[8px_8px_0_#fff]",
          },
        }}
      />
    </div>
  );
}
