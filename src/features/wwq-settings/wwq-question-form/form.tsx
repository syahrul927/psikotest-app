"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateWwqQuestion } from "@/hooks/api/wwq-settings/use-update-wwq-question";
import { getWwqQuestionMeta } from "@/lib/wwq-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { WwqQuestionRow } from "../wwq-question-table/columns";

const formSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Teks soal harus diisi")
    .max(500, "Teks soal maksimal 500 karakter"),
});

type FormValues = z.infer<typeof formSchema>;

interface WwqQuestionFormProps {
  question: WwqQuestionRow;
  open: boolean;
  onClose: () => void;
}

export function WwqQuestionForm({
  question,
  open,
  onClose,
}: WwqQuestionFormProps) {
  const updateMutation = useUpdateWwqQuestion();
  const meta = getWwqQuestionMeta(question.order);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: question.description,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await updateMutation.mutateAsync({
        id: question.id,
        description: values.description,
      });
      onClose();
      form.reset();
    } catch {
      // Error is handled by the mutation's onError callback
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] w-full overflow-y-auto md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Soal WWQ No. {question.order}</DialogTitle>
          <DialogDescription>
            Ubah teks soal saja. Jawaban kunci, aspek, dan perhitungan skor
            tidak berubah.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Read-only identity of the question */}
            <div className="space-y-2">
              <label className="text-muted-foreground text-sm font-medium">
                Soal
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  No. {question.order}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  {meta.map((m) => m.aspectName).join(" + ")} — skor pada{" "}
                  {meta.map((m) => (m.inverted ? "TIDAK" : "YA")).join(" / ")}
                </span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teks Soal</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tulis teks soal..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={updateMutation.isPending}
              >
                Batal
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
