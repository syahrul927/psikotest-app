import { type ReactNode } from "react";
import { AccessInvitationProvider } from "./hooks/use-access";

const LayoutTraining = ({ children }: { children: ReactNode }) => {
	return <AccessInvitationProvider>{children}</AccessInvitationProvider>;
};
export default LayoutTraining;
