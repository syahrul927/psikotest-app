import { type VariantProps } from "class-variance-authority";
import React from "react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
import { type buttonVariants } from "./button";

export interface AlertDeleteProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof buttonVariants> {
  title: string;
  description?: string;
  onAction: () => void;
  onCancel?: () => void;
}

const AlertConfirm = React.forwardRef<HTMLDivElement, AlertDeleteProps>(
  ({ title, description, onAction, onCancel, variant, size, children }, ref) => {
    return (
      <AlertDialogContent ref={ref}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant={variant}
            size={size}
            onClick={onAction}
          >
            {children}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    );
  },
);
AlertConfirm.displayName = "AlertConfirm";
export default AlertConfirm;
