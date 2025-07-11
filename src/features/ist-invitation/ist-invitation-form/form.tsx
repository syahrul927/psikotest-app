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
import { useGetDetailIstInvitation } from "@/hooks/api/ist-invitation/use-get-detail-ist-invitation";
import { useSaveIstInvitation } from "@/hooks/api/ist-invitation/use-save-ist-invitation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useIstInvFormDialogController } from "./dialog-controller";
import { IstInvitationFormSkeleton } from "./form-skeleton";

const istInvFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  secretKey: z.string().min(3, { message: "Minimal 3 karakter" }),
});

type IstInvFormType = z.infer<typeof istInvFormSchema>;
const defaultValues: Partial<IstInvFormType> = {
  id: "",
  name: "",
  secretKey: "",
};

interface IstInvFormProps {
  onSuccessCallback: () => void;
}

export function IstInvitationForm({ onSuccessCallback }: IstInvFormProps) {
  const { open, setOpen, istInvitationId } = useIstInvFormDialogController();
  const isEditMode = Boolean(istInvitationId);

  // Fetch user detail if editing
  const { data: invitationDetail, isLoading: isLoadingInvitation } =
    useGetDetailIstInvitation(istInvitationId);

  const { mutate, isPending } = useSaveIstInvitation(() => {
    onSuccessCallback();
    setOpen(false);
  });

  const form = useForm<IstInvFormType>({
    resolver: zodResolver(istInvFormSchema),
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

  async function onSubmit(data: IstInvFormType) {
    mutate({
      ...data,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isLoadingInvitation ? (
        <IstInvitationFormSkeleton />
      ) : (
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Edit IST Invitation" : "Create IST Invitation"}
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
