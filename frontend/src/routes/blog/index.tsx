import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Eyebrow } from "@src/components/atoms/eyebrow";
import { Placeholder } from "@src/components/atoms/placeholder";
import { articleService } from "@src/services/article/index.service";
import type { IPost, IPostCategory } from "@src/services/article/types";
import Container from "@src/components/atoms/container";
import { cn } from "@src/lib/utils";
import { Icon } from "@iconify/react";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import {
  schemaSubscribeNewsLetter,
  type ISchemaSubscribeNewsLetter,
} from "@src/shared/schemas/subsribe-news-letter";
import { newsLetterService } from "@src/services/news-letter/index.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface ILoaderData {
  posts: IPost[];
  categories: IPostCategory[];
}

export const Route = createFileRoute("/blog/")({
  loader: async () => {
    const posts = await articleService.listPosts();
    const categories = await articleService.listBlogCategories();
    return { posts: posts.data || [], categories: categories.data || [] };
  },
  head: () => ({ meta: [{ title: "Blog — Délcio Capolo" }] }),
  component: Blog,
});

const { fieldContext, formContext } = createFormHookContexts();
const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
});

function Blog() {
  const { posts, categories }: ILoaderData = Route.useLoaderData();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const filteredPosts = posts.filter(
    (p) => selectedCategory === "all" || p.category === selectedCategory,
  );

  const { mutate: subscribeNewsLetter } = useMutation({
    mutationFn: newsLetterService.subscribe,
    onSuccess: () => {
      toast.success(`${form.state.values.email || "-----"} subscrito.`);
      form.reset();
    },
    onError: () => {
      toast.error("Serviço temporariamente indisponível.");
    },
  });

  const form = useAppForm({
    defaultValues: { email: "" } satisfies ISchemaSubscribeNewsLetter,
    validators: { onSubmit: schemaSubscribeNewsLetter },
    onSubmit: ({ value }) => subscribeNewsLetter(value),
  });

  return (
    <>
      <Container className="pt-20 pb-12">
        <Eyebrow>Blog &amp; Artigos</Eyebrow>
        <h1 className="m-0 mb-6 text-display-80 leading-[1.02] font-medium tracking-[-0.03em]">
          Escrevo sobre <span className="font-extrabold">código</span>,
          <br />
          produto e o ofício.
        </h1>
        <p className="m-0 max-w-[620px] text-body-16 leading-[1.75] text-neutral-600">
          Notas de quem constrói todos os dias. Arquitectura, decisões técnicas
          que deram certo, outras que não, e o que aprendi a desenvolver produto
          a partir de Luanda.
        </p>
      </Container>

      <Container className="pt-0 pb-10">
        <div className="flex flex-wrap gap-2.5">
          {categories?.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => setSelectedCategory(category.slug)}
              className={cn(
                "border-ink rounded-full border-2 px-5 py-2.5 text-body-14! font-semibold",
                category.slug === selectedCategory
                  ? "bg-ink text-white"
                  : "bg-white text-ink",
              )}
            >
              {category.title}
            </button>
          ))}
        </div>
      </Container>

      <Container className="grid grid-cols-[repeat(auto-fill,minmax(330px,1fr))] gap-8 pt-0">
        {filteredPosts?.map((p) => (
          <Link
            key={p.slug}
            to="/blog/$slug"
            params={{ slug: p.slug }}
            className="card-lift border-ink flex flex-col rounded-xl border-2 bg-white no-underline"
          >
            <div className="border-ink h-50 border-b-2">
              <Placeholder label="Capa do artigo" />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
              <span className="text-body-12 font-bold tracking-[0.16em] uppercase">
                {p.category}
              </span>
              <span className="text-headline-24 leading-snug font-bold tracking-[-0.01em]">
                {p.title}
              </span>
              <span className="flex-1 text-body-16 leading-relaxed text-neutral-600">
                {p.summary}
              </span>
              <span className="flex items-center justify-between border-t border-neutral-200 pt-3 text-body-12 font-medium text-neutral-500">
                <span>
                  {p.postedAt} · {p.readTime}
                </span>
                <Icon
                  icon={"lucide:square-arrow-out-up-right"}
                  className="text-lg"
                />
              </span>
            </div>
          </Link>
        ))}
      </Container>

      <Container className="max-w-none py-22 text-white bg-ink">
        <Container className="max-w-[900px] text-center py-0 px-0">
          <h2 className="m-0 mb-4 text-headline-40 font-medium tracking-[-0.02em]">
            Um email por <span className="font-extrabold">mês</span>. Sem ruído.
          </h2>
          <p className="mx-auto mb-8 max-w-[520px] text-body-16 leading-relaxed text-neutral-400">
            O artigo novo e uma ou duas coisas que andei a ler. Podes sair
            quando quiseres.
          </p>
          <form
            className="flex flex-wrap justify-center gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field name="email">
              {(field) => (
                <div className="space-y-2">
                  <input
                    id={field.name}
                    name="email"
                    inputMode="email"
                    type="email"
                    aria-label="Email do solicitante"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Ex: domingos@cassoma.com"
                    className="max-w-[380px] min-w-[260px] flex-1 rounded border border-neutral-700 bg-neutral-900 px-4.5 py-4 text-sm text-white outline-none focus:border-white"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-body-14 text-(--error-500)">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <button
              type="submit"
              className="text-ink rounded bg-white px-7.5 py-4 h-fit text-body-16 font-semibold hover:opacity-85"
            >
              Subscrever
            </button>
          </form>
        </Container>
      </Container>

      <hr className="h-0.5 bg-neutral-800" />
    </>
  );
}
