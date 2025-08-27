"use client";

import { Progress } from "@/components/ui/progress";

interface TestHeaderProps {
  participantName: string;
  currentPage: number;
  totalPages: number;
  responsesCount: number;
  totalQuestions: number;
  progressPercentage: number;
}

const PapiKostickTestHeader = ({
  participantName,
  currentPage,
  totalPages,
  responsesCount,
  totalQuestions,
  progressPercentage,
}: TestHeaderProps) => {
  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-border sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto max-w-4xl p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-xl font-semibold">
              Test Kepribadian
            </h1>
            <p className="text-muted-foreground text-sm">
              {participantName} • Halaman {currentPage + 1} dari {totalPages} •{" "}
              {responsesCount} dari {totalQuestions} terjawab
            </p>
          </div>
        </div>

        <Progress value={progressPercentage} className="h-2" />
      </div>
    </div>
  );
};

export default PapiKostickTestHeader;
