"use client";

import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TestNavigationProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  currentPageAnswered: boolean;
  currentQuestionsAnswered: number;
  currentQuestionsTotal: number;
  onPrevious: () => void;
  onNext: () => void;
}

const PapiKostickTestNavigation = ({
  canGoPrevious,
  canGoNext,
  currentPageAnswered,
  currentQuestionsAnswered,
  currentQuestionsTotal,
  onPrevious,
  onNext,
}: TestNavigationProps) => {
  return (
    <div className="bg-background border-border mt-6 border-t">
      <div className="mx-auto max-w-4xl p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="flex items-center gap-2 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Button>

          <div className="text-muted-foreground text-sm">
            {currentPageAnswered ? (
              <span className="flex items-center gap-1 text-green-600">
                <Check className="h-4 w-4" />
                Selesai
              </span>
            ) : (
              `${currentQuestionsAnswered} dari ${currentQuestionsTotal} terjawab`
            )}
          </div>

          <Button
            onClick={onNext}
            disabled={!currentPageAnswered}
            className="group flex items-center gap-2"
          >
            {canGoNext ? "Selanjutnya" : "Selesai"}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PapiKostickTestNavigation;
