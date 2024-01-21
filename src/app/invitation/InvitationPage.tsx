"use client";
import { useState, type ReactNode } from "react";
import Numpad from "./components/numpad";
import { PlusIcon } from "lucide-react";
import { Item } from "./page";

export const InvitationPage = () => {
	const arr = Array.from({ length: 100 });
	const [start, setStart] = useState(0);
	const [end, setEnd] = useState(2);
	// const [active, setActive] = useState(false);
	const [display, setDisplay] = useState<ReactNode[]>(
		arr.slice(start, end).map((_, index) => <Item str={`${index + 1}`} />),
	);
	const onClick = () => {
		const array = arr.slice(end, end + 1);
		const disp = display;
		void disp.shift();
		// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
		disp.push(<Item str={`${array[0] + 1}`} />);
		setDisplay();
		setEnd(end + 1);
	};
	return (
		<div className="flex flex-col h-[100dvh] items-center justify-between pt-6">
			<div className="relative max-w-sm space-y-6 h-full flex flex-col justify-center">
				{display.map((item) => item)}
				<div className="absolute -translate-y-3 self-center w-8 h-8 flex justify-center items-center">
					<PlusIcon size={32} />
				</div>
			</div>
			<Numpad />
		</div>
	);
};
