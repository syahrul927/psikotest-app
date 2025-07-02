import React from "react";
import { Button } from "@/components/ui/button";

interface FooterProps {
  handleBackToSelection: () => void;
  handleCompleteSubtest: () => void;
  isSubtestCompleted: () => boolean;
  isSubmitted: boolean;
}

export function Footer({
  handleBackToSelection,
  handleCompleteSubtest,
  isSubtestCompleted,
  isSubmitted,
}: FooterProps) {
  return (
    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-between sm:gap-0 sm:pt-6">
      <Button
        variant="outline"
        onClick={handleBackToSelection}
        className="order-2 w-full px-4 sm:order-1 sm:w-auto sm:px-8"
      >
        Kembali ke Pilihan Subtes
      </Button>
      <Button
        onClick={handleCompleteSubtest}
        // disabled={!isSubtestCompleted() || isSubmitted}
        isLoading={isSubmitted}
        className="order-1 w-full px-4 sm:order-2 sm:w-auto sm:px-8"
      >
        Selesaikan Subtes
      </Button>
    </div>
  );
}
