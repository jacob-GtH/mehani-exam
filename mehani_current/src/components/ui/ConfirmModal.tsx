"use client";

type Props = {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "ok";
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  tone = "danger",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;
  const danger = tone === "danger";
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />

      {/* Dialog Card */}
      <div className="relative z-10 w-full max-w-sm rounded-3xl glass-panel p-6 shadow-2xl animate-pop">
        <div className="flex items-start gap-3 mb-4">
          <div
            className={`w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center text-xl ${
              danger
                ? "bg-[color:var(--color-bad)]/15 text-[color:var(--color-bad)]"
                : "bg-[color:var(--color-ok)]/15 text-[color:var(--color-ok)]"
            }`}
          >
            {danger ? "⚠️" : "✅"}
          </div>
          <div className="pt-1">
            <h3 className="text-lg font-bold text-[color:var(--color-text)] leading-snug">{title}</h3>
          </div>
        </div>

        {message && (
          <p className="text-sm text-[color:var(--color-mute)] mb-6 leading-relaxed">{message}</p>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-[color:var(--color-line)] py-2.5 text-sm font-bold text-[color:var(--color-text)] hover:bg-[color:var(--color-card2)]/50 transition-colors active:opacity-80"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            autoFocus
            onClick={onConfirm}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold text-white transition-colors active:opacity-85 ${
              danger
                ? "bg-[color:var(--color-bad)] hover:bg-[color:var(--color-bad)]/85"
                : "bg-[color:var(--color-ok)] hover:bg-[color:var(--color-ok)]/85"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}