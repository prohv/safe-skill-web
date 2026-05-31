import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ambient pb-20">
      <TopBar
        title="Explore Skills"
        subtitle="Discover, scan, and deploy safe MCP skills"
      />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">{children}</main>
      <BottomNav />
    </div>
  );
}
