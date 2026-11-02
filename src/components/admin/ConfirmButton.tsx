"use client";
export default function ConfirmButton({ msg, children, className }: { msg: string; children: React.ReactNode; className?: string }) {
  return <button type="submit" className={className} onClick={(e) => { if (!confirm(msg)) e.preventDefault(); }}>{children}</button>;
}
