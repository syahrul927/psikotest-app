"use client";

import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { Button, buttonVariants } from "@/components/ui/button";
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
  useConfirmationIstInvitation,
  type ConfirmationIstInvitationResponseType,
} from "@/hooks/api/ist-invitation/use-confirmation-ist-invitation";
import { useAccessIstInvitation } from "@/hooks/use-access-ist-test";
import { PAGE_URLS } from "@/lib/page-url";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  secretKey: z.string({ required_error: "Secret Key wajib diisi!" }),
});

type FormType = z.infer<typeof formSchema>;
interface IstInvitationConfirmationProps {
  slug: string;
  name: string;
}
export const IstInvitationConfirmation = ({
  slug,
  name,
}: IstInvitationConfirmationProps) => {
  const router = useRouter();
  const { grantAccess, resetAccess } = useAccessIstInvitation();
  const form = useForm<FormType>({
    defaultValues: {
      secretKey: "",
    },
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
  });
  const onSuccessConfirmed = (data: ConfirmationIstInvitationResponseType) => {
    grantAccess();
    if (data.step === 0) {
      return router.push(PAGE_URLS.IST_TEST_PROFILE(slug));
    }
    if (data.step === 1) {
      return router.push(PAGE_URLS.IST_SUBTEST(slug));
    }
  };

  const onErrorConfirmed = () => {
    resetAccess();
  };
  const { mutate, isPending: isLoading } = useConfirmationIstInvitation(
    onSuccessConfirmed,
    onErrorConfirmed,
  );

  const onSubmit = (data: FormType) => {
    mutate({ id: slug, secretKey: data.secretKey });
  };
  return (
    <div className="flex w-full max-w-md flex-col">
      <AnimatedWrapper animation="slideUp">
        <Card>
          <CardHeader className="">
            <CardTitle className="text-xl">Selamat Datang</CardTitle>
            <CardDescription>
              Undangan psikotest IST&nbsp;
              <span className="font-bold">{name}</span>
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
                      isLoading={isLoading}
                      type="submit"
                      size={"sm"}
                      className="w-full"
                    >
                      <CheckCircle
                        className={cn("mr-2 h-5 w-5", isLoading && "hidden")}
                      />
                      {isLoading ? "Memverifikasi..." : "Lanjutkan"}
                    </Button>
                    <p className="text-muted-foreground text-xs text-wrap">
                      Belum tau cara kerja IST? Klik
                      <Link
                        href={PAGE_URLS.KRAEPELIN_TRAINING}
                        className={cn(
                          buttonVariants({ variant: "link" }),

                          "p-0 text-xs underline",
                        )}
                      >
                        &nbsp;disini&nbsp;
                      </Link>
                    </p>
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
