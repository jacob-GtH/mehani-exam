// محلل نص الأسئلة: يُستخدم في المعاينة (المتصفح) وفي الاستيراد (الخادم) بنفس القواعد
export type PQ = { text: string; options: string[]; correct: number; explanation?: string };
export type Group = { exam: string | null; slug?: string; questions: PQ[]; errors: string[] };

const LET: Record<string, number> = { "أ": 0, "ا": 0, "ب": 1, "ج": 2, "د": 3, "ه": 4, "هـ": 4, "و": 5, a: 0, b: 1, c: 2, d: 3, e: 4, f: 5 };
const optRe = /^\(?(أ|ا|ب|ج|د|ه|و|[A-Fa-f])\s*[\)\.\-:：]\s*(\S.*)$/;
const ansRe = /^(?:الإجابة الصحيحة|الإجابة|الاجابة|الجواب|answer|ans)\s*[:：\-]?\s*(.+)$/i;
const expRe = /^(?:الشرح|التوضيح|التفسير|explanation|note)\s*[:：\-]?\s*(.+)$/i;
const hdrRe = /^#{2,}\s*(.+)$/;
const clean = (s: string) => s.replace(/^(?:السؤال|س)?\s*\d*\s*[\.\)\-:：]\s*/, "").trim() || s.trim();

function resolveAns(s: string, opts: string[]): number {
  const t = s.trim().replace(/^[\(\[]|[\)\]\.]$/g, "").trim();
  if (/^[1-6]$/.test(t)) return +t - 1;
  const l = LET[t.toLowerCase()];
  if (l !== undefined && t.length <= 2) return l;
  return opts.findIndex((o) => o === t || o === s.trim());
}

type Cur = { text: string[]; opts: string[]; ans: string | null; exp: string };
const blank = (): Cur => ({ text: [], opts: [], ans: null, exp: "" });

export function parseQuestions(raw: string): Group[] {
  const groups: Group[] = [];
  let exam: string | null = null, slug: string | undefined, cur = blank(), n = 0;
  const G = () => {
    let g = groups.find((x) => x.exam === exam);
    if (!g) { g = { exam, slug, questions: [], errors: [] }; groups.push(g); }
    return g;
  };
  const flush = () => {
    if (!cur.text.length && !cur.opts.length && cur.ans === null) { cur = blank(); return; }
    n++;
    const g = G(), text = clean(cur.text.join(" ")), opts = cur.opts.map((o) => o.trim());
    let err = "";
    if (!text) err = "لا يوجد نص للسؤال";
    else if (opts.length < 2) err = "يلزم خياران على الأقل";
    else if (cur.ans === null) err = "لم تُحدَّد الإجابة";
    const c = err ? -1 : resolveAns(cur.ans!, opts);
    if (!err && (c < 0 || c >= opts.length)) err = "الإجابة غير مطابقة للخيارات";
    if (err) g.errors.push(`سؤال ${n}${text ? ` («${text.slice(0, 30)}»)` : ""}: ${err}`);
    else g.questions.push({ text, options: opts, correct: c, ...(cur.exp ? { explanation: cur.exp } : {}) });
    cur = blank();
  };

  for (const line0 of raw.replace(/\r/g, "").split("\n")) {
    const line = line0.trim();
    if (!line) { flush(); continue; }
    const h = line.match(hdrRe);
    if (h) { flush(); const p = h[1].split("|"); exam = p[0].trim(); slug = p[1]?.trim() || undefined; G(); continue; }
    if (line0.split("\t").length >= 6) { // صف منسوخ من Excel: السؤال | 4 خيارات | الإجابة | الشرح
      flush();
      const c = line0.split("\t").map((x) => x.trim());
      if (c[0] === "السؤال" || c[0].toLowerCase() === "question") continue;
      const o = c.slice(1, 5); while (o.length && !o[o.length - 1]) o.pop();
      cur.text = [c[0]]; cur.opts = o; cur.ans = c[5]; cur.exp = c[6] || "";
      flush(); continue;
    }
    const a = line.match(ansRe); if (a) { cur.ans = a[1]; continue; }
    const e = line.match(expRe); if (e) { cur.exp = e[1]; continue; }
    const o = line.match(optRe); if (o && cur.text.length) { cur.opts.push(o[2]); continue; }
    if (cur.opts.length || cur.ans !== null) flush();
    cur.text.push(line);
  }
  flush();
  return groups.filter((g) => g.questions.length || g.errors.length || g.exam);
}
