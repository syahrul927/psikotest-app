"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoaderSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/react";
import { EqualIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

export interface KraeplinScreenRollerProps {
  display: RouterOutputs["kraeplinTest"]["getTemplate"];
  answer?: number;
  down: number;
  up: number;
}

export const KraeplinScreenRoller = ({
  display,
  answer,
  down,
  up,
}: KraeplinScreenRollerProps) => {
  const [transition, setTransition] = useState(false);
  useEffect(() => {
    setTransition(true);
    setTimeout(() => {
      setTransition(false);
    }, 150);
  }, [answer]);
  return display.length ? (
    <>
      <div className="relative flex h-full max-w-sm flex-col justify-center space-y-6">
        <div className="question relative flex h-36 w-16 -translate-y-3 items-center justify-center self-center overflow-hidden">
          {display.map((item, index) => {
            return (
              <div
                key={`${item.value}x${item.x}-${item.y}`}
                className={cn(
                  "absolute transition-all duration-200 ease-in-out",
                  position(index, up, down),
                )}
              >
                <Item str={`${item.value}`} />
              </div>
            );
          })}

          <PlusIcon size={32} className="absolute" />
        </div>
      </div>
      <div className="relative flex justify-center gap-3 text-center">
        <div className="flex items-center justify-center">
          <EqualIcon size={24} />
        </div>
        <div className="answer relative flex justify-center">
          <Label
            className={cn(
              "absolute text-5xl font-semibold transition-all duration-150",
              transition
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-30",
            )}
          >
            {answer}
          </Label>
          <Label
            className={cn(
              "text-5xl font-semibold transition-all duration-150",
              !transition ? "opacity-100" : "opacity-30",
            )}
          >
            ?
          </Label>
        </div>
      </div>
    </>
  ) : (
    <LoaderSpinner />
  );
};

interface ItemProps {
  str: string;
}
const Item = (props: ItemProps) => {
  return (
    <Card className={cn("border-none bg-transparent shadow-none")}>
      <CardContent className="flex items-center justify-center p-6">
        <span className="text-6xl font-semibold">{props.str}</span>
      </CardContent>
    </Card>
  );
};

const position = (index: number, up: number, down: number) => {
  if (index === up) {
    return "-translate-y-12";
  }
  if (index === down) {
    return "translate-y-12 ";
  }
  if (index < up) {
    return "-translate-y-24 ";
  }
  return "translate-y-24 ";
};
