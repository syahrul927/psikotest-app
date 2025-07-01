import { Timer } from "@/components/timer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain } from "lucide-react";
import React from "react";
import type { IstQuestion } from "./ist-test";

interface HeaderProps {
  question?: {
    description?: string;
    questions?: IstQuestion["questions"];
  };
  SUBTEST_TIME?: number;
  timerActive?: boolean;
  handleBackToSelection: () => void;
  handleTimeUp: () => void;
}

export default function Header({
  question,
  SUBTEST_TIME,
  timerActive,
  handleBackToSelection,
  handleTimeUp,
}: HeaderProps) {
  return (
    <div className="bg-background/80 sticky top-0 z-50 border-b shadow-sm backdrop-blur-lg">
      <div className="mx-auto max-w-4xl px-4 py-3 sm:py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToSelection}
              className=""
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="rounded-lg p-1.5 sm:p-2">
                <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <h1 className="text-lg leading-tight font-bold sm:text-xl">
                  {question?.description}
                </h1>
                <p className="text-xs sm:text-sm">
                  {question?.questions?.length} Pertanyaan
                </p>
              </div>
            </div>
          </div>
          <div className="self-end sm:ml-auto sm:self-auto">
            <Timer
              seconds={SUBTEST_TIME ?? 300}
              onTimeUp={handleTimeUp}
              isActive={timerActive ?? true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
