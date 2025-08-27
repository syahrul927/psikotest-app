import { AccessTestInvitationProvider } from "@/hooks/use-access-test";
import type { ReactNode } from "react";

const LayoutPapiKostickTest = ({ children }: { children: ReactNode }) => {
  return (
    <AccessTestInvitationProvider>{children}</AccessTestInvitationProvider>
  );
};

export default LayoutPapiKostickTest;
