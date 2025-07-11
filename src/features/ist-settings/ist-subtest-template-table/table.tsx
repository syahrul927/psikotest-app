"use client";

import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { useGetAllSubtestTemplates } from "@/hooks/api/ist-settings/use-get-all-subtest-templates";
import { useState } from "react";
import { columns, type SubtestTemplate } from "./columns";
import { IstSubtestTemplateForm } from "../ist-subtest-template-form";

export function IstSubtestTemplateTable() {
  const { data: templates, isLoading } = useGetAllSubtestTemplates();
  const [editingTemplate, setEditingTemplate] = useState<SubtestTemplate | null>(null);

  const handleEdit = (template: SubtestTemplate) => {
    setEditingTemplate(template);
  };

  const handleCloseEdit = () => {
    setEditingTemplate(null);
  };

  if (isLoading) {
    return <DataTableSkeleton />;
  }

  if (!templates) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-muted-foreground">Tidak ada data template subtest</p>
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={templates}
        meta={{
          onEdit: handleEdit,
        }}
        enablePagination={false}
      />
      
      {editingTemplate && (
        <IstSubtestTemplateForm
          template={editingTemplate}
          open={!!editingTemplate}
          onClose={handleCloseEdit}
        />
      )}
    </>
  );
}