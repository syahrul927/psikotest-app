"use client";
import { GripVerticalIcon, X } from "lucide-react";
import React from "react";
import {
	SortableContainer,
	SortableElement,
	SortableHandle,
	type SortableContainerProps,
	type SortableElementProps,
} from "react-sortable-hoc";
import { Button } from "./button";
import { Label } from "./label";
import Image from "next/image";

export interface SortableListProps
	extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	data: string[];
	onMove: (oldIndex: number, newIndex: number) => void;
	onRemove: (index: number) => void;
}

const DragHandle = SortableHandle(() => (
	<GripVerticalIcon size={16} className="cursor-pointer" />
));
const SortableItem: React.ComponentClass<
	SortableElementProps & {
		value: string;
		onRemove: (index: number) => void;
		idx: number;
	}
> = SortableElement(
	({
		value,
		onRemove,
		idx,
	}: {
		value: string;
		idx: number;
		onRemove: (index: number) => void;
	}) => (
		<li className="h-32 flex relative border-2 rounded-lg items-center max-w-sm">
			<Button
				className="absolute h-8 z-20 rounded-full w-8 p-2 -top-3 -right-3"
				type="button"
				variant={"default"}
				onClick={() => onRemove(idx)}
			>
				<label className="">
					<X size={16} />
				</label>
			</Button>
			<Image
				src={value}
				fill
				className="object-cover rounded-md"
				alt={`image-${value}`}
			/>
		</li>
	),
);

interface SortableContainerInnerProps {
	items: string[];
	onRemove: (index: number) => void;
}
const SortableContainers: React.ComponentClass<
	SortableContainerProps & SortableContainerInnerProps
> = SortableContainer(({ items, onRemove }: SortableContainerInnerProps) => {
	return (
		<ul className="grid grid-cols-4 gap-4">
			{items.map((value, index) => (
				<div className="relative" key={`item-${value}-${index}`}>
					<SortableItem
						idx={index}
						onRemove={onRemove}
						index={index}
						value={value}
					/>
				</div>
			))}
		</ul>
	);
});
const SortableList: React.FC<SortableListProps> = ({
	title,
	onMove,
	onRemove,
	data,
}) => {
	const onSortEnd = ({
		oldIndex,
		newIndex,
	}: {
		oldIndex: number;
		newIndex: number;
	}) => {
		onMove(oldIndex, newIndex);
	};
	const onRemoveData = (index: number) => {
		onRemove(index);
	};
	return (
		<div className="grid space-y-4">
			<Label>{title}</Label>
			{data.length ? (
				<SortableContainers
					axis="xy"
					onRemove={onRemoveData}
					onSortEnd={onSortEnd}
					items={data}
				/>
			) : (
				<span className="text-sm text-muted-foreground">
					No {title} have been added yet.
				</span>
			)}
		</div>
	);
};
SortableList.displayName = "SortableList";

export default SortableList;
