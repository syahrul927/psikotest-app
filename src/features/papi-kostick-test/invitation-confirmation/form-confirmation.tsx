"use client";

import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useConfirmationPapiKostickInvitation,
  type ConfirmationPapiKostickInvitationResponseType,
} from "@/hooks/api/papi-kostick-invitation/use-confirmation-papi-kostick-invitation";
import { useAccessTestInvitation } from "@/hooks/use-access-test";
import { PAGE_URLS } from "@/lib/page-url";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  secretKey: z.string(),
});

type FormType = z.infer<typeof formSchema>;

interface Props {
  invitationId: string;
  invitationName: string;
}

export const PapiKostickInvitationFormConfirmation = ({
  invitationId,
  invitationName,
}: Props) => {
  const router = useRouter();
  const { grantAccess, resetAccess } = useAccessTestInvitation();
  const form = useForm<FormType>({
    defaultValues: {
      secretKey: "",
    },
    resolver: zodResolver(formSchema),
  });

  const handleConfirmationSuccess = (
    data: ConfirmationPapiKostickInvitationResponseType,
  ) => {
    grantAccess();
    if (data.step === 0) {
      return router.push(PAGE_URLS.PAPI_KOSTICK_TEST_PROFILE(invitationId));
    }
    if (data.step === 1) {
      return router.push(PAGE_URLS.PAPI_KOSTICK_TEST(invitationId));
    }
  };

  const handleConfirmationError = () => {
    resetAccess();
  };
  const { mutate, isPending: isConfirming } =
    useConfirmationPapiKostickInvitation(
      handleConfirmationSuccess,
      handleConfirmationError,
    );

  const onSubmit = (data: FormType) => {
    mutate({ id: invitationId, secretKey: data.secretKey });
  };
  return (
    <div className="flex w-full max-w-md flex-col">
      <AnimatedWrapper animation="slideUp">
        <Card>
          <CardHeader className="">
            <CardTitle className="text-xl">Selamat Datang</CardTitle>
            <CardDescription>
              Undangan psikotest Kepribadian&nbsp;
              <span className="font-bold">{invitationName}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col space-y-8">
                  <FormField
                    control={form.control}
                    name="secretKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secret Key</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukkan Secret Key"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Gunakan secret key yang diberikan.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col items-center">
                    <Button
                      isLoading={isConfirming}
                      type="submit"
                      size={"sm"}
                      className="w-full"
                    >
                      <CheckCircle
                        className={cn("mr-2 h-5 w-5", isConfirming && "hidden")}
                      />
                      {isConfirming ? "Memverifikasi..." : "Lanjutkan"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </AnimatedWrapper>
    </div>
  );
};
