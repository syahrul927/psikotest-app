import Image from "next/image";

const AvatarUser = ({ img, name }: { img?: string | null; name: string }) => {
	return (
		<div className="relative w-8 h-8 rounded-full overflow-hidden border-[1.5px] bg-blue-300/80 border-primary/60 flex justify-center items-center">
			{img ? (
				<Image alt="profile-pict" src={img} fill />
			) : (
				<p>{String(name).substring(0, 1)}</p>
			)}
		</div>
	);
};
export default AvatarUser;
