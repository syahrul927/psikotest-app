"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSubtestTemplatesSummary } from "@/hooks/api/ist-settings/use-get-subtest-templates-summary";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { FileTextIcon, ClockIcon, SettingsIcon } from "lucide-react";

export function IstSettingsSummary() {
  const { data: summary, isLoading } = useGetSubtestTemplatesSummary();

  if (isLoading) {
    return <IstSettingsSummarySkeleton />;
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Template</CardTitle>
          <FileTextIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalTemplates}</div>
          <p className="text-xs text-muted-foreground">
            Template subtest tersedia
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Terakhir Diubah</CardTitle>
          <ClockIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {summary.lastModified 
              ? formatDistanceToNow(summary.lastModified.date, { 
                  addSuffix: true, 
                  locale: id 
                })
              : "Belum ada"
            }
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.lastModified 
              ? `Template: ${summary.lastModified.templateName}`
              : "Belum ada perubahan"
            }
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status Sistem</CardTitle>
          <SettingsIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">Aktif</div>
          <p className="text-xs text-muted-foreground">
            Semua template siap digunakan
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function IstSettingsSummarySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}