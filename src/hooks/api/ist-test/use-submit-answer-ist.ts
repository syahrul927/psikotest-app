import { api, type RouterOutputs } from "@/trpc/react";
import { toast } from "sonner";

export type CompletionSubtestResponseType =
  RouterOutputs["istSubtest"]["submitIstAnswers"];

export const useSubmitIstAnswers = () => {
  return api.istSubtest.submitIstAnswers.useMutation({
    onSuccess: () => {
      toast.success("Jawaban berhasil disimpan!", {
        description:
          "Jawaban Anda telah berhasil disimpan. Silakan lanjutkan ke pertanyaan berikutnya atau periksa kembali jawaban Anda.",
      });
    },
    onError: () => {
      toast.error("Gagal menyimpan jawaban. Silakan coba lagi.", {
        description:
          "Terjadi kesalahan saat menyimpan jawaban Anda. Mohon periksa koneksi internet Anda atau coba beberapa saat lagi.",
      });
    },
  });
};
