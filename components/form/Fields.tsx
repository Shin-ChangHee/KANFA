"use client";

// 신청서 입력 요소. 모든 입력에 보이는 라벨을 두고, 오류는 색과 글로 함께 알린다.
import type { HTMLInputTypeAttribute, ReactNode } from "react";
import { get, useFormContext } from "react-hook-form";

export function fieldId(name: string) {
  return `f-${name.replace(/\./g, "-")}`;
}

export function useFieldError(name: string): string | undefined {
  const {
    formState: { errors },
  } = useFormContext();
  return get(errors, name)?.message as string | undefined;
}

function describedBy(...ids: (string | false | undefined)[]) {
  const v = ids.filter(Boolean).join(" ");
  return v || undefined;
}

export function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-2 font-semibold text-danger">
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" className="mt-0.5 shrink-0">
        <circle cx="10" cy="10" r="9" fill="currentColor" />
        <path d="M10 5.5v5.5M10 13.6v.9" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span>
        <span className="sr-only">오류: </span>
        {message}
      </span>
    </p>
  );
}

const inputBase = "mt-2 block min-h-12 w-full rounded-lg border-2 bg-white px-4 text-base text-ink placeholder:text-slate/70";
export const inputClass = (error?: string) => `${inputBase} ${error ? "border-danger" : "border-mist focus:border-track"}`;

export function TextField({
  name,
  label,
  hint,
  optional,
  type = "text",
  inputMode,
  autoComplete,
  maxLength,
  placeholder,
}: {
  name: string;
  label: string;
  hint?: string;
  optional?: boolean;
  type?: HTMLInputTypeAttribute;
  inputMode?: "text" | "numeric" | "tel" | "email";
  autoComplete?: string;
  maxLength?: number;
  placeholder?: string;
}) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  const id = fieldId(name);
  return (
    <div>
      <label htmlFor={id} className="block font-bold">
        {label}
        {optional ? <span className="ml-1 font-normal text-slate">(선택)</span> : <span className="sr-only"> (필수)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-0.5 text-sm text-slate">
          {hint}
        </p>
      )}
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hint && `${id}-hint`, error && `${id}-err`)}
        className={inputClass(error)}
        {...register(name)}
      />
      <ErrorText id={`${id}-err`} message={error} />
    </div>
  );
}

export function SelectField({ name, label, options, placeholder = "골라 주세요" }: { name: string; label: string; options: { value: string; label: string }[]; placeholder?: string }) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  const id = fieldId(name);
  return (
    <div>
      <label htmlFor={id} className="block font-bold">
        {label}
      </label>
      <select id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy(error && `${id}-err`)} className={inputClass(error)} {...register(name)}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ErrorText id={`${id}-err`} message={error} />
    </div>
  );
}

/** 큰 선택지 카드 모양의 라디오 묶음 */
export function RadioCards({
  name,
  legend,
  options,
  columns = 2,
  hint,
  onPick,
}: {
  name: string;
  legend: ReactNode;
  options: { value: string; label: string; description?: ReactNode }[];
  columns?: 2 | 3;
  hint?: ReactNode;
  onPick?: (value: string) => void;
}) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  const id = fieldId(name);
  const reg = register(name, { onChange: (e) => onPick?.(e.target.value) });
  return (
    <fieldset aria-describedby={describedBy(hint ? `${id}-hint` : undefined, error && `${id}-err`)}>
      <legend className="font-bold">{legend}</legend>
      {hint && (
        <p id={`${id}-hint`} className="mt-0.5 text-sm text-slate">
          {hint}
        </p>
      )}
      <div className={`mt-2 grid gap-3 ${columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {options.map((o, i) => (
          <label
            key={o.value}
            className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border-2 bg-white p-4 has-[:checked]:border-track has-[:checked]:bg-track-soft has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-track ${
              error ? "border-danger" : "border-mist"
            }`}
          >
            <input type="radio" value={o.value} id={i === 0 ? id : undefined} className="mt-1 h-5 w-5 shrink-0 accent-track" {...reg} />
            <span>
              <span className="block font-bold">{o.label}</span>
              {o.description && <span className="mt-0.5 block text-slate">{o.description}</span>}
            </span>
          </label>
        ))}
      </div>
      <ErrorText id={`${id}-err`} message={error} />
    </fieldset>
  );
}

export function CheckboxField({ name, label, description }: { name: string; label: ReactNode; description?: ReactNode }) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  const id = fieldId(name);
  return (
    <div>
      <label htmlFor={id} className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border-2 bg-white p-4 ${error ? "border-danger" : "border-mist"}`}>
        <input
          id={id}
          type="checkbox"
          className="mt-1 h-5 w-5 shrink-0 accent-track"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(error && `${id}-err`)}
          {...register(name)}
        />
        <span>
          <span className="block font-bold">{label}</span>
          {description && <span className="mt-0.5 block text-slate">{description}</span>}
        </span>
      </label>
      <ErrorText id={`${id}-err`} message={error} />
    </div>
  );
}
