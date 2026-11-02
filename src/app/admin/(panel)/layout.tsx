import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";

export const metadata = { robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="space-y-8">
      {/* Admin Sub Navigation */}
      <nav className="rounded-2xl glass-panel p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 border border-emerald-800/40">
        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold">
          <Link
            href="/admin"
            className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 hover:text-white transition-colors"
          >
            📋 الاختبارات
          </Link>
          <Link
            href="/admin/stats"
            className="px-3 py-1.5 rounded-xl hover:bg-emerald-950/50 text-mute hover:text-emerald-300 transition-colors"
          >
            📊 الإحصاءات
          </Link>
          <Link
            href="/admin/import"
            className="px-3 py-1.5 rounded-xl hover:bg-emerald-950/50 text-mute hover:text-emerald-300 transition-colors"
          >
            📥 استيراد الأسئلة
          </Link>
        </div>

        <div className="flex items-center gap-3 mr-auto sm:mr-0">
          <Link
            href="/"
            className="text-xs text-mute hover:text-white transition-colors font-semibold"
          >
            الرئيسية ↗
          </Link>
          <form action={logout}>
            <button className="rounded-xl border border-rose-900/60 bg-rose-950/30 text-rose-300 hover:bg-rose-900/50 px-3 py-1 text-xs font-bold transition-colors">
              خروج
            </button>
          </form>
        </div>
      </nav>

      {/* Panel Children */}
      <div>{children}</div>
    </div>
  );
}

