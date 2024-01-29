"use client";
import { useEffect, useState } from "react";
import Roller from "./components/Roller";
import Header from "./components/header";
import Numpad from "./components/numpad";
import { useCountdown } from "usehooks-ts";
import { api } from "~/trpc/react";
import { useDisplay } from "./hooks/use-display";

const InvitationPage = () => {
	const { data } = api.testKraepelin.getTemplate.useQuery(undefined, {
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});
	const { x, y } = useDisplay({ array: data });
	const [intervalValue, setIntervalValue] = useState<number>(1000);
	const [count, { startCountdown, stopCountdown, resetCountdown }] =
		useCountdown({
			countStart: 30,
			intervalMs: intervalValue,
		});
	useEffect(() => {
		if (startCountdown) {
			startCountdown();
		}
	}, [data]);
	const onClickNumpad = () => {
		return;
	};

	return (
		<div className="flex flex-col h-[100dvh] relative items-center justify-between w-full">
			<Header time={count} totalColumn={40} currentColumn={1} />
			<div className="w-full h-full flex justify-center items-center">
				<Roller display={data ?? []} x={x} y={y} />
			</div>
			<Numpad onClick={onClickNumpad} />
		</div>
	);
};
export default InvitationPage;
