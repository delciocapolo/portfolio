import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import {
  schemaContactForm,
  type IContactForm,
} from "@src/shared/schemas/contact-form";
import { contactFormService } from "@src/services/contact-form/index.service";
import { cn } from "@src/lib/utils";
import { useMutation } from "@tanstack/react-query";

const { fieldContext, formContext } = createFormHookContexts();
const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
});

const defaultFieldStyle =
  "w-full border border-neutral-300 rounded px-4.5 py-4 text-sm outline-none focus:border-black";

export function ContactForm() {
  const { mutate: createForm, isSuccess: isFormSubmited } = useMutation({
    mutationFn: contactFormService.createForm,
  });

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      website: "",
      message: "",
    } satisfies IContactForm,
    validators: { onSubmit: schemaContactForm },
    onSubmit: ({ value }) => createForm(value),
  });

  return (
    <form
      className="flex flex-col gap-3.5"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field name="name">
        {(field) => (
          <div className="space-y-2">
            <input
              id={field.name}
              name="name"
              inputMode="text"
              type="text"
              aria-label="Nome do solicitante"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Ex: Domingos Cassoma"
              className={defaultFieldStyle}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-body-14 text-(--error-500)">
                {field.state.meta.errors[0]?.message}
              </p>
            )}
          </div>
        )}
      </form.Field>

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
              className={defaultFieldStyle}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-body-14 text-(--error-500)">
                {field.state.meta.errors[0]?.message}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="website">
        {(field) => (
          <div className="space-y-2">
            <input
              id={field.name}
              name="website"
              inputMode="url"
              type="url"
              aria-label="Website do solicitante"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Ex: https://www.cassoma.com (se existir)"
              className={defaultFieldStyle}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-body-14 text-(--error-500)">
                {field.state.meta.errors[0]?.message}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="message">
        {(field) => (
          <div className="space-y-2">
            <textarea
              id={field.name}
              name="message"
              inputMode="text"
              aria-label="Mensagem"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              rows={6}
              placeholder="Como posso ajudar?"
              className={cn(defaultFieldStyle, "resize-y")}
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
        className="bg-ink mt-1.5 self-start rounded px-8 py-4 text-sm font-semibold text-white hover:opacity-85"
      >
        Get In Touch
      </button>
      {isFormSubmited && (
        <p className="border-ink m-0 rounded border-2 px-4.5 py-3.5 text-sm font-semibold">
          Mensagem registada. Respondo em breve.
        </p>
      )}
    </form>
  );
}
