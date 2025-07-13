import { OptionsProps } from "../ui";

export function areOptionsEqual(
  prevProps: OptionsProps,
  nextProps: OptionsProps,
) {
  const prevPath = prevProps.path.toString();
  const nextPath = nextProps.path.toString();

  return prevPath === nextPath;
}
