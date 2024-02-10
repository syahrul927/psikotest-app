const InvitationLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return <div className="flex items-center flex-col">{children}</div>;
};
export default InvitationLayout;
