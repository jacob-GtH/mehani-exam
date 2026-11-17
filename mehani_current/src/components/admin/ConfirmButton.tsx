"use client";
import { useRef, useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function ConfirmButton({ msg, children, className }: { msg: string; children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={(e) => {
          formRef.current = (e.currentTarget as HTMLButtonElement).closest("form");
          setOpen(true);
        }}
      >
        {children}
      </button>

      <ConfirmModal
        open={open}
        title="تأكيد الإجراء"
        message={msg}
        confirmLabel="تأكيد الحذف"
        cancelLabel="إلغاء"
        tone="danger"
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          if (formRef.current) formRef.current.requestSubmit();
        }}
      />
    </>
  );
}
