"use client";
import { MessageCircleWarningIcon } from "lucide-react";
import { useEffect, useState } from "react";
import _ from "underscore";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "~/app/_components/ui/alert";
import { api } from "~/trpc/react";
import { type PageType } from "~/types/page-type";
import DetailAnswerCart, {
	type DetailAnswerCartItemProps,
} from "./components/detail-answer-cart";
import InformationTesterCard from "./components/information-tester-card";
import PointResultCart from "./components/point-result-cart";
import StatisticCart from "./components/statistic-cart";
import { SummaryResultCart } from "./components/summary-result-card";
import TableSummaryRow from "./components/table-summary-row";
import { plusKraepelin } from "~/lib/utils";

const ResultInvitationPage = ({ params }: PageType) => {
	const { slug } = params;
	const [details, setDetails] = useState<DetailAnswerCartItemProps[]>([]);
	const { data, isLoading } = api.result.getResult.useQuery(slug);
	useEffect(() => {
		const result = data?.kraepelinResult?.KraepelinResultDetail ?? [];
		const grouped = _.groupBy(result, "xA");
		const filtered: DetailAnswerCartItemProps[] = Object.keys(grouped).map(
			(key) => {
				const item = grouped[key];
				if (item) {
					return {
						x: key,
						detail: item.map((det) => ({
							a: det.a,
							b: det.b,
							value: det.value,
							correct: plusKraepelin(det.a, det.b),
						})),
					};
				}
				return {
					x: 0,
					detail: [],
				};
			},
		);
		setDetails(filtered);
	}, [data?.kraepelinResult?.KraepelinResultDetail]);
	return (
		<div className="grid grid-cols-2 gap-6">
			<Alert className="col-span-2 bg-primary text-primary-foreground ">
				<MessageCircleWarningIcon className="h-4 w-4" color="white" />
				<AlertTitle>Perhatian</AlertTitle>
				<AlertDescription>
					Data yang disajikan merupakan data yang sudah di filter
					hanya beberapa baris yang ditampilkan. Baris yang
					ditampilkan diantaranya{" "}
					<span className="inline font-bold italic">
						6-10, 21-25, 36-40
					</span>
				</AlertDescription>
			</Alert>
			<InformationTesterCard
				isLoading={isLoading}
				address={data?.informationTester?.address ?? "-"}
				name={data?.informationTester?.name ?? "-"}
				educationId={data?.informationTester?.educationId ?? "-"}
				phone={data?.informationTester?.phone ?? "-"}
				educationDescription={
					data?.informationTester?.educationDescription ?? "-"
				}
			/>
			<SummaryResultCart
				deciel={data?.kraepelinResult?.deciel ?? 0}
				highest={data?.kraepelinResult?.highestJanker ?? 0}
				lowest={data?.kraepelinResult?.lowestJanker ?? 0}
				totalAnswered={data?.kraepelinResult?.totalAnswered ?? 0}
				wrongAnswered={data?.kraepelinResult?.totalIncorrect ?? 0}
				isLoading={isLoading}
			/>
			<PointResultCart
				educationId={data?.informationTester?.educationId ?? ""}
				isLoading={isLoading}
				hanker={data?.kraepelinResult?.hanker ?? 0}
				janker={data?.kraepelinResult?.janker ?? 0}
				tianker={data?.kraepelinResult?.tianker ?? 0}
				panker={data?.kraepelinResult?.panker ?? 0}
			/>

			<StatisticCart
				data={
					data?.kraepelinResult?.KraepelinResultSummary.map(
						(item) => ({
							answered: item.answered,
							name: item.x.toString(),
						}),
					) ?? []
				}
				avarage={data?.kraepelinResult?.panker ?? 0}
			/>
			<TableSummaryRow
				isLoading={isLoading}
				data={
					data?.kraepelinResult?.KraepelinResultSummary.map(
						(item) => ({
							answered: item.answered,
							correct: item.correct ?? 0,
							row: item.x,
							wrong: item.wrong ?? 0,
						}),
					) ?? []
				}
			/>
			<DetailAnswerCart data={details} />
		</div>
	);
};
export default ResultInvitationPage;
