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
import { useGetDetailKraeplinInvitation } from "@/hooks/api/kraeplin-invitation/use-get-detail-kraeplin-invitation";
import { useSaveKraeplinInvitation } from "@/hooks/api/kraeplin-invitation/use-save-kraeplin-invitation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useKraeplinInvFormDialogController } from "./kraeplin-invitation-dialog-controller";
import { KraeplinInvitationFormSkeleton } from "./kraeplin-invitation-form-skeleton";
import { toast } from "sonner";

const kraeplinInvFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  secretKey: z.string().min(3, { message: "Minimal 3 karakter" }),
});

type KraeplinInvFormType = z.infer<typeof kraeplinInvFormSchema>;
const defaultValues: Partial<KraeplinInvFormType> = {
  id: "",
  name: "",
  secretKey: "",
};

interface KraeplinInvFormProps {
  onSuccessCallback: () => void;
}

export function KraeplinInvitationForm({
  onSuccessCallback,
}: KraeplinInvFormProps) {
  const { open, setOpen, kraeplinInvitationId } =
    useKraeplinInvFormDialogController();
  const isEditMode = Boolean(kraeplinInvitationId);

  // Fetch user detail if editing
  const { data: invitationDetail, isLoading: isLoadingInvitation } =
    useGetDetailKraeplinInvitation(kraeplinInvitationId);

  const { mutate, isPending } = useSaveKraeplinInvitation(() => {
    onSuccessCallback();
    setOpen(false);
  });

  const form = useForm<KraeplinInvFormType>({
    resolver: zodResolver(kraeplinInvFormSchema),
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

  async function onSubmit(data: KraeplinInvFormType) {
    mutate({
      ...data,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isLoadingInvitation ? (
        <KraeplinInvitationFormSkeleton />
      ) : (
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode
                    ? "Edit Invitation Kraeplin"
                    : "Create Invitation Kraeplin"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col space-y-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
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
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
}
