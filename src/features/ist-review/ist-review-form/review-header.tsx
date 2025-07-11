"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useReviewForm } from "@/hooks/use-review-form-context";
import { useCompleteReview } from "@/hooks/api/ist-review/use-complete-review";
import { PAGE_URLS } from "@/lib/page-url";
import { MessageCircleWarningIcon, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const IstReviewHeader = ({ slug }: { slug: string }) => {
  const { unTouchedFourthForm } = useReviewForm();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const completeReviewMutation = useCompleteReview();

  const handleCompleteReview = async () => {
    try {
      await completeReviewMutation.mutateAsync(slug);
      setIsDialogOpen(false);
      router.push(PAGE_URLS.IST_INVITATION_RESULT(slug));
    } catch (error) {
      // Error is handled by the mutation's onError callback
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-end space-y-3">
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            className="w-fit"
            disabled={unTouchedFourthForm || completeReviewMutation.isPending}
            onClick={() => setIsDialogOpen(true)}
          >
            {completeReviewMutation.isPending ? "Menyimpan..." : "Simpan"}
            <Save className="ml-2" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Apakah kamu yakin ingin melanjutkan?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Data yang sudah disimpan tidak dapat diubah kembali!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCompleteReview}
              disabled={completeReviewMutation.isPending}
            >
              {completeReviewMutation.isPending ? "Menyimpan..." : "Lanjutkan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {unTouchedFourthForm && (
        <Alert className="w-full" variant={"destructive"}>
          <MessageCircleWarningIcon className="h-4 w-4" />
          <AlertTitle>Perhatian</AlertTitle>
          <AlertDescription className="text-muted">
            Subtest 4 Belum dikoreksi!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
