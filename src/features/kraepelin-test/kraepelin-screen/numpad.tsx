"use client";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DeleteIcon } from "lucide-react";
import { useEffect, useState } from "react";

export interface KraepelinScreenNumpadProps {
  onClick: (number: number) => void;
  onClickUndo: () => void;
}
export const KraepelinScreenNumpad = ({
  onClick: onClickParent,
  onClickUndo,
}: KraepelinScreenNumpadProps) => {
  const [answer, setAnswer] = useState<number | undefined>();
  const onClick = (number: number) => {
    setAnswer(number);
    onClickParent(number);
  };
  useEffect(() => {
    if (answer) {
      setAnswer(undefined);
    }
  }, [answer]);

  return (
    <div className="keyboard bg-background flex w-full flex-col items-center justify-center space-y-3 rounded-t-2xl border-t px-6 pt-6 pb-10 font-mono shadow-md">
      <div className="grid w-full max-w-lg grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, index) => (
          <Pad
            value={index + 1}
            key={index}
            onClick={() => onClick(index + 1)}
          />
        ))}
        <Pad value={0} className="col-start-2" onClick={() => onClick(0)} />
        <Pad value={""} className="keyboard-backspace" onClick={onClickUndo}>
          <DeleteIcon className="scale-150" />
        </Pad>
      </div>
    </div>
  );
};

interface PadProps extends ButtonProps {
  value: string | number;
}
const Pad = ({ value, children, className, ...props }: PadProps) => {
  return (
    <Button
      variant={"ghost"}
      className={cn(
        "bg-muted active:bg-primary/90 active:text-primary-foreground p-6 text-center text-4xl font-bold",
        className,
      )}
      {...props}
    >
      {children} {value}
    </Button>
  );
};
