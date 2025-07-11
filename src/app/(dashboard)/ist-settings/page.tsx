import { IstSubtestTemplateTable } from "@/features/ist-settings";

export default function IstSettings() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">IST Settings</h1>
          <p className="text-muted-foreground">
            Kelola template subtest IST - deskripsi, instruksi, dan batas waktu (menit)
          </p>
        </div>
        
        <IstSubtestTemplateTable />
      </div>
    </div>
  );
}
