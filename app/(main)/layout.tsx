import { PillNav } from "@/components/PillNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ambient">
      <PillNav />
      <main className="flex-1 pt-20">{children}</main>
    </div>
  );
}
