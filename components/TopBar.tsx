import { ShieldCheck, LayoutGrid, List } from "lucide-react";

export function TopBar({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-brand-teal" />
        <span className="font-clash text-lg text-text-primary">SafeSkill</span>
      </div>

      <div className="text-center">
        <h1 className="font-clash text-2xl text-text-primary">{title}</h1>
        {subtitle && (
          <p className="font-satoshi text-sm text-text-secondary">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-xl bg-overlay hover:bg-elevated transition-colors">
          <LayoutGrid className="w-5 h-5 text-text-secondary" />
        </button>
        <button className="p-2 rounded-xl bg-overlay hover:bg-elevated transition-colors">
          <List className="w-5 h-5 text-text-secondary" />
        </button>
      </div>
    </header>
  );
}
