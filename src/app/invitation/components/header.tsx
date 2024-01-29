import { Label } from "~/app/_components/ui/label";
import { Progress } from "~/app/_components/ui/progress";

interface HeaderProps {
	totalColumn: number;
	currentColumn: number;
	time: number;
}
const Header = ({ totalColumn, currentColumn, time }: HeaderProps) => {
	return (
		<header className="w-full px-4 py-3 gap-3 mb-3 flex flex-col sticky top-0 h-24 bg-background ">
			<div className="flex justify-between">
				<Label className="font-semibold leading-tight">
					Psikotest App {currentColumn}/{totalColumn}
				</Label>
				<span className="text-destructive font-semibold">
					Waktu&nbsp;
					{`${Math.floor(time / 60)}`.padStart(2, "0")}:
					{`${time % 60}`.padStart(2, "0")}
				</span>
			</div>
			<Progress
				max={totalColumn}
				value={currentColumn}
				className="h-1.5"
			/>
		</header>
	);
};
export default Header;
