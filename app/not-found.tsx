import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center text-center px-4">
      <ShieldAlert className="w-16 h-16 text-text-muted mb-6" />
      <p className="font-clash text-6xl text-text-muted mb-2">404</p>
      <p className="font-clash text-xl text-text-secondary mb-1">
        Page not found
      </p>
      <p className="font-satoshi text-sm text-text-muted mb-8">
        This report or page doesn&apos;t exist
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-xl bg-brand-teal/10 text-brand-teal font-satoshi text-sm hover:bg-brand-teal/20 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
