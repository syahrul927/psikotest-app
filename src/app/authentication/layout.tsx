import type { ReactNode } from "react";

const LayoutAuth = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      {children}
    </div>
  );
};
export default LayoutAuth;
