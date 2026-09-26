import { Activity, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eyebrow } from "@src/components/atoms/eyebrow";
import { Placeholder } from "@src/components/atoms/placeholder";
import { creativeService } from "@src/services/creative/index.service";
import type { IArtwork, IArtworkCategory } from "@src/services/creative/types";
import Container from "@src/components/atoms/container";
import { Icon } from "@iconify/react";
import { cn } from "@src/lib/utils";

interface ILoaderData {
  artworks: IArtwork[];
  categories: IArtworkCategory[];
}

export const Route = createFileRoute("/creative/")({
  loader: async () => {
    const artworks = await creativeService.listArtworks();
    const categories = await creativeService.listArtworkCategories();
    return {
      artworks: artworks.data,
      categories: categories.data,
    };
  },
  head: () => ({ meta: [{ title: "Creative — Délcio Capolo" }] }),
  component: Creative,
});

function Creative() {
  const { artworks, categories }: ILoaderData = Route.useLoaderData();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentArtWork, setCurrentArtWork] = useState<IArtwork | null>(null);
  const filtredArtworks = artworks.filter(
    (p) => selectedCategory === "all" || p.category === selectedCategory,
  );

  return (
    <>
      <Container className="pt-20 pb-12">
        <Eyebrow>Creative</Eyebrow>
        <h1 className="m-0 mb-6 text-[clamp(40px,6vw,76px)] leading-[1.02] font-medium tracking-[-0.03em]">
          Fora do <span className="font-extrabold">editor</span>.
        </h1>
        <p className="m-0 max-w-[620px] text-[15px] leading-[1.75] text-neutral-600">
          Fotografia, espaços, viagens e experimentos que não caberiam num
          repositório. É aqui que descarrego a parte visual do trabalho.
        </p>
      </Container>

      <Container className="pt-0 pb-10">
        <div className="flex flex-wrap gap-2.5">
          {categories?.map((category) => (
            <button
              type="button"
              key={category.slug}
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

      <Container className="columns-[340px] gap-6 pt-0 pb-24">
        {filtredArtworks?.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCurrentArtWork(item)}
            className="card-lift border-ink mb-6 block w-full cursor-zoom-in break-inside-avoid rounded-xl border-2 bg-white text-left"
          >
            <div
              className="border-ink relative border-b-2"
              style={{ height: item.height }}
            >
              <Placeholder label={item.legend} />

              <Activity mode={item.isVideo ? "visible" : "hidden"}>
                <span
                  className={
                    "bg-ink absolute bottom-3.5 left-3.5 rounded-full px-3.5 py-1.5 text-body-10 font-bold tracking-widest text-white flex-center gap-2"
                  }
                >
                  <Icon icon={"at-icons:play"} />
                  VÍDEO
                </span>
              </Activity>
            </div>
            <div className="flex items-start justify-between gap-4 px-5 py-4.5">
              <div>
                <div className="mb-1 text-body-14 font-bold tracking-[-0.01em]">
                  {item.legend}
                </div>
                <div className="text-body-12 font-medium text-neutral-500">
                  {item.location}
                </div>
              </div>
              <div className="border-ink rounded-full border px-2.5 py-1 text-body-10 font-bold tracking-[0.14em] whitespace-nowrap uppercase">
                {item.category}
              </div>
            </div>
          </button>
        ))}
      </Container>

      <Activity
        mode={currentArtWork && currentArtWork != null ? "visible" : "hidden"}
      >
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setCurrentArtWork(null)}
          className="fixed inset-0 z-200 flex cursor-zoom-out flex-col items-center justify-center gap-5 bg-black/95 px-6 py-10"
        >
          <button
            type="button"
            aria-label="Fechar"
            className="absolute top-6 right-7 leading-none font-light text-white"
          >
            <Icon icon={"mdi:close"} className="text-3xl" />
          </button>
          <div className="h-[72vh] w-[min(1100px,100%)] rounded-xl border-2 border-white bg-neutral-900">
            <Placeholder label={currentArtWork?.legend || "-----"} dark />
          </div>
          <div className="text-center text-white">
            <div className="mb-1.5 text-body-18 font-bold">
              {currentArtWork?.legend}
            </div>
            <div className="text-body-14 text-neutral-400">
              {currentArtWork?.location}
            </div>
          </div>
        </div>
      </Activity>
    </>
  );
}
