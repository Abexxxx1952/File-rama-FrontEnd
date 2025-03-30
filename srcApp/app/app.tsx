import { JSX, PropsWithChildren } from "react";
import { ContextProvider } from "./providers/withContext";

export type AppType = (props: PropsWithChildren) => JSX.Element;

function App({ children }: PropsWithChildren) {
  return (
    <body>
      <ContextProvider>{children}</ContextProvider>
    </body>
  );
}
export default App;
