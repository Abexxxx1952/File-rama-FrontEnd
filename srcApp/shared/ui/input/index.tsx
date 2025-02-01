import { forwardRef } from "react";
import styles from "./styles.module.css";

type InputProps = {
  text?: string;
  placeholder?: string;
  backgroundColor?: string;
  textColor?: string;
  border?: string;
  outline?: string;
  focusBackgroundColor?: string;
  focusOutline?: string;
  focusTextColor?: string;
  boxShadow?: string;
  placeholderColor?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  pattern?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      text,
      placeholder,
      backgroundColor,
      textColor,
      border,
      outline,
      focusBackgroundColor,
      focusOutline,
      focusTextColor,
      boxShadow,
      placeholderColor,
      type,
      required,
      disabled,
      pattern,
      onChange,
      value,
      error,
    }: InputProps,
    ref,
  ) => {
    const inputStyle = {
      "--bg-color": backgroundColor,
      "--text-color": textColor,
      "--border": border,
      "--outline": outline,
      "--focus-bg-color": focusBackgroundColor,
      "--focus-outline": focusOutline,
      "--focus-text-color": focusTextColor,
      "--box-shadow": boxShadow,
      "--placeholder-color": placeholderColor,
    } as React.CSSProperties;
    return (
      <>
        <label htmlFor={`input-${text}`} className={styles.text}>
          {text}
        </label>
        <input
          id={`input-${text}`}
          className={styles.input}
          style={inputStyle}
          onChange={onChange}
          type={type || "text"}
          placeholder={placeholder}
          required={required || false}
          disabled={disabled || false}
          pattern={pattern || undefined}
          value={value}
          ref={ref}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `error-${text}` : undefined}
        />
        {error && (
          <span id={`error-${text}`} className={styles.error} role="alert">
            {error}
          </span>
        )}
      </>
    );
  },
);
Input.displayName = "Input";

export { Input };
