"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { SUBTEST_IDS } from "../lib/ist-constants";
import Image from "next/image";

interface Option {
  id: string;
  optionLabel?: string;
  text: string;
  imageUrl?: string | null;
}

interface QuestionProps {
  question: {
    id: string;
    question: string;
    subtestTemplateId: string;
    options: Option[];
  };
  value: string;
  onChange: (value: string) => void;
}

export function RadioQuestion({ question, value, onChange }: QuestionProps) {
  const isImage = SUBTEST_IDS.IMAGE_BASED.map(String).includes(
    question.subtestTemplateId,
  );
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className={cn(
        "flex p-3",
        !isImage && "flex-col",
        isImage && "flex-wrap items-center justify-between",
      )}
    >
      {question.options.map((option) => (
        <div
          key={option.id}
          className={cn(
            "rounded-md border p-3",
            isImage &&
            "h-auto w-fit flex-col items-center justify-center p-3 dark:bg-black",
            "cursor-pointer",
          )}
        >
          <Label
            htmlFor={option.id}
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center"
          >
            {option.imageUrl && (
              <div className="relative aspect-square h-auto w-20 sm:w-24 md:w-40 dark:invert">
                <Image
                  src={option.imageUrl}
                  alt={`Question ${question.id + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div
              className={cn(
                "flex w-full items-center gap-4",
                isImage && "gap-0",
              )}
            >
              <div
                className={cn(
                  "flex w-fit items-center justify-start",
                  isImage && "flex w-full items-center justify-center",
                )}
              >
                <RadioGroupItem value={option.id} id={option.id} />
              </div>
              <span
                className={`flex-grow text-sm sm:text-base ${question.subtestTemplateId === "7" || (question.subtestTemplateId === "8" && "hidden")}`}
              >
                {option.text}
              </span>
            </div>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
