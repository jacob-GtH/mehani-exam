import type { Metadata } from "next";
import Link from "next/link";
import { Tajawal } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const font = Tajawal({ subsets: ["arabic"], weight: ["400", "500", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | منصة محاكاة اختبارات الاعتماد المهني السعودي`, template: `%s | ${SITE.name}` },
  description: "اختبارات تجريبية مجانية للاعتماد المهني السعودي بأسئلة اختيار من متعدد وتصحيح فوري ومراجعة للأخطاء.",
  openGraph: { locale: "ar_SA", type: "website", siteName: SITE.name },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${font.className} flex flex-col min-h-screen antialiased text-[color:var(--color-text)]`}>
        {/* Top Announcement Bar */}
        <div className="bg-[color:var(--color-bg-dark)]/[0.1] border-b border-[color:var(--color-line)]/[0.4] px-4 py-1.5 text-xs text-center text-[color:var(--color-text-light)] font-medium tracking-wide">
          <span>🇸🇦 تدرّب مجاناً على نماذج اختبارات الاعتماد المهني السعودي للمهن والعمالة الوافدة</span>
        </div>

        {/* Modern Sticky Navigation */}
        <header className="sticky top-0 z-50 glass-panel border-b border-[color:var(--color-line)]/[0.5] transition-all duration-300">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-[color:var(--color-pri)]/[0.2] group-hover:scale-105 transition-transform duration-200"
                style={{ background: 'linear-gradient(to bottom right, var(--color-pri), var(--color-pri2))' }}
              >
                <span className="text-xl">🎯</span>
              </div>
              <div className="flex flex-col">
                <span 
                  className="text-xl font-black bg-clip-text text-transparent group-hover:brightness-110 transition-all"
                  style={{ backgroundImage: 'linear-gradient(to right, var(--color-hd), var(--color-pri-hover), var(--color-pri))' }}
                >
                  {SITE.name}
                </span>
                <span className="text-[11px] text-[color:var(--color-mute)] -mt-1 font-medium">بوابتك للنجاح المهني</span>
              </div>
            </Link>

            <nav className="flex items-center gap-3">
              <Link 
                href="/" 
                className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-[color:var(--color-text)] hover:text-[color:var(--color-text-light)] hover:bg-[color:var(--color-bg-dark)]/[0.15] transition-colors"
              >
                الرئيسية
              </Link>
              <Link 
                href="/admin" 
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[color:var(--color-mute)] hover:text-[color:var(--color-hd)] hover:bg-[color:var(--color-bg-dark)]/[0.2] border border-[color:var(--color-line)]/[0.4] transition-all"
              >
                لوحة التحكم
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 mx-auto max-w-5xl w-full px-4 sm:px-6 py-8 md:py-12">
          {children}
        </main>

        {/* Modern Polished Footer */}
        <footer className="mt-auto border-t border-[color:var(--color-line)]/[0.2] bg-[color:var(--color-bg-dark)]/[0.2] backdrop-blur-md">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <span className="text-base font-bold text-[color:var(--color-hd)]">{SITE.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[color:var(--color-bg-dark)]/[0.2] text-[color:var(--color-hd)]/[0.8] border border-[color:var(--color-line)]/[0.4]">نسخة تدريبية</span>
                </div>
                <p className="text-xs text-[color:var(--color-mute)] max-w-md">
                  موقع تدريبي مستقل، وليس تابعاً للجهة الرسمية المنظِّمة للاختبار المهني. الأسئلة للتدريب والمراجعة فقط لزيادة فرصك في اجتياز الاختبار الرسمي.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-[color:var(--color-mute)]">
                <span>تحديث مستمر للأسئلة</span>
                <span>•</span>
                <span>تصحيح فوري ومجاني</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

