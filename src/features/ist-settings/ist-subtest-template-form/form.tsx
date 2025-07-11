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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useUpdateSubtestTemplate } from "@/hooks/api/ist-settings/use-update-subtest-template";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MarkdownEditor } from "@/components/ui/minimal-tiptap";

const formSchema = z.object({
  description: z.string().min(1, "Deskripsi harus diisi"),
  instruction: z.string().min(1, "Instruksi harus diisi"),
  timeLimit: z.number().min(1, "Batas waktu minimal 1 menit"),
});

type FormValues = z.infer<typeof formSchema>;

interface SubtestTemplate {
  id: string;
  name: string;
  description: string;
  instruction: string | null;
  timeLimit: number;
}

interface IstSubtestTemplateFormProps {
  template: SubtestTemplate;
  open: boolean;
  onClose: () => void;
}

export function IstSubtestTemplateForm({
  template,
  open,
  onClose,
}: IstSubtestTemplateFormProps) {
  const updateMutation = useUpdateSubtestTemplate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: template.description,
      instruction: template.instruction ?? "",
      timeLimit: template.timeLimit,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await updateMutation.mutateAsync({
        id: template.id,
        description: values.description,
        instruction: values.instruction,
        timeLimit: values.timeLimit,
      });
      onClose();
      form.reset();
    } catch (error) {
      // Error is handled by the mutation's onError callback
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] w-full overflow-y-auto md:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Edit Template Subtest</DialogTitle>
          <DialogDescription>
            Ubah deskripsi, instruksi, dan batas waktu untuk subtest
            {template.name}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Read-only name field */}
            <div className="space-y-2">
              <label className="text-muted-foreground text-sm font-medium">
                Nama Subtest
              </label>
              <div>
                <Badge variant="outline" className="font-mono">
                  {template.name}
                </Badge>
              </div>
            </div>

            {/* Editable fields */}
            <FormField
              control={form.control}
              name="timeLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batas Waktu (menit)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan batas waktu dalam menit..."
                      min={1}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan deskripsi subtest..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instruction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instruksi</FormLabel>
                  <FormControl>
                    <MarkdownEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Masukkan instruksi untuk peserta tes..."
                      height={300}
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
