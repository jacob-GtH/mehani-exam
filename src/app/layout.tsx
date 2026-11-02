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
      <body className={`${font.className} flex flex-col min-h-screen antialiased`}>
        {/* Top Announcement Bar */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-teal-950/80 border-b border-emerald-800/40 px-4 py-1.5 text-xs text-center text-emerald-200/90 font-medium tracking-wide">
          <span>🇸🇦 تدرّب مجاناً على اختبارات الاعتماد المهني السعودي المعتمدة للمهن والعمالة الوافدة</span>
        </div>

        {/* Modern Sticky Navigation */}
        <header className="sticky top-0 z-50 glass-panel border-b border-emerald-900/50 transition-all duration-300">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                <span className="text-xl">🎯</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black bg-gradient-to-r from-teal-200 via-emerald-300 to-teal-400 bg-clip-text text-transparent group-hover:brightness-110 transition-all">
                  {SITE.name}
                </span>
                <span className="text-[11px] text-mute -mt-1 font-medium">بوابتك للنجاح المهني</span>
              </div>
            </Link>

            <nav className="flex items-center gap-3">
              <Link 
                href="/" 
                className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-emerald-100 hover:text-white hover:bg-emerald-900/40 transition-colors"
              >
                الرئيسية
              </Link>
              <Link 
                href="/admin" 
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-mute hover:text-teal-300 hover:bg-emerald-950/50 border border-emerald-900/40 transition-all"
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
        <footer className="mt-auto border-t border-emerald-950 bg-black/40 backdrop-blur-md">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <span className="text-base font-bold text-emerald-300">{SITE.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40">نسخة تدريبية</span>
                </div>
                <p className="text-xs text-mute max-w-md">
                  موقع تدريبي مستقل، وليس تابعاً للجهة الرسمية المنظِّمة للاختبار المهني. الأسئلة للتدريب والمراجعة فقط لزيادة فرصك في اجتياز الاختبار الرسمي.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-mute">
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

