"use client";
import { useState } from "react";
import { type RouterOutputs } from "~/trpc/shared";

interface useDisplayProps {
	array?: RouterOutputs["testKraepelin"]["getTemplate"];
}
export const useDisplay = (props: useDisplayProps) => {
	const [template, setTemplate] = useState<
		Record<string, number | undefined>
	>({});
	const [x, setX] = useState<number>(0);
	const [y, setY] = useState<number>(1);
	const submitAnswer = (subx: number, suby: number, answer: number) => {
		const temp = {
			[`${subx}-${suby}`]: answer,
		};
		setTemplate({ ...template, ...temp });
	};

	return {
		template,
		submitAnswer,
		x,
		y,
	};
};
