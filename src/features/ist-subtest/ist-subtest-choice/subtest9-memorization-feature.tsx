import { Button } from "@/components/ui/button";
import { ClockAlert, Eye } from "lucide-react";
import React from "react";
import { useMemorizationTimer } from "@/hooks/use-memorization-timer";
import { useCheckSubtest9Access } from "@/hooks/api/ist-test/use-check-subtest9-access";
import { useMarkSubtest9Image } from "@/hooks/api/ist-test/use-mark-subtest9-image";
import { MemoizedTimerDisplay } from "./memoized-timer-display";
import { MemoizedImageContent } from "./memoized-image-content";

interface Subtest9MemorizationFeatureProps {
  subtestType: string;
  istInvitationId?: string;
}

export const Subtest9MemorizationFeature = React.memo(
  function Subtest9MemorizationFeature({
    subtestType,
    istInvitationId,
  }: Subtest9MemorizationFeatureProps) { 
    const { isMemorizing, timeLeft, formatTime, startTimer } =
      useMemorizationTimer();

    const [hasViewedImage, setHasViewedImage] = React.useState(false);

    // Check image access status for subtest 9
    const { data: imageAccessData, isLoading: isCheckingAccess } =
      useCheckSubtest9Access(istInvitationId || "", subtestType);

    const markImageViewedMutation = useMarkSubtest9Image(
      (data) => {
        setHasViewedImage(data.viewed);
        if (!data.alreadyMarked && data.success) {
          startTimer();
        }
      },
      () => {
        setHasViewedImage(true);
      },
    );

    React.useEffect(() => {
      if (imageAccessData) {
        setHasViewedImage(imageAccessData.viewed);
      }
    }, [imageAccessData]);

    const startMemorization = () => {
      if (
        isMemorizing ||
        hasViewedImage ||
        !istInvitationId ||
        subtestType !== "9"
      )
        return;

      markImageViewedMutation.mutate({
        istInvitationId: istInvitationId,
        subtestId: subtestType,
      });
    };
    if (subtestType !== "9") return null;

    return (
      <div className="space-y-3">
        {/* Loading states */}
        {isCheckingAccess && (
          <div className="text-muted-foreground text-sm">
            Memeriksa status gambar...
          </div>
        )}

        {markImageViewedMutation.isPending && (
          <div className="text-muted-foreground text-sm">
            Mencatat akses gambar...
          </div>
        )}

        {/* Action buttons */}
        {!hasViewedImage && !isMemorizing && (
          <Button
            variant="default"
            onClick={startMemorization}
            disabled={isMemorizing || markImageViewedMutation.isPending}
          >
            <Eye />
            Lihat gambar untuk dihafal
          </Button>
        )}

        {/* Already viewed message */}
        {!isMemorizing && hasViewedImage && (
          <span className="text-muted-foreground inline-flex align-middle text-sm">
            <ClockAlert className="mr-2" size={16} />
            Gambar sudah pernah dilihat - tidak dapat melihat kembali
          </span>
        )}

        {/* Show image during memorization */}
        {isMemorizing && (
          <div className="border-t pt-3">
            <div className="flex flex-col items-center space-y-3">
              <MemoizedTimerDisplay
                timeLeft={timeLeft}
                formatTime={formatTime}
                isMemorizing={isMemorizing}
              />
              <MemoizedImageContent
                isMemorizing={isMemorizing}
                imageSrc="/images/instruction/9.jpeg"
                alt="Gambar untuk dihafal"
              />
            </div>
          </div>
        )}
      </div>
    );
  },
);

Subtest9MemorizationFeature.displayName = "Subtest9MemorizationFeature";
