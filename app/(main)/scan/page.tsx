"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadZone } from "@/components/UploadZone";
import { ScanProgress } from "@/components/ScanProgress";

export default function ScanPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleUpload = async (file: File) => {
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError("File exceeds 10MB limit");
      return;
    }

    setError("");
    setPhase(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setPhase(1);
      const res = await fetch("/api/scan-upload", {
        method: "POST",
        body: formData,
      });

      setPhase(2);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Scan failed");
        setPhase(null);
        return;
      }

      const { id } = await res.json();
      setPhase(3);
      setTimeout(() => router.push(`/report/${id}`), 500);
    } catch {
      setError("Network error — please try again");
      setPhase(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-clash text-2xl text-brand-gradient mb-6">
        Quick Scan
      </h1>

      {phase === null ? (
        <UploadZone onFile={handleUpload} error={error} />
      ) : (
        <ScanProgress phase={phase} />
      )}
    </div>
  );
}
