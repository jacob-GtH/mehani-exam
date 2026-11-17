import { createClient } from "@sanity/client";

const base = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
};
export const reader = createClient({ ...base, useCdn: true });
// للكتابة فقط من الخادم (API routes / server actions)
export const writer = createClient({ ...base, useCdn: false, token: process.env.SANITY_WRITE_TOKEN });
