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
import { useGetDetailPapiKostickInvitation } from "@/hooks/api/papi-kostick-invitation/use-get-detail-papi-kostick-invitation";
import { useSavePapiKostickInvitation } from "@/hooks/api/papi-kostick-invitation/use-save-papi-kostick-invitation";
import { useFormDialog } from "@/hooks/use-dialog-form";
import { papiKostickInvitationFormSchema } from "@/server/api/routers/papi-kostick-invitation-router/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PapiKostickInvitationFormSkeleton } from "./form-skeleton";

interface Props {
  onSuccessCallback: () => void;
}
export function PapiKostickInvitationForm(props: Props) {
  const { open, handleCloseDialog, id: invitationId } = useFormDialog();

  const mutation = useSavePapiKostickInvitation({
    onSuccessCallback: () => {
      form.reset();
      props.onSuccessCallback();
      handleCloseDialog();
    },
  });
  const { data: invitationDetail, isLoading } =
    useGetDetailPapiKostickInvitation(invitationId);

  const form = useForm<z.infer<typeof papiKostickInvitationFormSchema>>({
    resolver: zodResolver(papiKostickInvitationFormSchema),
    defaultValues: {
      name: "",
      secretKey: "",
      id: "",
    },
  });

  const onSubmit = (
    values: z.infer<typeof papiKostickInvitationFormSchema>,
  ) => {
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
    ? "Ubah informasi undangan Papi Kostick"
    : "Buat undangan baru untuk tes Papi Kostick";

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{Title}</DialogTitle>
          <DialogDescription>{Description}</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <PapiKostickInvitationFormSkeleton />
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
                        placeholder="Contoh: Undangan Tes Papi Kostick"
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
