import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { z } from "zod";
import { adminServices } from "@src/services/admin";
import { adminKeys } from "@src/services/admin/keys";
import type { IAdminProfile } from "@src/shared/@types/admin";
import {
  PageBody,
  PageHeader,
} from "@src/components/admin/molecules/page-header";
import { Toggle } from "@src/components/admin/atoms/toggle";
import { ui } from "@src/components/admin/atoms/ui";
import { cn } from "@src/lib/utils";

export const Route = createFileRoute("/admin/_panel/perfil")({
  component: Profile,
});

const schema = z.object({
  name: z.string().trim().min(1, "O nome é obrigatório"),
  email: z.email("Email inválido"),
  socials: z.array(
    z.object({
      network: z.string().min(1, "Indica a rede"),
      url: z.url("URL de rede social inválida"),
    }),
  ),
});

const FIELDS: { key: keyof IAdminProfile; label: string }[] = [
  { key: "name", label: "Nome" },
  { key: "headline", label: "Título profissional" },
  { key: "email", label: "Email público" },
  { key: "phone", label: "Telefone" },
  { key: "location", label: "Localização" },
  { key: "fuso", label: "Fuso e modalidade" },
];

function Profile() {
  const qc = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<IAdminProfile | null>(null);

  const { data } = useQuery({
    queryKey: adminKeys.profile,
    queryFn: adminServices.profile.get,
    select: (r) => r.data,
  });

  useEffect(() => {
    if (data && !form) setForm(structuredClone(data));
  }, [data, form]);

  const save = useMutation({
    mutationFn: (values: IAdminProfile) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message);
      return adminServices.profile.update(values);
    },
    onSuccess: (r) => {
      qc.setQueryData(adminKeys.profile, r);
      toast.success("Perfil actualizado");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!form) {
    return (
      <>
        <PageHeader crumb="Site" title="Perfil do site" />
        <PageBody>
          <div className="h-60 animate-pulse rounded-lg bg-neutral-100" />
        </PageBody>
      </>
    );
  }

  const set = <K extends keyof IAdminProfile>(
    key: K,
    value: IAdminProfile[K],
  ) => setForm((f) => (f ? { ...f, [key]: value } : f));
  const setSocial = (i: number, key: "network" | "url", value: string) =>
    set(
      "socials",
      form.socials.map((s, j) => (j === i ? { ...s, [key]: value } : s)),
    );

  return (
    <>
      <PageHeader
        crumb="Site"
        title="Perfil do site"
        action={{
          label: save.isPending ? "A guardar…" : "Guardar alterações",
          icon: "lucide:check",
          onClick: () => save.mutate(form),
          disabled: save.isPending,
        }}
      />
      <PageBody>
        <div className="flex flex-wrap items-start gap-7">
          <div className="flex min-w-0 flex-[2_1_420px] flex-col gap-6">
            <section className={cn(ui.card, "p-6")}>
              <h2 className="mb-1 text-base font-bold">Identidade</h2>
              <p className="mb-5 text-[13px] text-neutral-600">
                Cabeçalho da home, rodapé e meta tags.
              </p>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
                {FIELDS.map((f) => (
                  <label key={f.key} className={ui.label}>
                    {f.label}
                    <input
                      value={String(form[f.key] ?? "")}
                      onChange={(e) => set(f.key, e.target.value as never)}
                      className={cn(ui.input, "font-normal")}
                    />
                  </label>
                ))}
              </div>
            </section>

            <section className={cn(ui.card, "p-6")}>
              <div className="mb-4.5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="mb-1 text-base font-bold">Redes sociais</h2>
                  <p className="text-[13px] text-neutral-600">
                    Botões quadrados da home e da página de contacto.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    set("socials", [...form.socials, { network: "", url: "" }])
                  }
                  className={cn(ui.btnOutline, "h-9.5")}
                >
                  <Icon icon="lucide:plus" />
                  Adicionar
                </button>
              </div>
              <div className="flex flex-col gap-2.5">
                {form.socials.map((s, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[minmax(90px,140px)_minmax(0,1fr)_42px] gap-2.5"
                  >
                    <input
                      value={s.network}
                      onChange={(e) => setSocial(i, "network", e.target.value)}
                      placeholder="Rede"
                      className={ui.input}
                    />
                    <input
                      value={s.url}
                      onChange={(e) => setSocial(i, "url", e.target.value)}
                      placeholder="https://"
                      className={cn(ui.input, ui.mono)}
                    />
                    <button
                      type="button"
                      title="Remover"
                      onClick={() =>
                        set(
                          "socials",
                          form.socials.filter((_, j) => j !== i),
                        )
                      }
                      className="flex items-center justify-center rounded-lg border border-neutral-300 hover:border-ink"
                    >
                      <Icon icon="lucide:trash-2" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="flex min-w-0 flex-[1_1_260px] flex-col gap-5">
            <section className="rounded-lg bg-ink p-5.5 text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className={cn(ui.eyebrow, "mb-2")}>Disponibilidade</div>
                  <div className="text-base font-bold">
                    {form.isAvailable
                      ? "Disponível para novos projectos"
                      : "Agenda fechada"}
                  </div>
                </div>
                <Toggle
                  tone="success"
                  inverse
                  label="Disponibilidade"
                  checked={form.isAvailable}
                  onChange={(v) => set("isAvailable", v)}
                />
              </div>
            </section>

            <section className={cn(ui.card, "p-5")}>
              <div className={cn(ui.eyebrow, "mb-3.5")}>Resume</div>
              <div className="mb-3.5 flex items-center gap-3">
                <span className="flex h-12 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-ink text-[10px] font-extrabold">
                  PDF
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-semibold">
                    {form.resumeUrl.split("/").pop()}
                  </div>
                  <div className="text-xs text-neutral-500">
                    Botão "Resume" da navbar
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className={cn(ui.btnOutline, "w-full")}
              >
                <Icon icon="lucide:upload" />
                Substituir ficheiro
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  // TODO: enviar para o storage e guardar o URL devolvido
                  set("resumeUrl", `/${file.name}`);
                  toast.success(`${file.name} pronto a guardar`);
                }}
              />
            </section>
          </aside>
        </div>
      </PageBody>
    </>
  );
}
