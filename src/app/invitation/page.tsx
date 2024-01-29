"use client";
import { useEffect, useState } from "react";
import { useCountdown } from "usehooks-ts";
import { api } from "~/trpc/react";
import Roller from "./components/Roller";
import Header from "./components/header";
import Numpad from "./components/numpad";
import { useDisplay } from "./hooks/use-display";
import { Button } from "../_components/ui/button";
import { cn } from "~/lib/utils";

const InvitationPage = () => {
	const { data } = api.testKraepelin.getTemplate.useQuery(undefined, {
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});
	const { setArray, currentColumn } = useDisplay();
	const [active, setActive] = useState({
		up: 0,
		down: 0,
	});
	const [count, { startCountdown }] = useCountdown({
		countStart: 30,
		intervalMs: 1000,
	});
	useEffect(() => {
		if (data?.length) {
			setArray(data);
		}
	}, [data]);

	useEffect(() => {
		if (currentColumn.length && startCountdown) {
			setActive({
				down: currentColumn.length - 1,
				up: currentColumn.length - 2,
			});
			startCountdown();
		}
	}, [currentColumn]);

	const onClickNumpad = () => {
		if (active.up !== 0) {
			setActive({ up: active.up - 1, down: active.down - 1 });
		}
	};

	return (
		<div className="flex flex-col h-[100dvh] relative items-center justify-between w-full">
			<Header time={count} totalColumn={40} currentColumn={1} />
			<div className="w-full h-full flex justify-center items-center">
				<Roller
					display={currentColumn}
					down={active.down}
					up={active.up}
				/>
			</div>
			<Numpad onClick={() => onClickNumpad()} />
		</div>
	);
};
export default InvitationPage;
