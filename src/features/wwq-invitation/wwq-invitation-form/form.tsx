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
import { useGetDetailWwqInvitation } from "@/hooks/api/wwq-invitation/use-get-detail-wwq-invitation";
import { useSaveWwqInvitation } from "@/hooks/api/wwq-invitation/use-save-wwq-invitation";
import { useFormDialog } from "@/hooks/use-dialog-form";
import { wwqInvitationFormSchema } from "@/server/api/routers/wwq-invitation-router/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { WwqInvitationFormSkeleton } from "./form-skeleton";

interface Props {
  onSuccessCallback: () => void;
}
export function WwqInvitationForm(props: Props) {
  const { open, handleCloseDialog, id: invitationId } = useFormDialog();

  const mutation = useSaveWwqInvitation({
    onSuccessCallback: () => {
      form.reset();
      props.onSuccessCallback();
      handleCloseDialog();
    },
  });
  const { data: invitationDetail, isLoading } =
    useGetDetailWwqInvitation(invitationId);

  const form = useForm<z.infer<typeof wwqInvitationFormSchema>>({
    resolver: zodResolver(wwqInvitationFormSchema),
    defaultValues: {
      name: "",
      secretKey: "",
      id: "",
    },
  });

  const onSubmit = (values: z.infer<typeof wwqInvitationFormSchema>) => {
    mutation.mutate({
      id: invitationId,
      name: values.name,
      secretKey: values.secretKey,
    });
  };

  const handleClose = () => {
    handleCloseDialog();
    form.reset();
  };

  useEffect(() => {
    // if invitationId is not undefined it means edit mode
    if (invitationDetail) {
      form.reset({
        id: invitationDetail.id,
        name: invitationDetail.name ?? "",
        secretKey: invitationDetail.secretKey,
      });
    }
  }, [invitationId, invitationDetail, form]);

  const Title = invitationId ? "Edit Undangan" : "Buat Undangan Baru";
  const Description = !!invitationId
    ? "Ubah informasi undangan WWQ"
    : "Buat undangan baru untuk tes WWQ";

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{Title}</DialogTitle>
          <DialogDescription>{Description}</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <WwqInvitationFormSkeleton />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Undangan</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: Undangan Tes WWQ"
                        {...field}
                      />
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
                    <FormLabel>Kunci Rahasia</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Secret Key"
                        {...field}
                        className="font-mono"
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
                  disabled={mutation.isPending}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  isLoading={mutation.isPending}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending
                    ? "Sedang menyimpan"
                    : !!invitationId
                      ? "Perbarui"
                      : "Simpan"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
