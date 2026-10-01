import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@src/components/admin/organisms/crud-page";
import { categoriesConfig } from "@src/components/admin/crud/configs";

export const Route = createFileRoute("/admin/_panel/categorias")({
  component: () => <CrudPage config={categoriesConfig} />,
});
