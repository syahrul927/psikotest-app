"use client";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { RocketIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCountdown } from "usehooks-ts";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "~/app/_components/ui/alert";
import { Button } from "~/app/_components/ui/button";
import { makeid } from "~/lib/utils";
import { type RouterOutputs } from "~/trpc/shared";
import { type PageType } from "~/types/page-type";
import Roller from "../components/Roller";
import Header from "../components/header";
import Numpad from "../components/numpad";
import { useDisplay } from "../hooks/use-display";

import Joyride, { STATUS, type CallBackProps, type Step } from "react-joyride";

const generate = () => {
	return Math.floor(Math.random() * 9) + 1;
};
type Template = RouterOutputs["testKraepelin"]["getTemplate"];

interface State {
	run: boolean;
	steps: Step[];
}
const TrainingPage = ({ params }: PageType) => {
	const router = useRouter();
	const [data, setData] = useState<Template>(
		Array.from({ length: 61 * 40 }).map((_, idx) => {
			const index = idx + 1;
			const x = Math.floor(index / 62);
			const y = index % 61;
			return {
				id: `${idx}-${generate()}-${makeid(4)}`,
				value: generate(),
				x: x + 1,
				y: y == 0 ? 61 : y,
				version: "version-1",
			};
		}),
	);

	const [finish, setFinish] = useState<boolean>(false);
	const [activeUndo, setActiveUndo] = useState(2);
	const { setArray, currentColumn, nextColumn, totalColumn, indexColumn } =
		useDisplay();
	const [answer, setAnswer] = useState<number | undefined>();
	const [quetion, setQuetion] = useState({
		a: 0,
		b: 0,
	});
	const [active, setActive] = useState({
		indexUp: 0,
		indexDown: 0,
	});
	const [count, { startCountdown, resetCountdown }] = useCountdown({
		countStart: 30,
		intervalMs: 1000,
	});
	useEffect(() => {
		if (data?.length) {
			setArray(data);
		}
	}, [data]);

	useEffect(() => {
		if (currentColumn.length) {
			setActive({
				indexDown: currentColumn.length - 1,
				indexUp: currentColumn.length - 2,
			});
		}
	}, [currentColumn]);
	useEffect(() => {
		if (active.indexDown === 0 && active.indexUp === 0) return;
		setQuetion({
			a: currentColumn[active.indexUp]?.value ?? 0,
			b: currentColumn[active.indexDown]?.value ?? 0,
		});
	}, [active]);
	useEffect(() => {
		if (count === 0) {
			if (indexColumn < totalColumn) {
				nextColumn();
				resetCountdown();
			}
		}
	}, [count]);

	const disableUndo = () => {
		if (activeUndo < 2) {
			setActiveUndo(activeUndo + 1);
		}
	};
	const onClickNumpad = (answer: number) => {
		if (active.indexUp !== 0) {
			setActive({
				indexUp: active.indexUp - 1,
				indexDown: active.indexDown - 1,
			});
			disableUndo();
			setAnswer(answer);
		}
	};

	const undo = () => {
		if (activeUndo === 2 && active.indexDown !== currentColumn.length - 1) {
			setActiveUndo(0);
			setActive({
				indexDown: active.indexDown + 1,
				indexUp: active.indexUp + 1,
			});
		}
	};

	// joyride
	const [{ run, steps }, setState] = useState<State>({
		run: false,
		steps: [
			{
				content: <h2>Mulai Latihan</h2>,
				locale: { skip: <strong aria-label="skip">Skip</strong> },
				placement: "center",
				target: "body",
			},
			{
				content: <h2>Total Baris Kraepelin</h2>,
				spotlightPadding: 5,
				target: ".label-row",
			},

			{
				content: <h2>Waktu per baris</h2>,
				spotlightPadding: 5,
				target: ".time-per-row",
			},
			{
				content: (
					<h2>Soal Kraepelin akan bergerak dari bawah ke atas</h2>
				),
				spotlightPadding: 5,
				target: ".question-wrapper",
			},
			{
				content: "Angka yang perlu dihitung",
				spotlightPadding: 5,
				target: ".question",
			},
			{
				content: "Jawaban yang kamu berikan ",
				spotlightPadding: 5,
				target: ".answer",
			},

			{
				content: "Keyboard untuk menjawab",
				spotlightPadding: 5,
				target: ".keyboard",
			},
			{
				content:
					"Hapus/kembali urutan sebelum nya (hanya bisa dilakukan 1x mundur setelah 2x maju)",
				spotlightPadding: 5,
				target: ".keyboard-backspace",
			},
		],
	});
	const handleJoyrideCallback = (data: CallBackProps) => {
		const { status, type } = data;
		const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

		if (finishedStatuses.includes(status)) {
			setFinish(true);
			setState({ run: false, steps });
		}
	};

	useEffect(() => {
		setState({ run: true, steps });
	}, []);

	useEffect(() => {
		if (finish && startCountdown) {
			startCountdown();
		}
	}, [finish]);
	return (
		<div className="flex flex-col h-[100dvh] relative items-center justify-between w-full">
			<div className="w-full flex flex-col-reverse items-center justify-start px-3">
				<Alert className="w-full bg-primary text-primary-foreground animate-pulse">
					<RocketIcon
						className="h-4 w-4"
						color="hsl(var(--primary-foreground))"
					/>
					<AlertTitle>Latihan</AlertTitle>
					<AlertDescription>
						Silahkan mencoba test kraepelin!
					</AlertDescription>
				</Alert>

				<div className="w-full">
					<Button onClick={() => router.back()} variant={"ghost"}>
						<ArrowLeftIcon />
						Kembali{" "}
					</Button>
				</div>
			</div>

			{run && (
				<Joyride
					callback={handleJoyrideCallback}
					continuous
					hideCloseButton
					run={run}
					scrollToFirstStep
					showSkipButton
					steps={steps}
					styles={{
						options: {
							primaryColor: "hsl(var(--primary))",

							zIndex: 10000,
						},
					}}
				/>
			)}
			<Header
				time={count}
				totalColumn={totalColumn}
				currentColumn={indexColumn}
			/>

			<div className="w-full h-full question-wrapper flex relative justify-center items-center">
				<Roller
					display={currentColumn}
					down={active.indexDown}
					up={active.indexUp}
					answer={answer}
				/>
				{active.indexUp === 0 && active.indexDown !== 0 ? (
					<div className="absolute w-full text-destructive font-semibold text-center bottom-0">
						Kamu mencapai batas baris
					</div>
				) : null}
			</div>
			<Numpad onClickUndo={undo} onClick={onClickNumpad} />
		</div>
	);
};
export default TrainingPage;
