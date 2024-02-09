import Image from "next/image";

const ThanksPage = () => {
	return (
		<div className="w-full flex flex-col gap-6 justify-center items-center p-6">
			<div className="relative w-full h-48 mt-24">
				<Image src={"/images/thanks.svg"} alt="thanks" fill />
			</div>
			<p>
				Terima kasih sudah mengerjakannya. Data sudah terkirim dan akan
				kami konfirmasi.
			</p>
		</div>
	);
};
export default ThanksPage;
