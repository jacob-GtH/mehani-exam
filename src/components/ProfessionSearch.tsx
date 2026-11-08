"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Exam } from "@/lib/data";

export default function ProfessionSearch({ exams }: { exams: Exam[] }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ar");
    if (!normalized) return [];
    return exams.filter((exam: Exam) =>
      `${exam.title} ${exam.description ?? ""}`.toLocaleLowerCase("ar").includes(normalized),
    ).slice(0, 6);
  }, [exams, query]);

  const showResults = focused && query.trim().length > 0;

  return (
    <div className="mx-auto mt-8 w-full max-w-2xl text-right">
      <label htmlFor="profession-search" className="mb-2 block text-sm font-bold text-white">
        ابحث عن مهنتك للوصول إلى اختبارها
      </label>
      <div className="relative">
        <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xl text-[color:var(--color-mute)]">⌕</span>
        <input
          id="profession-search"
          type="search"
          autoComplete="off"
          value={query}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 150)}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setFocused(false);
            if (event.key === "Enter" && filtered.length === 1) window.location.href = `/exam/${filtered[0].slug}`;
          }}
          placeholder="اكتب اسم المهنة... مثال: الهندسة أو المحاسبة"
          className="min-h-14 w-full rounded-2xl border border-white/20 bg-white py-3 pr-12 pl-4 text-sm text-[color:var(--color-text)] outline-none transition placeholder:text-[color:var(--color-mute)] focus:border-[#B9D6A9] focus:ring-4 focus:ring-white/15"
          aria-expanded={showResults}
          aria-controls="profession-search-results"
        />
        {showResults && (
          <div id="profession-search-results" className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-white text-[color:var(--color-text)] shadow-[0_20px_50px_rgba(0,0,0,.2)]">
            {filtered.length > 0 ? (
              <ul className="divide-y divide-[color:var(--color-line)]">
                {filtered.map((exam: Exam) => (
                  <li key={exam._id}>
                    <Link href={`/exam/${exam.slug}`} onMouseDown={(event) => event.preventDefault()} className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-[#F2F6F1] focus:bg-[#F2F6F1] focus:outline-none">
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-extrabold text-[color:var(--color-hd)]">{exam.title}</span>
                        <span className="mt-1 block text-xs text-[color:var(--color-text-light)]">{exam.count} سؤال تدريبي</span>
                      </span>
                      <span className="shrink-0 text-xs font-extrabold text-[color:var(--color-pri)]">اختيار المهنة ←</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-5 py-5 text-center">
                <p className="text-sm font-bold">لا توجد مهنة مطابقة</p>
                <p className="mt-1 text-xs text-[color:var(--color-mute)]">جرّب كتابة الاسم بطريقة أخرى.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-[#D1DED7]">اكتب اسم المهنة، ثم اخترها من النتائج للانتقال إلى اختبارها مباشرة.</p>
    </div>
  );
}
