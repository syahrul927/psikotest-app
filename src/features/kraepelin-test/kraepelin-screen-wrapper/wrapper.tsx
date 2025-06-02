"use client";

import { KraepelinScreen } from "../kraepelin-screen/kraepelin-screen";
import { useDebugAutoAnswer } from "./use-debug-auto-answer";
import { useKraepelinTestLogic } from "./use-kraepelin-screen-test-logic";

export const KraepelinScreenWrapper = ({ slug }: { slug: string }) => {
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
  } = useKraepelinTestLogic(slug);

  // enable this only for debug mode
  useDebugAutoAnswer(true, question, onClickNumpad);

  return (
    <div className="relative flex h-[100dvh] w-full flex-col items-center justify-between">
      <KraepelinScreen
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
