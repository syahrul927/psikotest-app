import Image from "next/image";

export default function NotFound() {
	return (
		<div className="h-screen w-full max-w-lg gap-12 px-12 flex flex-col justify-center items-center">
			<div className="relative h-48 w-full ">
				<Image alt="Notfound" src={"/images/not-found.svg"} fill />
			</div>

			<p className="text-lg text-center w-full">
				Halaman tidak ditemukan 😢 segera hubungi
				<span className="inline font-semibold">&nbsp;Admin</span>
			</p>
		</div>
	);
}
