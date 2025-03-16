import { JSX, PropsWithChildren } from "react";
import { DashboardLayoutContextProvider } from "./providers/withContext";

export type AppType = (props: PropsWithChildren) => JSX.Element;

function App({ children }: PropsWithChildren) {
  return (
    <body>
      <DashboardLayoutContextProvider>
        {children}
      </DashboardLayoutContextProvider>
    </body>
  );
}
export default App;
