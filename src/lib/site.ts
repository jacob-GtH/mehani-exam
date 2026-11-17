
const DEFAULT_SITE_URL =
  process.env.NODE_ENV === "production"
    ? "https://mehani-exam.vercel.app"
    : "http://localhost:3000";

export const SITE = {
  name: "اختبار الاعتماد المهني",
  url: (
    process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
  ).replace(/\/+$/, ""),
  locale: "ar_YE",
  country: "YE",
};
