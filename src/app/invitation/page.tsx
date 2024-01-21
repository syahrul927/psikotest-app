"use client";
import { ArrowUpIcon, EqualIcon, PlusIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn, makeid } from "~/lib/utils";
import { Card, CardContent } from "../_components/ui/card";
import { Label } from "../_components/ui/label";
import Numpad from "./components/numpad";

const InvitationPage = () => {
	const arr = [3, 5, 2, 2, 3, 5, 6, 2, 1, 7, 4, 9, 3, 1];
	const [answer, setAnswer] = useState<number | undefined>();
	const [transition, setTransition] = useState(false);
	const [start, setStart] = useState(0);
	const [end, setEnd] = useState(2);

	const [time, setTime] = useState(300);

	useEffect(() => {
		const timer = setInterval(() => {
			setTime((time) => {
				if (time === 0) {
					clearInterval(timer);
					return 0;
				} else return time - 1;
			});
		}, 1000);
	}, []);
	// const [active, setActive] = useState(false);
	const [display, setDisplay] = useState<ReactNode[]>(
		arr
			.slice(start, end)
			.map((value, index) => (
				<Item index={index} key={makeid(5)} str={`${value}`} />
			)),
	);
	const onClick = (number: number) => {
		setAnswer(number);
		doTransition();
		const array = arr.slice(end, end + 1);
		const disp = display;
		if (array.length > 0) {
			void disp.shift();
			disp.push(
				<Item key={makeid(5)} str={`${array[0]}`} index={end + 1} />,
			);
			setDisplay(disp);
			setEnd(end + 1);
		}
	};
	const doTransition = () => {
		setTransition(true);
		setTimeout(() => {
			setTransition(false);
		}, 500);
	};
	return (
		<div className="flex flex-col h-[100dvh] relative items-center justify-between w-full">
			<header className="w-full px-4 py-2 mb-3 flex items-center sticky top-0 h-32 border bg-background shadow-md">
				<Label className="text-lg font-bold">PsikotestApp</Label>
			</header>
			<div className="flex justify-start w-full px-4">
				<div className="flex text-destructive font-bold text-sm flex-col items-center">
					<span>
						Waktu&nbsp;{`${Math.floor(time / 60)}`.padStart(2, "0")}
						:{`${time % 60}`.padStart(2, "0")}
					</span>
				</div>
			</div>
			<div className="w-full h-full flex justify-center items-center">
				<div className="relative max-w-sm space-y-6 h-full flex flex-col justify-center">
					{display.map((item) => item)}
					<div className="absolute -translate-y-3 self-center w-8 h-8 flex justify-center items-center">
						<PlusIcon size={32} />
					</div>
				</div>
				<div className="flex text-center justify-center gap-3 relative">
					<div className="flex justify-center items-center">
						<EqualIcon size={24} />
					</div>
					<Label
						className={cn(
							"text-5xl font-semibold transition-all text-muted-foreground",
							transition ? "opacity-0" : "opacity-100",
						)}
					>
						?
					</Label>
					<Label
						className={cn(
							"text-5xl font-semibold transition-all absolute translate-x-4",
							transition
								? " translate-y-0 opacity-100"
								: "-translate-y-16 opacity-15",
						)}
					>
						{answer ?? ""}
					</Label>
				</div>
			</div>
			<Numpad onClick={onClick} />
		</div>
	);
};
export default InvitationPage;

interface ItemProps {
	str: string;
	index: number;
}
const Item = (props: ItemProps) => {
	return (
		<Card className={cn("border-none bg-none shadow-none transition-all")}>
			<CardContent className="flex items-center justify-center p-6">
				<span className="text-6xl font-semibold">{props.str}</span>
			</CardContent>
		</Card>
	);
};
