import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { useGetDetailKraepelinInvitation } from "@/hooks/api/kraepelin-invitation/use-get-detail-kraepelin-invitation";
import { useSaveKraepelinInvitation } from "@/hooks/api/kraepelin-invitation/use-save-kraepelin-invitation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { KraepelinInvitationFormSkeleton } from "./form-skeleton";
import { useKraepelinInvFormDialogController } from "./dialog-controller";

const kraepelinInvFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  secretKey: z.string().min(3, { message: "Minimal 3 karakter" }),
});

type KraepelinInvFormType = z.infer<typeof kraepelinInvFormSchema>;
const defaultValues: Partial<KraepelinInvFormType> = {
  id: "",
  name: "",
  secretKey: "",
};

interface KraepelinInvFormProps {
  onSuccessCallback: () => void;
}

export function KraepelinInvitationForm({
  onSuccessCallback,
}: KraepelinInvFormProps) {
  const { open, setOpen, kraepelinInvitationId } =
    useKraepelinInvFormDialogController();
  const isEditMode = Boolean(kraepelinInvitationId);

  // Fetch user detail if editing
  const { data: invitationDetail, isLoading: isLoadingInvitation } =
    useGetDetailKraepelinInvitation(kraepelinInvitationId);

  const { mutate, isPending } = useSaveKraepelinInvitation(() => {
    onSuccessCallback();
    setOpen(false);
  });

  const form = useForm<KraepelinInvFormType>({
    resolver: zodResolver(kraepelinInvFormSchema),
    defaultValues,
    mode: "onSubmit",
  });

  // Load user data into form when userDetail is fetched
  useEffect(() => {
    if (invitationDetail && isEditMode) {
      form.reset({
        id: invitationDetail.id,
        name: invitationDetail.name ?? undefined,
        secretKey: invitationDetail.secretKey,
      });
    }
  }, [invitationDetail, isEditMode, form]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
    }
  }, [open]);

  async function onSubmit(data: KraepelinInvFormType) {
    mutate({
      ...data,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>
                {isEditMode
                  ? "Ubah Undangan Tes Kraepelin"
                  : "Buat Undangan Tes Kraepelin"}
              </DialogTitle>
            </DialogHeader>

            {isLoadingInvitation ? (
              <KraepelinInvitationFormSkeleton />
            ) : (
              <>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col space-y-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Klien</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="secretKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secret Key</FormLabel>
                          <FormControl>
                            <Input placeholder="Secret Key" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" isLoading={isPending}>
                    Simpan
                  </Button>
                </DialogFooter>
              </>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
