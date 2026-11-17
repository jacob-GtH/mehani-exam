// تشغيل: npm run seed  (ينشئ اختبارًا تجريبيًا واحدًا للتأكد من أن كل شيء يعمل)
import { config } from "dotenv";
config({ path: ".env.local" });
import { writer } from "../src/lib/sanity";

(async () => {
  const { writer } = await import("../src/lib/sanity");
  await writer.createOrReplace({
    _id: "exam-loader", _type: "exam", title: "عامل تحميل وتنزيل", slug: { _type: "slug", current: "loader" },
    description: "اختبار الاعتماد المهني لعامل تحميل وتنزيل", passMark: 70, published: true,
    questions: [
      { _key: "q1", text: "قبل رفع صندوق ثقيل يدويًا، أفضل خطوة هي:", options: ["تقدير وزنه وطلب المساعدة إن لزم", "رفعه بسرعة", "الانحناء بالظهر فقط", "رفعه بيد واحدة"], correct: 0, explanation: "تقدير الحمل مسبقًا يمنع إصابات الظهر." },
      { _key: "q2", text: "أي حذاء مناسب لعمل التحميل؟", options: ["صندل", "حذاء السلامة بمقدمة مقواة", "حذاء منزلي"], correct: 1 },
      { _key: "q3", text: "عند وجود بضاعة متساقطة في الممر:", options: ["تتركها", "تُزيلها أو تُبلغ المسؤول فورًا", "تقفز فوقها"], correct: 1 },
    ],
  });
  console.log("تم إنشاء الاختبار التجريبي");
})();
