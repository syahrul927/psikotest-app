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
import { PAGE_URLS } from "@/lib/page-url";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter valid email" }),
  password: z.string(),
  csrfToken: z.string().optional(),
});
type LoginType = z.infer<typeof loginSchema>;
const defaultValues: Partial<LoginType> = {
  email: "",
  password: "",
};

export function UserSigninForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<LoginType>({
    defaultValues,
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async ({ email, password }: LoginType) => {
    setIsLoading(true);

    const responseSignin = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setIsLoading(false);
    if (responseSignin?.error) {
      switch (responseSignin.error) {
        case "CredentialsSignin":
          toast.error("Oops! Kredensial salah", {
            description: "Silakan periksa email dan kata sandi Anda",
          });
          break;
        default:
          toast.error("Oops! Terjadi kesalahan", {
            description: "Silakan hubungi developer",
          });
          break;
      }
      return;
    }
    toast.success("Selamat datang kembali!", {
      description: "Mengalihkan ke dashboard Anda...",
    });

    return router.push(PAGE_URLS.HOME);
  };
  return (
    <div className="flex flex-col gap-6">
      <AnimatedWrapper animation="slideUp">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Selamat Datang</CardTitle>
            <CardDescription>Silakan masuk dengan akun Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="mail@example.com"
                                type="email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kata Sandi</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      isLoading={isLoading}
                      type="submit"
                      className="w-full"
                    >
                      Masuk
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
}
