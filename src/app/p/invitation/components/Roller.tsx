import { type Variants } from "framer-motion";
import { EqualIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "~/app/_components/ui/card";
import { Label } from "~/app/_components/ui/label";
import Spinner from "~/app/_components/ui/spinner";
import { cn } from "~/lib/utils";
import { type RouterOutputs } from "~/trpc/shared";

interface RollerProps {
	display: RouterOutputs["testKraepelin"]["getTemplate"];
	answer?: number;
	down: number;
	up: number;
}

const ShowingVariant: Variants = {
	init: { y: 0, scale: 1, opacity: 1 },
	animate: { y: -48, scale: 0.9, opacity: 0.4 },
};
const Roller = ({ display, answer, down, up }: RollerProps) => {
	const [transition, setTransition] = useState(false);
	useEffect(() => {
		setTransition(true);
		setTimeout(() => {
			setTransition(false);
		}, 150);
	}, [answer]);
	return display.length ? (
		<>
			<div className="relative max-w-sm space-y-6 h-full flex flex-col justify-center">
				<div className="-translate-y-3 question relative overflow-hidden self-center w-16 h-36 flex justify-center items-center">
					{display.map((item, index) => {
						return (
							<div
								key={`${item.value}x${item.x}-${item.y}`}
								className={cn(
									"transition-all ease-in-out absolute duration-200",
									position(index, up, down),
								)}
							>
								<Item str={`${item.value}`} />
							</div>
						);
					})}

					<PlusIcon size={32} className="absolute" />
				</div>
			</div>
			<div className="flex text-center justify-center gap-3 relative">
				<div className="flex justify-center items-center">
					<EqualIcon size={24} />
				</div>
				<div className="relative flex answer justify-center">
					<Label
						className={cn(
							"text-5xl font-semibold absolute transition-all duration-150",
							transition
								? "translate-y-0 opacity-100"
								: "translate-y-12 opacity-30",
						)}
					>
						{answer}
					</Label>
					<Label
						className={cn(
							"text-5xl font-semibold transition-all duration-150",
							!transition ? " opacity-100" : "opacity-30",
						)}
					>
						?
					</Label>
				</div>
			</div>
		</>
	) : (
		<Spinner />
	);
};

export default Roller;

interface ItemProps {
	str: string;
}
const Item = (props: ItemProps) => {
	return (
		<Card className={cn("border-none bg-transparent shadow-none")}>
			<CardContent className="flex items-center justify-center p-6">
				<span className="text-6xl font-semibold">{props.str}</span>
			</CardContent>
		</Card>
	);
};

const position = (index: number, up: number, down: number) => {
	if (index === up) {
		return "-translate-y-12";
	}
	if (index === down) {
		return "translate-y-12 ";
	}
	if (index < up) {
		return "-translate-y-24 ";
	}
	return "translate-y-24 ";
};
