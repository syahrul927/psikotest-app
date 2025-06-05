"use client";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { SectionCards } from "@/features/dashboard";
import { ChartActivity } from "@/features/dashboard/chart-activity";
import { toast } from "sonner";

export default function HomePage() {
  const showToast = () => {
    toast("Hello World", {
      description: "You are so cool. I love your skin",
    });
  };
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
