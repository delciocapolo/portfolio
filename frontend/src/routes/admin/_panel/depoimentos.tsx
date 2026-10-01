import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@src/components/admin/organisms/crud-page";
import { testimonialsConfig } from "@src/components/admin/crud/configs";

export const Route = createFileRoute("/admin/_panel/depoimentos")({
  component: () => <CrudPage config={testimonialsConfig} />,
});
