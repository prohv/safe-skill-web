import { db } from "@/db";
import { reports } from "@/db/schema/reports";
import { desc } from "drizzle-orm";
import { FileText } from "lucide-react";
import { ReportList } from "@/components/ReportList";

export default async function ReportsPage() {
  const rows = await db
    .select({ id: reports.id })
    .from(reports)
    .limit(1)
    .orderBy(desc(reports.createdAt));

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-6 pb-20">
      <h1 className="font-clash text-2xl text-text-primary mb-6">Reports</h1>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FileText className="w-12 h-12 text-text-muted mb-4" />
          <p className="font-clash text-xl text-text-secondary mb-2">
            No reports yet
          </p>
          <p className="font-satoshi text-sm text-text-muted">
            Run a scan from the CLI to see your first report
          </p>
        </div>
      ) : (
        <ReportList />
      )}
    </div>
  );
}
