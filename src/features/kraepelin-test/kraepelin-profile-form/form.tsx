"use client";

import AlertConfirm from "@/components/ui/alert-confirm";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderSpinner } from "@/components/ui/loading-spinner";
import { PhoneInput } from "@/components/ui/phone-number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useStartInvitation,
  type StartKraepelinInvitationResponseType,
} from "@/hooks/api/kraepelin-invitation/use-start-invitation";
import { useUpdateProfileKraepelinInvitation } from "@/hooks/api/kraepelin-invitation/use-update-profile-kraepelin-invitation";
import { useAccessInvitation } from "@/hooks/use-access-invitation-kraepelin";
import { PAGE_URLS } from "@/lib/page-url";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  BookOpen,
  FileText,
  GraduationCap,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .min(2, "Nama harus terdiri dari minimal 2 karakter"),

  phone: z.string().min(1, "Nomor telepon wajib diisi"),

  address: z
    .string()
    .min(1, "Alamat wajib diisi")
    .min(10, "Silakan isi alamat dengan lebih lengkap"),

  education: z.string().min(1, "Silakan pilih tingkat pendidikan Anda"),

  educationDescription: z.string().optional(),
});
type FormProfileType = z.infer<typeof formProfileSchema>;

export const KraepelinProfileForm = ({ id }: { id: string }) => {
  const { access, setAccess, resetAccess } = useAccessInvitation();

  const [open, onOpenChange] = useState(false);
  const router = useRouter();

  const form = useForm<FormProfileType>({
    resolver: zodResolver(formProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      education: "",
      educationDescription: "",
    },
  });

  const onSuccessUpdateProfile = () => {
    onOpenChange(true);
  };

  const onSuccessStartInvitation = (
    resp: StartKraepelinInvitationResponseType,
  ) => {
    setAccess(resp.resultId, true);
  };

  const { mutateAsync: startTest } = useStartInvitation(
    onSuccessStartInvitation,
    () => {
      resetAccess();
      router.push(PAGE_URLS.KRAEPELIN_TEST_CONFIRMATION(id));
    },
  );
  const { mutate, isPending: loading } = useUpdateProfileKraepelinInvitation(
    onSuccessUpdateProfile,
  );

  const onConfirm = async () => {
    await startTest({ id });
    router.push(PAGE_URLS.KRAEPELIN_TEST(id));
  };

  const onSubmit = async (data: FormProfileType) => {
    mutate({ id, ...data });
  };

  useEffect(() => {
    if (!access) {
      router.push(PAGE_URLS.KRAEPELIN_TEST_CONFIRMATION(id));
    }
  }, [router, access]);

  if (!access) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoaderSpinner />
      </div>
    );
  }
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertConfirm
          title="Apakah kamu sudah siap?"
          onAction={onConfirm}
          description={` Ketika kamu klik "Lanjut" kamu tidak dapat mengulang lagi dari awal! `}
        >
          Lanjut
        </AlertConfirm>
      </AlertDialog>
      <Card className="w-full max-w-lg border-0 shadow-xl">
        <CardHeader className="pb-6 text-center">
          <CardTitle className="text-2xl font-bold">
            Informasi Peserta
          </CardTitle>
          <p className="">
            Silakan lengkapi data Anda di bawah ini untuk melanjutkan
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                      <User className="h-4 w-4" />
                      Nama Lengkap
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan Nama Lengkap"
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                      <Phone className="h-4 w-4" />
                      Nomor Telepon
                    </FormLabel>
                    <FormControl>
                      <PhoneInput {...field} defaultCountry="ID" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Address Field */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                      <MapPin className="h-4 w-4" />
                      Alamat Lengkap
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan alamat lengkap Anda termasuk jalan, kota, dan kode pos"
                        className="min-h-[100px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Education Field */}
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                      <GraduationCap className="h-4 w-4" />
                      Pendidikan
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Pilih Pendidikan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full">
                        <SelectItem value="1">SMA IPA</SelectItem>
                        <SelectItem value="2">SMA IPS</SelectItem>
                        <SelectItem value="3">S1 IPA</SelectItem>
                        <SelectItem value="4">S1 IPS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Education Description Field */}
              <FormField
                control={form.control}
                name="educationDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                      <FileText className="h-4 w-4" />
                      Deskripsi Pendidikan
                      <span className="text-xs font-normal">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="S1 Teknik Informatika Universitas Di Jakarta"
                        className="min-h-[80px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex w-full flex-col space-y-3">
                <Link href={PAGE_URLS.KRAEPELIN_TRAINING}>
                  <Button
                    className="w-full"
                    isLoading={loading}
                    type="button"
                    variant={"outline"}
                  >
                    <BookOpen className={cn(loading ? "hidden" : "")} /> Coba
                    Latihan
                  </Button>
                </Link>
                <Button isLoading={loading} type="submit">
                  <ArrowRight className={cn(loading ? "hidden" : "")} />{" "}
                  Lanjutkan
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
