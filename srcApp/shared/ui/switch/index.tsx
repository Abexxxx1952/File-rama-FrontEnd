import { forwardRef } from "react";
import { Icon } from "../icon";
import styles from "./styles.module.css";

type SwitchProps = {
  text?: string;
  backgroundColorFalse?: string;
  backgroundColorTrue?: string;
  pointColorFalse?: string;
  pointColorTrue?: string;
  labelTextColor?: string;
  labelTextSize?: string;
  outline?: string;
  focusOutline?: string;
  boxShadow?: string;
  focusBoxShadow?: string;
  iconSvg?: string;
  iconSvgWidth?: string;
  iconSvgHeight?: string;
  placeholderColor?: string;
  placeholderPaddingLeft?: string;
  type?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: boolean;
  error?: string;
};

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      text,

      backgroundColorFalse,
      backgroundColorTrue,
      pointColorFalse,
      pointColorTrue,
      labelTextColor,
      labelTextSize,
      outline,
      focusOutline,
      boxShadow,
      focusBoxShadow,
      iconSvg,
      iconSvgWidth,
      iconSvgHeight,
      disabled,
      onChange,
      value,
      error,
    }: SwitchProps,
    ref,
  ) => {
    const switchStyle = {
      "--bg-color-false": backgroundColorFalse,
      "--bg-color-true": backgroundColorTrue,
      "--point-color-false": pointColorFalse,
      "--point-color-true": pointColorTrue,
      "--outline": outline,
      "--focus-outline": focusOutline,
      "--box-shadow": boxShadow,
      "--focus-box-shadow": focusBoxShadow,
    } as React.CSSProperties;

    const iconSvgStyle = {
      "--icon-svg-width": iconSvgWidth,
      "--icon-svg-height": iconSvgHeight,
    } as React.CSSProperties;

    const textStyle = {
      "--label-text-color": labelTextColor,
      "--label-text-size": labelTextSize,
    } as React.CSSProperties;

    return (
      <>
        <label htmlFor={`input-${text}`} className={styles.switch}>
          {text && (
            <span className={styles.text} style={textStyle}>
              {text}
            </span>
          )}
          <input
            id={`input-${text}`}
            onChange={onChange}
            type="checkbox"
            className={styles.input}
            disabled={disabled || false}
            checked={value}
            ref={ref}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `error-${text}` : undefined}
          />
          <span className={styles.slider} style={switchStyle}></span>
          {iconSvg && (
            <Icon
              link={iconSvg}
              className={styles.svgIcon}
              style={iconSvgStyle}
            />
          )}
        </label>
        {error && (
          <span id={`error-${text}`} className={styles.error} role="alert">
            {error}
          </span>
        )}
      </>
    );
  },
);
Switch.displayName = "Switch";

export { Switch };
