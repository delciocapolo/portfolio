import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Placeholder } from "@src/components/atoms/placeholder";
import { articleService } from "@src/services/article/index.service";
import { getPost } from "@src/services/article/utils";
import type { IPost } from "@src/services/article/types";
import Container from "@src/components/atoms/container";
import { Icon } from "@iconify/react";

interface ILoaderData {
  posts: IPost[];
  post: IPost;
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    try {
      const { data } = await articleService.listPosts();
      const post = getPost(data, params.slug);

      if (!post) throw new Error("Post not found");

      return { posts: data, post: post };
    } catch (error) {
      throw notFound({ data: { message: (error as Error).message } });
    }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.post.title || "Artigo"} — Délcio Capolo` }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { posts, post }: ILoaderData = Route.useLoaderData();
  const postIndex = posts.findIndex((p) => p.slug === post.slug) + 1;
  const proximo = posts[postIndex % posts.length];

  return (
    <>
      <Container className="max-w-[800px] pb-0 pt-14">
        <Link
          to="/blog"
          className="mb-10 text-body-16 font-semibold no-underline inline-flex items-center flex-row gap-2"
        >
          <Icon icon={"bitcoin-icons:arrow-left-filled"} />
          Voltar aos artigos
        </Link>
        <div className="mb-5 text-body-12 font-bold tracking-[0.16em] uppercase">
          {post.category}
        </div>
        <h1 className="m-0 mb-7 text-headline-64 leading-[1.1] font-extrabold tracking-[-0.025em]">
          {post.title}
        </h1>
        <div className="border-ink flex items-center gap-3.5 border-b-2 pb-9">
          <span className="bg-ink block size-11 rounded-full" />
          <div>
            <div className="text-body-16 font-semibold">Délcio Capolo</div>
            <div className="text-body-14 text-neutral-500">
              {post.postedAt} · {post.readTime} de leitura
            </div>
          </div>
        </div>
      </Container>

      <Container className="max-w-[1000px] pb-0 pt-10">
        <div className="border-ink h-[clamp(260px,42vw,460px)] rounded-xl border-2">
          <Placeholder label="Imagem de capa do artigo" />
        </div>
      </Container>

      <Container className="prose prose-neutral mx-auto max-w-[720px] px-6 pb-0 pt-14 prose-headings:font-extrabold prose-headings:tracking-[-0.02em] prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:bg-neutral-100 prose-blockquote:px-8 prose-blockquote:py-1 prose-blockquote:not-italic">
        <p className="lead text-headline-24 leading-[1.7] font-medium">
          Durante três projectos seguidos escrevi a mesma camada de tipos duas
          vezes: uma no servidor, outra no cliente. Na quarta vez decidi parar e
          perguntar porquê.
        </p>
        <p className="text-body-18">
          O padrão era sempre o mesmo. Um controlador Nest devolvia um objecto,
          eu redeclarava a forma desse objecto no frontend, e a partir daí os
          dois ficheiros viviam vidas separadas. Enquanto o projecto era pequeno
          funcionava. Ao quinto endpoint já havia campos que só existiam num dos
          lados.
        </p>
        <h2 className="text-headline-32">O que o REST me estava a custar</h2>
        <p className="text-body-18">
          Não era performance. Era o tempo entre mudar o backend e descobrir que
          o frontend estava errado. Esse tempo, num projecto a solo, é o custo
          mais alto que existe: ninguém me avisa, o compilador não sabe, e o bug
          aparece em produção.
        </p>
        <blockquote className="text-body-18">
          Um tipo partilhado não é uma optimização técnica. É um alarme que
          dispara antes do utilizador.
        </blockquote>
        <h2 className="text-headline-32">A primeira meia hora</h2>
        <p className="text-body-18">
          A configuração inicial é mais curta do que a documentação faz parecer.
          Um router, um contexto, e o cliente passa a inferir tudo a partir do
          servidor.
        </p>
        <pre className="p-5">
          <code>
            {`// server/router.ts
export const appRouter = router({
  projectos: publicProcedure
    .input(z.object({ limite: z.number().default(10) }))
    .query(({ input }) => db.projecto.findMany({ take: input.limite })),
})`}
          </code>
        </pre>
        <p className="text-body-18">
          A partir daqui o editor sabe o que o endpoint devolve. Renomear um
          campo no servidor sublinha imediatamente todos os sítios do cliente
          que dependiam dele. Foi isso que comprei.
        </p>
        <h2 className="text-headline-32">Onde continuo a usar REST</h2>
        <p className="text-body-18">
          Em tudo o que é público. Webhooks, integrações de terceiros, qualquer
          coisa que outra equipa vá consumir sem o meu TypeScript. A escolha não
          é ideológica: é sobre quem está do outro lado da linha.
        </p>
        <p className="text-body-18">
          Se estás sozinho num produto e controlas as duas pontas, vale a meia
          hora. Se o teu cliente é o mundo, escreve o contrato e documenta-o.
        </p>
      </Container>

      <Container className="max-w-[720px] pt-8 pb-24">
        <div className="border-ink flex flex-wrap gap-2.5 border-t-2 py-8">
          {["TypeScript", "Nest.js", "Arquitectura"]?.map((t) => (
            <span
              key={t}
              className="border-ink rounded-full border px-4 py-1.5 text-body-14 font-semibold"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mb-4 text-body-12 font-bold tracking-[0.16em] text-neutral-500 uppercase">
          A seguir
        </div>
        <Link
          to="/blog/$slug"
          params={{ slug: proximo.slug }}
          className="card-lift border-ink flex items-end justify-between gap-6 rounded-xl border-2 p-7 no-underline"
        >
          <span>
            <span className="mb-2 block text-body-12 font-bold tracking-[0.16em] text-neutral-500 uppercase">
              {proximo.category}
            </span>
            <span className="block text-headline-24 font-bold tracking-[-0.01em]">
              {proximo.title}
            </span>
          </span>
          <span className="py-2">
            <Icon
              icon={"lucide:square-arrow-out-up-right"}
              className="text-xl"
            />
          </span>
        </Link>
      </Container>
    </>
  );
}
