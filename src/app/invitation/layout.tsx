const InvitationLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<div className="flex items-center flex-col min-h-screen">
			{children}
		</div>
	);
};
export default InvitationLayout;
