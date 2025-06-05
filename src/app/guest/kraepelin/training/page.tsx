"use client";
import { makeid } from "@/lib/string-utils";
import { useEffect, useState } from "react";
import { useCountdown } from "usehooks-ts";

import { KraepelinScreen } from "@/features/kraepelin-test";
import { useDisplay } from "@/hooks/use-display";
import type { RouterOutputs } from "@/trpc/react";
import { useTheme } from "next-themes";
import Joyride, {
  STATUS,
  type CallBackProps,
  type Step,
} from "react-joyride-react-19";

const generate = () => Math.floor(Math.random() * 9) + 1;
type Template = RouterOutputs["kraepelinTest"]["getTemplate"];

const steps: Step[] = [
  {
    content: "Mulai Latihan",
    placement: "center",
    target: "body",
  },
  {
    content: "Total Baris Kraepelin",
    spotlightPadding: 5,
    target: ".label-row",
  },
  {
    content: "Waktu per baris",
    spotlightPadding: 5,
    target: ".time-per-row",
  },
  {
    content: "Soal Kraepelin akan bergerak dari bawah ke atas",
    spotlightPadding: 5,
    target: ".question-wrapper",
  },
  {
    content: "Angka yang perlu dihitung",
    spotlightPadding: 5,
    target: ".question",
  },
  {
    content: "Jawaban yang kamu berikan ",
    spotlightPadding: 5,
    target: ".answer",
  },
  {
    content: "Keyboard untuk menjawab",
    spotlightPadding: 5,
    target: ".keyboard",
  },
  {
    content:
      "Hapus/kembali urutan sebelum nya (hanya bisa dilakukan 1x mundur setelah 2x maju)",
    spotlightPadding: 5,
    target: ".keyboard-backspace",
  },
];

const TrainingPage = () => {
  const { theme } = useTheme();
  const [data, setData] = useState<Template>(
    Array.from({ length: 61 * 40 }).map((_, idx) => {
      const index = idx + 1;
      const x = Math.floor(index / 62);
      const y = index % 61;
      return {
        id: `${idx}-${generate()}-${makeid(4)}`,
        value: generate(),
        x: x + 1,
        y: y === 0 ? 61 : y,
        version: "version-1",
      };
    }),
  );

  const [finish, setFinish] = useState(false);
  const [activeUndo, setActiveUndo] = useState(2);
  const { setArray, currentColumn, nextColumn, totalColumn, indexColumn } =
    useDisplay();
  const [answer, setAnswer] = useState<number | undefined>();
  const [question, setQuestion] = useState({ a: 0, b: 0 });
  const [active, setActive] = useState({ indexUp: 0, indexDown: 0 });
  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 30,
    intervalMs: 1000,
  });

  const [run, setRun] = useState(false);

  useEffect(() => {
    if (data.length) {
      setArray(data);
    }
  }, [data]);

  useEffect(() => {
    if (currentColumn.length) {
      setActive({
        indexDown: currentColumn.length - 1,
        indexUp: currentColumn.length - 2,
      });
    }
  }, [currentColumn]);

  useEffect(() => {
    if (active.indexDown === 0 && active.indexUp === 0) return;
    setQuestion({
      a: currentColumn[active.indexUp]?.value ?? 0,
      b: currentColumn[active.indexDown]?.value ?? 0,
    });
  }, [active]);

  useEffect(() => {
    if (count === 0 && indexColumn < totalColumn) {
      nextColumn();
      resetCountdown();
    }
  }, [count]);

  const disableUndo = () => {
    if (activeUndo < 2) {
      setActiveUndo((prev) => prev + 1);
    }
  };

  const onClickNumpad = (num: number) => {
    if (active.indexUp !== 0) {
      setActive({
        indexUp: active.indexUp - 1,
        indexDown: active.indexDown - 1,
      });
      disableUndo();
      setAnswer(num);
    }
  };

  const undo = () => {
    if (activeUndo === 2 && active.indexDown !== currentColumn.length - 1) {
      setActiveUndo(0);
      setActive({
        indexDown: active.indexDown + 1,
        indexUp: active.indexUp + 1,
      });
    }
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setFinish(true);
      setRun(false);
    }
  };

  useEffect(() => {
    setRun(true);
  }, []);

  useEffect(() => {
    if (finish) {
      startCountdown?.();
    }
  }, [finish]);

  return (
    <div className="relative flex h-[100dvh] w-full flex-col items-center justify-between">
      {run && (
        <Joyride
          callback={handleJoyrideCallback}
          continuous
          hideCloseButton
          run={run}
          scrollToFirstStep
          showSkipButton
          steps={steps}
          styles={{
            options: {
              arrowColor: "var(--background)",
              backgroundColor: "var(--background)",
              overlayColor:
                theme === "light"
                  ? "rgba(0, 0, 0, 0.5)"
                  : "rgba(180, 180, 180, 0.5)",
              primaryColor: "var(--primary)",
              textColor: "var(--foreground)",
              zIndex: 10000, // ShadCN often uses 50–60 for popups
              width: 400,
            },
            tooltipContainer: {
              textAlign: "left",
              fontFamily: "var(--font-sans)",
              borderColor: "var(--primary)",
            },
            tooltip: {
              padding: "1rem",
              borderRadius: "0.75rem",
              // border: "1px solid",
              boxShadow:
                "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
            },
            buttonNext: {
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              borderRadius: "0.5rem",
              padding: "0.5rem 1rem",
            },
            buttonBack: {
              marginRight: "0.5rem",
              color: "var(--muted-foreground)",
              background: "transparent",
            },
            buttonSkip: {
              background: "transparent",
              color: "var(--muted-foreground)",
            },
          }}
        />
      )}

      <KraepelinScreen
        header={{
          runTutor: () => setRun(true),
          tourMode: true,
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

export default TrainingPage;
