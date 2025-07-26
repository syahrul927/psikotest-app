"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { useGetAllSubtest } from "@/hooks/api/ist-test/use-get-all-subtest";
import { useGetSubtestSession } from "@/hooks/api/ist-test/use-get-subtest-session";
import { useUpdateSession } from "@/hooks/api/ist-test/use-update-session";
import { PAGE_URLS } from "@/lib/page-url";
import { BookOpen, CheckCircle, CheckCircle2, Clock, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ParticipantInfo } from "./participant-info";
import ConfirmationDialog from "./confirmation-dialog";

export function IstSubtests({ id }: { id: string }) {
  const [completedSubtests, setCompletedSubtests] = useState<string[]>([]);
  const { data: subtestist } = useGetAllSubtest();
  const { data: subtestSession } = useGetSubtestSession(id);
  const { mutateAsync: updateStartSession } = useUpdateSession();
  const router = useRouter();

  const handleUpdateStartedTest = async (
    istInvitationId: string,
    type: string,
  ) => {
    await updateStartSession({
      isInvitationId: istInvitationId,
      subtest: type,
    });
    void router.push(PAGE_URLS.IST_SUBTEST_TEST(istInvitationId, type));
  };

  useEffect(() => {
    if (subtestSession?.length) {
      setCompletedSubtests(
        subtestSession
          .filter((item) => item.startedAt)
          .map((item) => item.subtestTemplateId),
      );
    }
  }, [subtestSession]);

  return (
    <div className="bg-sidebar min-h-screen space-y-3">
      <div className="bg-background/80 sticky top-0 z-50 border-b shadow-sm backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Logo />
        </div>
      </div>
      <div className="mx-auto max-w-7xl space-y-3 px-4">
        <ParticipantInfo slug={id} />

        {/* Subtests Grid */}
        <div className="mb-12 grid grid-cols-1 items-center justify-center gap-3 md:grid-cols-2 xl:grid-cols-4">
          {subtestist?.map((subtest) => {
            const isCompleted = completedSubtests.includes(subtest.id);

            return (
              <Card
                key={subtest.id}
                className={`relative w-full transition-all hover:shadow-lg ${
                  isCompleted
                    ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/30"
                    : "hover:shadow-md dark:hover:shadow-lg"
                }`}
              >
                {/* Completion Badge */}
                {isCompleted && (
                  <div className="absolute top-4 right-4">
                    <Badge className="rounded-full bg-emerald-600/10 text-emerald-500 shadow-none hover:bg-emerald-600/10 dark:bg-emerald-600/20">
                      <CheckCircle className="h-4 w-4" />
                      <span>Selesai</span>
                    </Badge>
                  </div>
                )}

                <CardHeader className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <CardTitle>{subtest.name}</CardTitle>
                    <CardDescription>{subtest.description}</CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-3 text-sm">
                  <div className="text-muted-foreground flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{subtest.timeLimit} menit</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{subtest._count.questions} pertanyaan</span>
                    </div>
                  </div>

                  <div className="flex w-full space-x-1">
                    {isCompleted ? (
                      <Button
                        disabled
                        className="w-full cursor-not-allowed bg-emerald-600 dark:bg-emerald-400"
                      >
                        <Play className="h-4 w-4" />
                        <span>Mulai Subtes</span>
                      </Button>
                    ) : (
                      <ConfirmationDialog
                        onConfirm={() =>
                          handleUpdateStartedTest(id, subtest.id)
                        }
                        instruction={subtest.instruction}
                        videos={subtest.videos}
                        informationData={{
                          name: subtest.name,
                          description: subtest.description,
                          duration: subtest.timeLimit,
                          totalQuestion: subtest._count.questions,
                        }}
                      >
                        <Button className="w-full">
                          <Play className="h-4 w-4" />
                          <span>Mulai Test</span>
                        </Button>
                      </ConfirmationDialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Completion Message */}
        {completedSubtests.length === subtestist?.length && (
          <div className="text-center">
            <div className="bg-background inline-flex items-center gap-3 rounded-xl px-8 py-4 shadow-md">
              <CheckCircle2 className="h-6 w-6" />
              <span className="text-lg font-bold">
                Selamat! Anda telah menyelesaikan semua subtes!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
