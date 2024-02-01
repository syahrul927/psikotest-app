const InvitationLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<div className="overflow-hidden relative w-full">
			<div className="absolute rounded-full h-48 w-48 bg-primary/50 -right-24 -top-12"></div>
			{children}
		</div>
	);
};
export default InvitationLayout;
