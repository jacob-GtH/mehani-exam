import type { Metadata } from "next";
import Link from "next/link";
import { Tajawal } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const font = Tajawal({ subsets: ["arabic"], weight: ["400", "500", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | منصة محاكاة اختبارات الاعتماد المهني السعودي`, template: `%s | ${SITE.name}` },
  description: "تدرّب على نماذج اختبارات الاعتماد المهني السعودي، واختبر جاهزيتك من خلال أسئلة اختيار من متعدد وشرح للإجابات.",
  openGraph: { locale: "ar_SA", type: "website", siteName: SITE.name },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${font.className} flex min-h-screen flex-col antialiased`}>
        <header className="sticky top-0 z-50 border-b border-[color:var(--color-line)]/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="group flex items-center gap-3" aria-label={`${SITE.name} - الرئيسية`}>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--color-bg-dark)] text-lg font-black text-white shadow-lg shadow-emerald-950/10 transition-transform group-hover:-rotate-3">م</span>
              <span className="flex flex-col leading-tight">
                <span className="text-xl font-extrabold tracking-tight text-[color:var(--color-hd)]">{SITE.name}</span>
                <span className="mt-1 text-[11px] font-medium text-[color:var(--color-mute)]">استعد لاختبارك بثقة</span>
              </span>
            </Link>
            <nav aria-label="التنقل الرئيسي" className="flex items-center gap-2">
              <Link href="/" className="rounded-xl px-4 py-2 text-sm font-bold text-[color:var(--color-pri)] transition hover:bg-[color:var(--color-card2)]">الرئيسية</Link>
              <Link href="/#exams" className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-[color:var(--color-text-light)] transition hover:bg-[color:var(--color-card2)] hover:text-[color:var(--color-hd)] sm:inline-flex">الاختبارات</Link>
            </nav>
          </div>
        </header>

        <div className="border-b border-emerald-900/10 bg-[#EAF2ED] px-4 py-2 text-center text-xs font-medium text-[#426357]">
          منصة تدريبية مستقلة لاختبارات الاعتماد المهني السعودي
        </div>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 md:py-12">{children}</main>

        <footer className="mt-12 border-t border-[color:var(--color-line)] bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-base font-extrabold text-[color:var(--color-hd)]">{SITE.name}</span>
                <span className="rounded-full bg-[color:var(--color-card2)] px-2.5 py-1 text-[10px] font-bold text-[color:var(--color-text-light)]">منصة تدريبية</span>
              </div>
              <p className="text-xs leading-6 text-[color:var(--color-mute)]">موقع تدريبي مستقل، وليس تابعاً للجهة الرسمية المنظِّمة للاختبار المهني. الأسئلة للتدريب والمراجعة فقط.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[color:var(--color-mute)]">
              <span>تدريب مجاني</span><span aria-hidden="true">•</span><span>شروحات للإجابات</span><span aria-hidden="true">•</span><span>محاولات متعددة</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
