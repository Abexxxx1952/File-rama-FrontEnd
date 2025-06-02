import { useEffect } from "react";

export function useImperativeDisableScroll(
  element: HTMLElement | null,
  disabled: boolean,
) {
  useEffect(() => {
    if (!element) {
      return;
    }

    element.style.overflowY = disabled ? "hidden" : "auto";

    return () => {
      element.style.overflowY = "auto";
    };
  }, [disabled]);
}
