import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { isAdmin } from "@/lib/auth";

export const metadata = { robots: { index: false, follow: false } };

export default async function Login() {
  if (await isAdmin()) redirect("/admin");
  return <LoginForm />;
}
