import { notFound } from "next/navigation";
import { db } from "@/db";
import { reports } from "@/db/schema/reports";
import { eq } from "drizzle-orm";
import { ReportHero } from "@/components/ReportHero";
import { ReportDetails, type Signal } from "@/components/ReportDetails";
import { ReportActions } from "@/components/ReportActions";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const rows = await db
    .select()
    .from(reports)
    .where(eq(reports.id, id))
    .limit(1);

  if (rows.length === 0) notFound();

  const report = rows[0];
  const signals = (report.signals ?? []) as Signal[];
  const signalRules = signals.map((s) => s.rule).filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8">
      <ReportHero
        risk={report.risk}
        status={report.status}
        summary={report.summary}
        createdAt={report.createdAt}
      />

      <section className="mt-10">
        <ReportDetails signals={signals} />
      </section>

      <div className="mt-8 flex justify-center">
        <ReportActions reportId={report.id} signalRules={signalRules} />
      </div>
    </div>
  );
}
