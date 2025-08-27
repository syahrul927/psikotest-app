"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { PapiKostickTestQuestionType } from "./schema";

interface QuestionCardProps {
  question: PapiKostickTestQuestionType;
  selectedOption?: "A" | "B";
  onSelect: (option: "A" | "B") => void;
  questionNumber: number;
}

const PapiKostickQuestionCard = ({
  question,
  selectedOption,
  onSelect,
  questionNumber,
}: QuestionCardProps) => {
  return (
    <Card className="bg-background border-border space-y-4 p-6">
      <div className="text-muted-foreground text-sm font-medium">
        Pertanyaan {questionNumber}
      </div>

      <div className="space-y-4">
        <motion.button
          onClick={() => onSelect("A")}
          className={cn(
            "w-full rounded-lg border-2 p-4 text-left transition-all duration-200",
            "hover:border-primary/50 hover:bg-accent/50",
            selectedOption === "A"
              ? "border-primary bg-primary/10 shadow-sm"
              : "border-border bg-background",
          )}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2",
                selectedOption === "A"
                  ? "border-primary bg-primary"
                  : "border-muted-foreground",
              )}
            >
              {selectedOption === "A" && (
                <Check className="text-primary-foreground h-3 w-3" />
              )}
            </div>
            <div>
              <div className="text-muted-foreground mb-1 text-sm font-medium">
                Pilihan A
              </div>
              <div className="text-foreground">{question.descriptionA}</div>
            </div>
          </div>
        </motion.button>

        <motion.button
          onClick={() => onSelect("B")}
          className={cn(
            "w-full rounded-lg border-2 p-4 text-left transition-all duration-200",
            "hover:border-primary/50 hover:bg-accent/50",
            selectedOption === "B"
              ? "border-primary bg-primary/10 shadow-sm"
              : "border-border bg-background",
          )}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2",
                selectedOption === "B"
                  ? "border-primary bg-primary"
                  : "border-muted-foreground",
              )}
            >
              {selectedOption === "B" && (
                <Check className="text-primary-foreground h-3 w-3" />
              )}
            </div>
            <div>
              <div className="text-muted-foreground mb-1 text-sm font-medium">
                Pilihan B
              </div>
              <div className="text-foreground">{question.descriptionB}</div>
            </div>
          </div>
        </motion.button>
      </div>
    </Card>
  );
};

export default PapiKostickQuestionCard;
