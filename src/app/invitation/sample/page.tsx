"use client";
import React from "react";

const arr = [3, 5, 2, 2, 3, 5, 6, 2, 1, 7, 4, 9, 3, 1];

const SamplePage = () => {
	const [start, setStart] = React.useState(0);
	const [end, setEnd] = React.useState(3);
	const [active, setActive] = React.useState(arr.slice(start, end));
	const [transition, setTransition] = React.useState(false);

	const onNext = () => {
		const st = end === 3 ? start : start + 1;
		const ed = end + 1;

		// Aktifkan animasi
		setTransition(true);

		// Atur timeout untuk menonaktifkan animasi setelah selesai transisi
		setTimeout(() => {
			setTransition(false);
		}, 500);

		setActive(arr.slice(st, ed));
		setStart(st);
		setEnd(ed);
	};

	return (
		<div className="w-full h-screen bg-purple-200 flex items-center justify-center flex-col gap-4">
			<div
				className={`max-w-lg w-full text-4xl text-center rounded-lg flex flex-col items-center min-h-[60dvh] bg-white border-2 border-black py-20 px-2 transform ${
					transition
						? "transition-transform duration-500 ease-in-out"
						: ""
				}`}
			>
				<div
					className={`opacity-25 ${
						active.length < 4 ? "hidden" : ""
					}`}
				>
					{active[0]}
				</div>
				<div className="font-bold text-6xl my-6">
					{active.length < 4 ? active[0] : active[1]}
				</div>
				<div className="">+</div>
				<div className="font-bold text-6xl my-6">
					{active.length < 4 ? active[1] : active[2]}
				</div>
				<div className={`opacity-25`}>
					{active.length < 4 ? active[2] : active[3]}
				</div>
			</div>
			<button
				onClick={onNext}
				className="px-8 my-8 py-2 focus:bg-black/20 rounded-lg border-2 bg-purple-600 text-white border-black capitalize"
			>
				Next
			</button>
		</div>
	);
};

export default SamplePage;
