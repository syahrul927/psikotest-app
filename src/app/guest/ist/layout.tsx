import { AccessIstInvitationProvider } from "@/hooks/use-access-ist-test";
import { type ReactNode } from "react";

const LayoutTraining = ({ children }: { children: ReactNode }) => {
  return <AccessIstInvitationProvider>{children}</AccessIstInvitationProvider>;
};
export default LayoutTraining;
