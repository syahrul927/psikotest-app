import { DeleteIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, type ButtonProps } from "~/app/_components/ui/button";
import { cn } from "~/lib/utils";

const Numpad = ({
	onClick: onClickParent,
	onClickUndo,
}: {
	onClick: (number: number) => void;
	onClickUndo: () => void;
}) => {
	const [answer, setAnswer] = useState<number | undefined>();
	const onClick = (number: number) => {
		setAnswer(number);
		onClickParent(number);
	};
	useEffect(() => {
		if (answer) {
			setAnswer(undefined);
		}
	}, [answer]);

	return (
		<div className="flex flex-col border shadow-md bg-white rounded-t-2xl space-y-3 px-6 justify-center items-center w-full pt-6 pb-10">
			<div className="w-full grid grid-cols-3 gap-6 max-w-lg">
				{Array.from({ length: 9 }).map((_, index) => (
					<Pad
						value={index + 1}
						key={index}
						onClick={() => onClick(index + 1)}
					/>
				))}
				<Pad
					value={0}
					className="col-start-2"
					onClick={() => onClick(0)}
				/>
				<Pad value={""} onClick={onClickUndo}>
					<DeleteIcon className="text-4xl font-bold" />
				</Pad>
			</div>
		</div>
	);
};
export default Numpad;

interface PadProps extends ButtonProps {
	value: string | number;
}
const Pad = ({ value, children, className, ...props }: PadProps) => {
	return (
		<Button
			variant={"ghost"}
			className={cn(
				"text-center hover:bg-background p-6 text-4xl font-bold active:bg-primary active:text-primary-foreground",
				className,
			)}
			{...props}
		>
			{children} {value}
		</Button>
	);
};
