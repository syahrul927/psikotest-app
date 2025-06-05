import { useEffect, useState } from "react";
import { useCountdown } from "usehooks-ts";
import { useAccessInvitation } from "@/hooks/use-access-invitation-kraepelin";
import { useGetLatestKraepelin } from "@/hooks/api/kraepelin-test/use-get-latest-kraepelin";
import { useGetTemplateKraepelin } from "@/hooks/api/kraepelin-test/use-get-template-kraepelin";
import { useSubmitAnswerKraepelin } from "@/hooks/api/kraepelin-test/use-submit-answer-kraepelin";
import { useDisplay } from "@/hooks/use-display";
import { useRouter } from "next/navigation";
import { PAGE_URLS } from "@/lib/page-url";
import { toast } from "sonner";

export const useKraepelinTestLogic = (slug: string) => {
  const router = useRouter();
  const { access, id } = useAccessInvitation();
  const { refetch: fetchLatest, data: latest } = useGetLatestKraepelin(
    slug,
    id,
  );
  const { data: templateData, refetch: fetchTemplate } =
    useGetTemplateKraepelin();
  const { setArray, currentColumn, indexColumn, nextColumn, totalColumn } =
    useDisplay();
  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 30,
    intervalMs: 1000,
  });

  const [answer, setAnswer] = useState<number>();
  const [activeUndo, setActiveUndo] = useState(2);
  const [active, setActive] = useState({ indexUp: 0, indexDown: 0 });
  const [question, setQuestion] = useState({ a: 0, b: 0 });

  const { mutate } = useSubmitAnswerKraepelin();

  const disableUndo = () => {
    if (activeUndo < 2) setActiveUndo(activeUndo + 1);
  };

  const undo = () => {
    if (activeUndo === 2 && active.indexDown !== currentColumn.length - 1) {
      setActiveUndo(0);
      setActive((prev) => ({
        indexUp: prev.indexUp + 1,
        indexDown: prev.indexDown + 1,
      }));
    }
  };

  const onClickNumpad = (input: number) => {
    if (active.indexUp !== 0) {
      mutate({
        value: input,
        xA: indexColumn,
        yA: active.indexUp + 1,
        xB: indexColumn,
        yB: active.indexDown + 1,
        a: question.a,
        b: question.b,
        id: id ?? "",
      });
      setActive((prev) => ({
        indexUp: prev.indexUp - 1,
        indexDown: prev.indexDown - 1,
      }));
      disableUndo();
      setAnswer(input);
    }
  };

  // side effects
  useEffect(() => {
    if (access) {
      void fetchLatest();
      void fetchTemplate();
    } else {
      router.push(PAGE_URLS.KRAEPELIN_TEST_CONFIRMATION(slug));
    }
  }, [access]);

  useEffect(() => {
    if (templateData?.length) {
      setArray(templateData);
    }
  }, [templateData]);

  useEffect(() => {
    if (latest?.latest?.y) {
      setActive({
        indexUp: latest.latest.y - 2,
        indexDown: latest.latest.y - 1,
      });
    }
  }, [latest]);

  useEffect(() => {
    if (currentColumn.length) {
      setActive({
        indexDown: currentColumn.length - 1,
        indexUp: currentColumn.length - 2,
      });
      startCountdown();
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
    if (count === 0) {
      if (indexColumn < totalColumn) {
        nextColumn();
        resetCountdown();
      } else {
        toast.success("Yeay 🎉🎉🎉", {
          description: "Kamu berhasil menyelesaikannya..",
        });
        router.push(PAGE_URLS.KRAEPELIN_THANKS);
      }
    }
  }, [count]);

  return {
    active,
    answer,
    currentColumn,
    indexColumn,
    totalColumn,
    count,
    onClickNumpad,
    undo,
    question,
  };
};
