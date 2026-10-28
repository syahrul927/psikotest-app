"use client";

import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { useGetWwqQuestions } from "@/hooks/api/wwq-settings/use-get-wwq-questions";
import { useState } from "react";
import { columns, type WwqQuestionRow } from "./columns";
import { WwqQuestionForm } from "../wwq-question-form";

export function WwqQuestionTable() {
  const { data: questions, isLoading } = useGetWwqQuestions();
  const [editingQuestion, setEditingQuestion] = useState<WwqQuestionRow | null>(
    null,
  );

  const handleEdit = (question: WwqQuestionRow) => {
    setEditingQuestion(question);
  };

  const handleCloseEdit = () => {
    setEditingQuestion(null);
  };

  if (isLoading) {
    return <DataTableSkeleton />;
  }

  if (!questions) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-muted-foreground">
          Tidak ada soal WWQ. Jalankan seed terlebih dahulu.
        </p>
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={questions}
        meta={{
          onEdit: handleEdit,
        }}
        enablePagination
      />

      {editingQuestion && (
        <WwqQuestionForm
          question={editingQuestion}
          open={!!editingQuestion}
          onClose={handleCloseEdit}
        />
      )}
    </>
  );
}
