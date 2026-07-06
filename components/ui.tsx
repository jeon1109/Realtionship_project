import type { ButtonHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-meadow px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#526d59] focus:outline-none focus:ring-2 focus:ring-meadow focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-11 w-full rounded-md border border-[#d9d0bf] bg-white/85 px-3 py-2 text-sm outline-none transition placeholder:text-[#8d8577] focus:border-meadow focus:ring-2 focus:ring-meadow/20",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-md border border-[#d9d0bf] bg-white/85 px-3 py-2 text-sm leading-6 outline-none transition placeholder:text-[#8d8577] focus:border-meadow focus:ring-2 focus:ring-meadow/20",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-semibold text-ink", className)} {...props} />;
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {hint ? <p className="text-xs leading-5 text-[#70695e]">{hint}</p> : null}
    </div>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold tracking-normal text-ink sm:text-2xl">{title}</h2>
      <p className="max-w-3xl text-sm leading-6 text-[#5f5a50]">{subtitle}</p>
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-[#cfc5b4] bg-white/45 p-5 text-sm leading-6 text-[#6b6458]">
      {children}
    </div>
  );
}
