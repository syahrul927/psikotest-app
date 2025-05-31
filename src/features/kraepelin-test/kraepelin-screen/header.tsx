"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export interface KraepelinScreenHeaderProps {
  totalColumn: number;
  currentColumn: number;
  time: number;
  runTutor?: () => void;
  tourMode?: boolean;
}
export const KraepelinScreenHeader = ({
  totalColumn,
  currentColumn,
  time,
  tourMode,
  runTutor,
}: KraepelinScreenHeaderProps) => {
  const router = useRouter();
  return (
    <header className="bg-background sticky top-0 mb-3 flex h-fit w-full flex-col px-4 pt-4">
      <div className="relative flex w-full items-center justify-center">
        <Button
          size={"icon"}
          variant={"ghost"}
          className="absolute left-0"
          onClick={() => router.back()}
        >
          <ChevronLeft />
        </Button>
        <div className="flex items-center justify-between">
          <Label className="label-row text-lg leading-tight font-semibold">
            Kraepelin Baris {currentColumn}/{totalColumn}
          </Label>
        </div>
      </div>
      <Progress
        value={(100 * currentColumn) / totalColumn}
        className="z-50 my-3 h-1.5"
      />
      {tourMode && (
        <div className="flex justify-center">
          <Button variant={"link"} onClick={runTutor}>
            <Badge
              variant={"outline"}
              className="rounded-full bg-blue-100 font-medium text-blue-600 dark:bg-blue-600 dark:text-blue-100"
            >
              Mode Latihan
              <QuestionMarkCircledIcon />
            </Badge>
          </Button>
        </div>
      )}
      <div className="flex w-full flex-col items-end font-mono text-sm font-bold">
        <p className="font-semibold">Waktu</p>
        <div className="time-per-row flex w-fit items-center justify-center">
          <Timer
            time={`${Math.floor(time / 60)}`.padStart(2, "0")}
            type="Menit"
          />
          <span className="font-bold">&nbsp;:&nbsp;</span>

          <Timer time={`${time % 60}`.padStart(2, "0")} type="Detik" />
        </div>
      </div>
    </header>
  );
};

const Timer = ({ time, type }: { time: string; type: "Detik" | "Menit" }) => {
  return (
    <div className="bg-muted border-primary relative flex aspect-square h-fit w-fit rounded-md border p-3">
      <span>{time}</span>
      <span className="text-muted-foreground absolute right-0 -bottom-5 left-0 text-xs">
        {type}
      </span>
    </div>
  );
};
