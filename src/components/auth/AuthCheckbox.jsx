import { useId } from 'react';

const AuthCheckbox = ({
  children,
  checked,
  onChange,
  error,
  description,
  name,
}) => {
  const generatedId = useId();
  const checkboxId = name || generatedId;
  const errorId = error ? `${checkboxId}-error` : undefined;
  const descriptionId = description ? `${checkboxId}-description` : undefined;

  return (
    <div>
      <label
        htmlFor={checkboxId}
        className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-[#52716B]"
      >
        <input
          id={checkboxId}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={Boolean(error)}
          aria-describedby={[errorId, descriptionId].filter(Boolean).join(' ') || undefined}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#14746F]"
        />
        <span>{children}</span>
      </label>

      {error && (
        <p id={errorId} role="alert" className="ml-8 mt-1 text-[11px] font-semibold text-rose-600">
          {error}
        </p>
      )}

      {description && (
        <p id={descriptionId} className="ml-8 mt-1 text-[10px] font-semibold text-[#6A8881]">
          {description}
        </p>
      )}
    </div>
  );
};

export default AuthCheckbox;
