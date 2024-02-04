import { AccessInvitationProvider } from "../hooks/use-access";

const InvitationLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<div className="flex items-center flex-col">
			<AccessInvitationProvider>{children}</AccessInvitationProvider>
		</div>
	);
};
export default InvitationLayout;
