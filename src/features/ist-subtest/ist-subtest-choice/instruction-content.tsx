import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { InteractiveExample } from "./interactive-example";
import { InteractiveExampleDataSchema } from "../types/interactive-instruction";

interface InstructionContentProps {
  instruction: string;
}

export const InstructionContent = React.memo(function InstructionContent({
  instruction,
}: InstructionContentProps) {
  return (
    <div className="rounded-lg border bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
      <article className="prose prose-pre:bg-transparent prose-pre:p-0 prose-sm dark:prose-invert prose-img:m-0 w-full text-left sm:max-w-7xl">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ node, ...props }) => (
              <img
                {...props}
                style={{
                  mixBlendMode: "multiply",
                  backgroundColor: "transparent",
                  maxWidth: "100%",
                }}
              />
            ),
            code: ({ node, className, children, ...props }) => {
              if (className === "language-json-interactive") {
                try {
                  const data = InteractiveExampleDataSchema.parse(
                    JSON.parse(children as string),
                  );
                  return <InteractiveExample data={data} />;
                } catch (error) {
                  console.warn("Failed to parse interactive JSON:", error);
                  return (
                    <code {...props} className={className}>
                      {children}
                    </code>
                  );
                }
              }
              return (
                <code {...props} className={className}>
                  {children}
                </code>
              );
            },
          }}
        >
          {instruction}
        </ReactMarkdown>
      </article>
    </div>
  );
});

InstructionContent.displayName = "InstructionContent";