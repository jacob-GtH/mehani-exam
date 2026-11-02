"use client";
import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export default function LoginForm() {
  const [err, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mx-auto mt-10 max-w-sm space-y-3 rounded-2xl border-2 border-line bg-card p-6">
      <h1 className="text-xl font-bold text-hd">دخول لوحة التحكم</h1>
      <input name="password" type="password" required autoFocus placeholder="كلمة المرور" className="w-full rounded-lg border border-line bg-card2 px-3 py-2" />
      {err && <p className="text-bad">{err}</p>}
      <button disabled={pending} className="w-full rounded-xl bg-pri py-2 font-bold disabled:opacity-50">{pending ? "..." : "دخول"}</button>
    </form>
  );
}
