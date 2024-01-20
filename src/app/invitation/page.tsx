"use client";
import { cn } from "~/lib/utils";
import { Card, CardContent } from "../_components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../_components/ui/carousel";
import Numpad from "./components/numpad";
import { Label } from "../_components/ui/label";
import { PlusIcon } from "lucide-react";

const InvitationPage = () => {
	return (
		<Carousel
			opts={{
				align: "start",
			}}
			orientation="vertical"
			className="w-full"
		>
			<div className="max-w-xs flex-1">
				<CarouselContent className="-mt-1 w-full h-[250px]">
					{Array.from({ length: 20 }).map((_, index) => (
						<CarouselItem key={index} className="basis-1/4 pt-1">
							<div className="p-1">
								<Card className="border-none shadow-none">
									<CardContent className="flex items-center justify-center p-6">
										<span className="text-6xl font-semibold">
											{index + 1}
										</span>
									</CardContent>
								</Card>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<Label
					className={cn(
						"absolute  h-8 w-8 rounded-full",
						"top-[45%] -translate-x-[45%] left-[50%]",
					)}
				>
					<PlusIcon size={24} />
				</Label>
				{/* <CarouselPrevious />
					<CarouselNext /> */}
				<Numpad />
			</div>
		</Carousel>
	);
};
export default InvitationPage;
