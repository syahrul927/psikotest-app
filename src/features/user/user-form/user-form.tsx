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
import { Label } from "@/components/ui/label";
import { useGetDetailUserAccess } from "@/hooks/api/user-access/use-get-detail-user-access";
import { useSaveUserAccess } from "@/hooks/api/user-access/use-save-user-access";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, RotateCwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUserFormDialogController } from "./user-form-dialog-controller";
import { UserFormSkeleton } from "./user-form-skeleton";

const userFormSchema = z
  .object({
    id: z.string().optional(),
    email: z
      .string()
      .email({ message: "Mohon periksa kembali format email Anda." }),
    name: z.string(),
    password: z
      .string()
      .min(6, { message: "Kata sandi harus terdiri minimal 6 karakter." })
      .optional()
      .or(z.literal("")),
    repassword: z
      .string()
      .min(6, {
        message: "Konfirmasi kata sandi harus terdiri minimal 6 karakter.",
      })
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.repassword, {
    message: "Kata sandi dan konfirmasi kata sandi tidak cocok.",
    path: ["repassword"],
  });

type UserFormType = z.infer<typeof userFormSchema>;
const defaultValues: Partial<UserFormType> = {
  password: "",
  name: "",
  repassword: "",
  email: "",
};

interface UserFormProps {
  currentUserId: string; // current logged in user id
  onSuccessCallback: () => void;
}

export function UserForm({ currentUserId, onSuccessCallback }: UserFormProps) {
  const { open, setOpen, selectedUserId } = useUserFormDialogController();
  const isEditMode = Boolean(selectedUserId);

  // Fetch user detail if editing
  const { data: userDetail, isLoading: isLoadingUser } = useGetDetailUserAccess(
    selectedUserId!,
  );

  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useSaveUserAccess(() => {
    onSuccessCallback();
    setOpen(false);
  });

  const form = useForm<UserFormType>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
    mode: "onSubmit",
  });

  // Load user data into form when userDetail is fetched
  useEffect(() => {
    if (userDetail && isEditMode) {
      form.reset({
        id: userDetail.id,
        email: userDetail.email ?? undefined,
        name: userDetail.name ?? undefined,
        password: "",
        repassword: "",
      });
    }
  }, [userDetail, isEditMode, form]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
    }
  }, [open]);

  async function onSubmit(data: UserFormType) {
    mutate({
      ...data,
    });
  }

  // Whether editing self or other user
  const isEditingSelf = selectedUserId === currentUserId || !isEditMode;

  // Handler for reset password button
  function onResetPassword() {}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isLoadingUser ? (
        <UserFormSkeleton />
      ) : (
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode
                    ? `Edit User ${selectedUserId}`
                    : "Buat User Baru"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col space-y-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="example@email.com"
                            {...field}
                            disabled={isEditMode && !isEditingSelf}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isEditingSelf && (
                    <>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Password"
                                  {...field}
                                />
                                <Label
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="text-muted-foreground absolute top-[50%] right-4 -translate-y-[50%] cursor-pointer"
                                >
                                  {showPassword ? (
                                    <EyeIcon size={16} />
                                  ) : (
                                    <EyeOffIcon size={16} />
                                  )}
                                </Label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="repassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Re-type Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Re-type Password"
                                  {...field}
                                />
                                <Label
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="text-muted-foreground absolute top-[50%] right-4 -translate-y-[50%] cursor-pointer"
                                >
                                  {showPassword ? (
                                    <EyeIcon size={16} />
                                  ) : (
                                    <EyeOffIcon size={16} />
                                  )}
                                </Label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  {isEditMode && !isEditingSelf && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={onResetPassword}
                      type="button"
                    >
                      <RotateCwIcon />
                      Reset Password
                    </Button>
                  )}
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
