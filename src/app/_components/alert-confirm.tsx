import { VariantProps } from "class-variance-authority";
import React from "react";
import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "./ui/alert-dialog";
import { type buttonVariants } from "./ui/button";

export interface AlertDeleteProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	description?: string;
	onAction: () => void;
	buttonVariant?: VariantProps<typeof buttonVariants>;
}

const AlertConfirm = React.forwardRef<HTMLDivElement, AlertDeleteProps>(
	({ title, description, onAction, buttonVariant }) => {
		return (
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					{description && (
						<AlertDialogDescription>
							{description}
						</AlertDialogDescription>
					)}
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant={buttonVariant?.variant ?? "default"}
						size={buttonVariant?.size ?? "default"}
						onClick={() => onAction()}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		);
	},
);
AlertConfirm.displayName = "AlertConfirm";
export default AlertConfirm;
