"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { PhoneInput } from "@/components/ui/phone-number-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProfileIstInvitation } from "@/hooks/api/ist-invitation/use-update-profile-ist-invitation";
import { PAGE_URLS } from "@/lib/page-url";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  ArrowRight,
  Calendar as CalendarIcon,
  GraduationCap,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IstWrapper } from "../ist-wrapper";

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
  dob: z.date(),
  pob: z.string().min(1, "Tempat lahir wajib diisi"),
  education: z.string().min(1, "Silakan pilih tingkat pendidikan Anda"),
  educationDescription: z.string().optional(),
});
type FormProfileType = z.infer<typeof formProfileSchema>;

export const IstProfileForm = ({ id }: { id: string }) => {
  const router = useRouter();

  const form = useForm<FormProfileType>({
    resolver: zodResolver(formProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      dob: new Date(),
      pob: "",
      education: "",
      educationDescription: "",
    },
  });

  const onSuccessUpdateProfile = () => {
    router.push(PAGE_URLS.IST_SUBTEST(id));
  };

  const { mutate, isPending: isUpdatingProfile } = useUpdateProfileIstInvitation(
    onSuccessUpdateProfile,
  );

  const onSubmit = async (data: FormProfileType) => {
    mutate({ id, ...data });
  };

  return (
    <IstWrapper>
      <div className="bg-background flex min-h-screen items-center justify-center p-4">
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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

                {/* Date of Birth Field */}
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Tanggal Lahir
                      </FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-12 w-full justify-start border-gray-200 text-left font-normal focus:border-blue-500 focus:ring-blue-500",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "dd MMMM yyyy")
                              ) : (
                                <span>Pilih tanggal</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              captionLayout="dropdown-buttons"
                              selected={field.value}
                              onSelect={field.onChange}
                              fromYear={1900}
                              toYear={new Date().getFullYear()}
                              disabled={(date: Date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Place of Birth Field */}
                <FormField
                  control={form.control}
                  name="pob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                        <MapPin className="h-4 w-4" />
                        Tempat Lahir
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan kota tempat lahir Anda"
                          className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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

                {/* Submit Button */}
                <div className="flex w-full flex-col space-y-3">
                  <Button isLoading={isUpdatingProfile} type="submit">
                    <ArrowRight className={cn(isUpdatingProfile ? "hidden" : "")} />{" "}
                    Lanjutkan
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </IstWrapper>
  );
};
