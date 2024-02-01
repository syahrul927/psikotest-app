"use client";
import { useEffect, useState } from "react";
import _ from "underscore";
import { type RouterOutputs } from "~/trpc/shared";

type TemplateType = RouterOutputs["testKraepelin"]["getTemplate"];
export const useDisplay = () => {
	const [template, setTemplate] = useState<_.Dictionary<TemplateType>>({});
	const [indexColumn, setIndexColumn] = useState(1);
	const [currentColumn, setCurrentColumn] = useState<TemplateType>([]);

	const setArray = (value: TemplateType) => {
		const temp = _.groupBy(value, "x");
		setTemplate(temp);
	};
	useEffect(() => {
		if (template) {
			const temp = template[indexColumn];
			if (temp) {
				setCurrentColumn(temp);
			}
		}
	}, [template, indexColumn]);

	const nextColumn = () => {
		setIndexColumn(indexColumn + 1);
	};
	return {
		setArray,
		currentColumn,
		nextColumn,
		indexColumn,
		totalColumn: Object.keys(template).length,
	};
};
