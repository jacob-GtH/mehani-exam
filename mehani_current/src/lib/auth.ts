import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const NAME = "admin_session";
const sign = () => createHmac("sha256", process.env.ADMIN_SECRET || "").update("admin").digest("hex");
const same = (a: string, b: string) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };

export const passwordOk = (p: string) => !!process.env.ADMIN_PASSWORD && same(p, process.env.ADMIN_PASSWORD);

export async function setSession() {
  (await cookies()).set(NAME, sign(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/admin", maxAge: 60 * 60 * 24 * 7 });
}
export async function clearSession() { (await cookies()).delete({ name: NAME, path: "/admin" }); }
export async function isAdmin() {
  const v = (await cookies()).get(NAME)?.value;
  return !!v && !!process.env.ADMIN_SECRET && same(v, sign());
}
export async function requireAdmin() { if (!(await isAdmin())) redirect("/admin/login"); }
