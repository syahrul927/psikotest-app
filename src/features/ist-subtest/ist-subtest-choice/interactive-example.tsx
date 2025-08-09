"use client";

import Image from "next/image";
import { useState } from "react";
import { getTestComponentByType } from "../ist-test-page/ist-test-question-wrapper";
import type { InteractiveExampleData } from "../types/interactive-instruction";
import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
  VideoPlayerVolumeRange,
} from "@/components/ui/video-player";

interface InteractiveExampleProps {
  data: InteractiveExampleData;
}

export function InteractiveExample({ data }: InteractiveExampleProps) {
  const [selectedValue, setSelectedValue] = useState<string | number[]>(
    `${data.question.id}-${data.correctAnswer}` as string | number[],
  );

  const QuestionComponent = getTestComponentByType(data.subtestType);

  const handleChange = (value: string | number[]) => {
    setSelectedValue(value);
  };

  return (
    <div className="space-y-4">
      {data.question.video && (
        <VideoPlayer className="overflow-hidden rounded-lg border">
          <VideoPlayerContent
            crossOrigin=""
            preload="auto"
            slot="media"
            src={data.question.video}
          />
          <VideoPlayerControlBar>
            <VideoPlayerPlayButton />
            <VideoPlayerSeekBackwardButton />
            <VideoPlayerSeekForwardButton />
            <VideoPlayerTimeRange />
            <VideoPlayerTimeDisplay showDuration />
            <VideoPlayerMuteButton />
            <VideoPlayerVolumeRange />
          </VideoPlayerControlBar>
        </VideoPlayer>
      )}
      <div className="interactive-example bg-background text-foreground rounded-lg border p-4">
        {/* Question Display following ist-test-question-wrapper patterns */}
        <div className="text-wrap">
          {/* Question Text - Hide for number-selection type */}
          {!(data.subtestType === "5" || data.subtestType === "6") && (
            <p className="mb-4 text-sm leading-relaxed font-medium sm:mb-6">
              {data.question.text}
            </p>
          )}

          {/* Image Display */}
          {data.question.text === "" && data.question.imageUrl && (
            <div className="flex w-full justify-center">
              <Image
                src={`/api/images/${data.question.imageUrl}`}
                alt="Question example"
                width={150}
                height={150}
                className="mb-6 rounded-lg border-2 dark:invert"
              />
            </div>
          )}

          {/* Number selection shows question text separately */}
          {(data.subtestType === "5" || data.subtestType === "6") && (
            <p className="mb-4 text-lg leading-relaxed font-medium sm:mb-6 sm:text-xl">
              {data.question.text}
            </p>
          )}

          {/* Interactive Question Component */}
          <div className="border-b pb-6 last:border-b-0">
            <QuestionComponent
              question={{
                id: data.question.id,
                question: data.question.text || "",
                text: data.question.text || "",
                subtestTemplateId: data.subtestType,
                options: (data.question.options || []).map((option) => ({
                  optionLabel: `${option.id})`,
                  id: `${data.question.id}-${option.id}`,
                  text: option.text || option.label || "",
                  imageUrl: option.imageUrl || undefined,
                })),
              }}
              value={selectedValue as string & number[]}
              onChange={handleChange}
              isTraining={true}
              {...(data.subtestType === "5" || data.subtestType === "6"
                ? { questionNumber: 1, totalQuestions: 1 }
                : {})}
            />
          </div>

          {/* Feedback Section */}
          <div className="space-y-2 pt-4">
            {data.correctAnswer && (
              <div className="rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Jawaban benar: <strong>{data.correctAnswer}</strong>
                </p>
              </div>
            )}

            {data.explanation && (
              <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-wrap dark:border-gray-700 dark:bg-gray-900/20">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {data.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
