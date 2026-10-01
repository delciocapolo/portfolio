import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@src/components/admin/organisms/crud-page";
import { skillsConfig } from "@src/components/admin/crud/configs";

export const Route = createFileRoute("/admin/_panel/skills")({
  component: () => <CrudPage config={skillsConfig} />,
});
