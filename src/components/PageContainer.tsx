import { ReactNode } from "react";
import { NavigationViewer } from "./NavigationViewer";

export const PageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen my-4 sm:mt-0 flex-col sm:ml-16">
      {children}
    </div>
  );
};
