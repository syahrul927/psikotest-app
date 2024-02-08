"use client";
import { useEffect, useState } from "react";
import { useCountdown } from "usehooks-ts";
import { api } from "~/trpc/react";
import { type PageType } from "~/types/page-type";
import Roller from "../components/Roller";
import Header from "../components/header";
import Numpad from "../components/numpad";
import { useDisplay } from "../hooks/use-display";
import { useAccessInvitation } from "../hooks/use-access";
import { useRouter } from "next/navigation";
import Spinner from "~/app/_components/ui/spinner";
import { useToast } from "~/app/_components/ui/use-toast";

const InvitationPage = ({ params }: PageType) => {
	const router = useRouter();
	const { access, id } = useAccessInvitation();
	const { toast } = useToast();
	const { refetch: fetchLatest, data: latest } =
		api.testKraepelin.getLatest.useQuery(
			{ invitationId: params.slug, resultId: id ?? "" },
			{
				enabled: false,
				refetchOnReconnect: false,
				refetchOnWindowFocus: false,
				refetchOnMount: false,
			},
		);
	const { data, refetch: fetchTemplate } =
		api.testKraepelin.getTemplate.useQuery(undefined, {
			enabled: false,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
		});
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
		if (latest?.latest.x && latest.latest.y) {
			setActive({
				indexUp: latest.latest.y - 2,
				indexDown: latest.latest.y - 1,
			});
		}
	}, [latest]);

	useEffect(() => {
		if (currentColumn.length && startCountdown) {
			setActive({
				indexDown: currentColumn.length - 1,
				indexUp: currentColumn.length - 2,
			});
			startCountdown();
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
				return;
			}
			toast({
				title: "Yeay 🎉🎉🎉",
				description: "Kamu berhasil menyelesaikannya..",
			});
			router.push("/p/invitation/thanks");
		}
	}, [count]);

	const disableUndo = () => {
		if (activeUndo < 2) {
			setActiveUndo(activeUndo + 1);
		}
	};
	const onClickNumpad = (answer: number) => {
		if (active.indexUp !== 0) {
			mutate({
				value: answer,
				xA: indexColumn,
				yA: active.indexUp + 1,
				xB: indexColumn,
				yB: active.indexDown + 1,
				a: quetion.a,
				b: quetion.b,
				id: id ?? "",
			});
			setActive({
				indexUp: active.indexUp - 1,
				indexDown: active.indexDown - 1,
			});
			disableUndo();
			setAnswer(answer);
		}
	};
	const { mutate } = api.testKraepelin.submitAnswer.useMutation();

	const undo = () => {
		if (activeUndo === 2 && active.indexDown !== currentColumn.length - 1) {
			setActiveUndo(0);
			setActive({
				indexDown: active.indexDown + 1,
				indexUp: active.indexUp + 1,
			});
		}
	};

	useEffect(() => {
		if (access) {
			void fetchLatest();
			void fetchTemplate();
			return;
		}
		router.push(`/p/invitation/${params.slug}/confirmation`);
	}, [router, access]);
	return !access ? (
		<div className="flex justify-center items-center py-16">
			<Spinner />
		</div>
	) : (
		<div className="flex flex-col h-[100dvh] relative items-center justify-between w-full">
			<Header
				time={count}
				totalColumn={totalColumn}
				currentColumn={indexColumn}
			/>
			<div className="w-full h-full flex relative justify-center items-center">
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
export default InvitationPage;
