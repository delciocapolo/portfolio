import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@src/lib/utils";

interface IImageInputProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

/**
 * Drag-and-drop ou escolha de ficheiro. Por agora guarda um data URL.
 * TODO: enviar o ficheiro para o storage (S3/R2) e guardar o URL devolvido — ver MediaAsset no schema.
 */
export function ImageInput({
  value,
  onChange,
  label = "Arrasta ou escolhe uma imagem",
  className,
}: IImageInputProps) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const read = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => input.current?.click()}
      onKeyDown={(e) =>
        (e.key === "Enter" || e.key === " ") && input.current?.click()
      }
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        read(e.dataTransfer.files[0]);
      }}
      className={cn(
        "group relative flex h-50 cursor-pointer items-center justify-center overflow-hidden rounded-lg border bg-neutral-100",
        dragging ? "border-2 border-dashed border-ink" : "border-neutral-300",
        className,
      )}
    >
      {value ? (
        <>
          <img src={value} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            aria-label="Remover imagem"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-lg bg-ink text-white opacity-0 group-hover:opacity-100"
          >
            <Icon icon="lucide:x" className="text-base" />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 text-center text-xs font-medium text-neutral-500">
          <Icon icon="lucide:image-plus" className="text-2xl" />
          {label}
        </div>
      )}
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => read(e.target.files?.[0])}
      />
    </div>
  );
}
