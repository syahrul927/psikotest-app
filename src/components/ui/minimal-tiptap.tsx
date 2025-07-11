"use client";

import MDEditor from "@uiw/react-md-editor";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  height?: number;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write something...",
  className,
  height = 300,
}: MarkdownEditorProps) {
  const { theme } = useTheme();
  // Convert HTML content to markdown if needed
  const formatContent = (content: string) => {
    if (!content) return "";

    // Check if content is HTML (contains HTML tags)
    const hasHtmlTags = /<[^>]*>/g.test(content);

    if (hasHtmlTags) {
      // Simple HTML to markdown conversion for basic cases
      const markdown = content
        .replace(/<p>/g, "")
        .replace(/<\/p>/g, "\n\n")
        .replace(/<br\s*\/?>/g, "\n")
        .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
        .replace(/<b>(.*?)<\/b>/g, "**$1**")
        .replace(/<em>(.*?)<\/em>/g, "*$1*")
        .replace(/<i>(.*?)<\/i>/g, "*$1*")
        .replace(/<h1>(.*?)<\/h1>/g, "# $1\n")
        .replace(/<h2>(.*?)<\/h2>/g, "## $1\n")
        .replace(/<h3>(.*?)<\/h3>/g, "### $1\n")
        .replace(/<ul>/g, "")
        .replace(/<\/ul>/g, "")
        .replace(/<li>(.*?)<\/li>/g, "- $1\n")
        .replace(/<ol>/g, "")
        .replace(/<\/ol>/g, "")
        .replace(/<blockquote>(.*?)<\/blockquote>/g, "> $1\n")
        .trim();

      return markdown;
    }

    return content;
  };

  const handleChange = (val?: string) => {
    onChange(val || "");
  };

  return (
    <div className={cn("w-full", className)}>
      <MDEditor
        value={formatContent(value)}
        onChange={handleChange}
        height={height}
        data-color-mode={theme === "dark" ? "dark" : "light"}
        textareaProps={{
          placeholder,
          style: {
            fontSize: 14,
            lineHeight: 1.5,
          },
        }}
      />
    </div>
  );
}
