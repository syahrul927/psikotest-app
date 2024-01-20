import { Button, type ButtonProps } from "~/app/_components/ui/button";
import { useCarousel } from "~/app/_components/ui/carousel";
import { cn } from "~/lib/utils";

const Numpad = () => {
	const { orientation, scrollNext, canScrollNext } = useCarousel();
	return (
		<div className="flex bg-white invert rounded-t-2xl justify-center items-center w-full py-12">
			<div className="w-full grid grid-cols-3 gap-4">
				{Array.from({ length: 9 }).map((_, index) => (
					<Pad value={index + 1} key={index} onClick={scrollNext} />
				))}
				<Pad value={0} className="col-start-2" />
			</div>
		</div>
	);
};
export default Numpad;

interface PadProps extends ButtonProps {
	value: string | number;
}
const Pad = ({ value, className, ...props }: PadProps) => {
	return (
		<Button
			variant={"ghost"}
			className={cn("text-center p-6 text-4xl font-bold", className)}
			{...props}
		>
			{value}
		</Button>
	);
};
