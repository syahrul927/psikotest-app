import { Logo } from "@/components/ui/logo";
import { UserSigninForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Logo />
      <UserSigninForm />
    </div>
  );
}
