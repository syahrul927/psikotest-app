"use client";

import { KraeplinScreen } from "@/features/kraeplin-test";
import { useKraeplinTestLogic } from "./use-kraeplin-screen-test-logic";
import { useDebugAutoAnswer } from "./use-debug-auto-answer";

export const KraeplinScreenWrapper = ({ slug }: { slug: string }) => {
  const {
    active,
    answer,
    currentColumn,
    indexColumn,
    totalColumn,
    count,
    onClickNumpad,
    undo,
    question,
  } = useKraeplinTestLogic(slug);

  // enable this only for debug mode
  useDebugAutoAnswer(true, question, onClickNumpad);

  return (
    <div className="relative flex h-[100dvh] w-full flex-col items-center justify-between">
      <KraeplinScreen
        header={{
          time: count,
          totalColumn,
          currentColumn: indexColumn,
        }}
        roller={{
          display: currentColumn,
          answer,
          up: active.indexUp,
          down: active.indexDown,
        }}
        numpad={{
          onClickUndo: undo,
          onClick: onClickNumpad,
        }}
      />
    </div>
  );
};
