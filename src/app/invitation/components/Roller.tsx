import Spinner from "~/app/_components/ui/spinner";
import { type Variants, motion } from "framer-motion";
import { Card, CardContent } from "~/app/_components/ui/card";
import { cn } from "~/lib/utils";
import { EqualIcon, PlusIcon } from "lucide-react";
import { Label } from "~/app/_components/ui/label";
import { RouterOutputs } from "~/trpc/shared";

interface RollerProps {
	display: RouterOutputs["testKraepelin"]["getTemplate"];
	answer?: number;
	x: number;
	y: number;
}

const ShowingVariant: Variants = {
	init: { y: 24 },
	animate: { y: 0 },
};
const Roller = ({ display, answer, x, y }: RollerProps) => {
	const currentActive = [x, y];
	return display.length ? (
		<>
			<div className="relative max-w-sm space-y-6 h-full flex flex-col justify-center">
				<div className="flex flex-col-reverse">
					{display.map((item, index) => (
						<motion.div
							key={`${item.value}x${item.x}-${item.y}`}
							variants={ShowingVariant}
							initial="init"
							animate="animate"
							className={cn(
								currentActive.includes(index)
									? "block"
									: "hidden absolute",
							)}
						>
							<Item str={`${item.value}`} />
						</motion.div>
					))}
				</div>
				<div className="absolute -translate-y-3 self-center w-8 h-8 flex justify-center items-center">
					<PlusIcon size={32} />
				</div>
			</div>
			<div className="flex text-center justify-center gap-3 relative">
				<div className="flex justify-center items-center">
					<EqualIcon size={24} />
				</div>
				<motion.div key={answer}>
					<Label className={cn("text-5xl font-semibold")}>
						{answer ?? "?"}
					</Label>
				</motion.div>
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
		<Card className={cn("border-none bg-none shadow-none transition-all")}>
			<CardContent className="flex items-center justify-center p-6">
				<span className="text-6xl font-semibold">{props.str}</span>
			</CardContent>
		</Card>
	);
};
