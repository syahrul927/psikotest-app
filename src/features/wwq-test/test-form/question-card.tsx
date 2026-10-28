"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { WwqTestQuestionType } from "./schema";

interface QuestionCardProps {
  question: WwqTestQuestionType;
  selected?: boolean; // true=YA, false=TIDAK, undefined=unanswered
  onSelect: (answer: boolean) => void;
  questionNumber: number;
}

const WwqQuestionCard = ({
  question,
  selected,
  onSelect,
  questionNumber,
}: QuestionCardProps) => {
  const options: { label: string; value: boolean }[] = [
    { label: "YA", value: true },
    { label: "TIDAK", value: false },
  ];
  return (
    <Card className="bg-background border-border space-y-4 p-6">
      <div className="text-muted-foreground text-sm font-medium">
        Pertanyaan {questionNumber}
      </div>
      <div className="text-foreground">{question.description}</div>
      <div className="space-y-4">
        {options.map((option) => (
          <motion.button
            key={option.label}
            onClick={() => onSelect(option.value)}
            className={cn(
              "w-full rounded-lg border-2 p-4 text-left transition-all duration-200",
              "hover:border-primary/50 hover:bg-accent/50",
              selected === option.value
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border bg-background",
            )}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2",
                  selected === option.value
                    ? "border-primary bg-primary"
                    : "border-muted-foreground",
                )}
              >
                {selected === option.value && (
                  <Check className="text-primary-foreground h-3 w-3" />
                )}
              </div>
              <div className="text-foreground font-medium">{option.label}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </Card>
  );
};

export default WwqQuestionCard;
