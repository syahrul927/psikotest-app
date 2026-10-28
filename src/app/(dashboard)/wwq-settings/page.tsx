import { redirect } from "next/navigation";

import { WwqQuestionTable } from "@/features/wwq-settings";
import { wwqSettingsEnabled } from "@/lib/feature-flags";
import { PAGE_URLS } from "@/lib/page-url";

export default function WwqSettings() {
  if (!wwqSettingsEnabled) {
    redirect(PAGE_URLS.HOME);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">WWQ Settings</h1>
          <p className="text-muted-foreground">
            Kelola teks soal WWQ. Jumlah soal, urutan, dan perhitungan skor
            tetap.
          </p>
        </div>

        <WwqQuestionTable />
      </div>
    </div>
  );
}
