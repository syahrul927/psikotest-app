"use client";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { toast } from "sonner";

export default function HomePage() {
  const showToast = () => {
    toast("Hello World", {
      description: "You are so cool. I love your skin",
    });
  };
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="w-fit space-x-3">
        <Button onClick={showToast}>Sonner</Button>
        <ModeToggle />
      </div>
    </div>
  );
}
