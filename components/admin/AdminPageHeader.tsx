interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminPageHeader({ title, description, actions }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-cyan">
          Backoffice SaaS
        </p>
        <h1 className="font-display text-2xl font-bold text-brand-soft sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-brand-mist">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
