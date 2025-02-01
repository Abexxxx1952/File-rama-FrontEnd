import { JSX, PropsWithChildren } from "react";

export type AppType = (props: PropsWithChildren) => JSX.Element;

function App({ children }: PropsWithChildren) {
  return <body>{children}</body>;
}
export default App;
