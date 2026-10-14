import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="wrap grid min-h-[60vh] place-items-center py-24 text-center">
      <div className="flex flex-col items-center gap-5">
        <span className="eyebrow">Error 404</span>
        <h1 className="font-display text-[clamp(2.4rem,7vw,5rem)] font-bold tracking-[-0.045em]">
          This page <span className="grad-text">doesn&apos;t exist.</span>
        </h1>
        <p className="max-w-[42ch] text-fg-2">The link may be old or mistyped. Everything lives on the home page.</p>
        <Link href="/" className="btn btn-primary">
          <ArrowLeft className="size-[18px]" aria-hidden />
          Back to the home page
        </Link>
      </div>
    </section>
  );
}
