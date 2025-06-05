import { AccessInvitationProvider } from "@/hooks/use-access-invitation-kraepelin";
import { type ReactNode } from "react";

const LayoutTraining = ({ children }: { children: ReactNode }) => {
  return <AccessInvitationProvider>{children}</AccessInvitationProvider>;
};
export default LayoutTraining;
