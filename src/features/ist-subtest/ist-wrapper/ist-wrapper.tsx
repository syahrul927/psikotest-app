"use client";
import { LoaderSpinner } from "@/components/ui/loading-spinner";
import { useAccessIstInvitation } from "@/hooks/use-access-ist-test";
import { PAGE_URLS } from "@/lib/page-url";
import { useParams, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { toast } from "sonner";    

export const IstWrapper = ({ children }: { children: ReactNode }) => {
  const { access } = useAccessIstInvitation();
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    if (!access) {
      toast.error("Oops..", {
        description: "Kamu tidak memiliki akses, silahkan konfirmasi ulang!",
      });

      const timeout = setTimeout(() => {
        router.replace(PAGE_URLS.IST_TEST_CONFIRMATION(slug));
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [access, router, slug]);

  if (access) return <>{children}</>;
  return (
    <div className="flex h-screen w-screen flex-row items-center justify-center gap-x-4 text-xl">
      <LoaderSpinner />
    </div>
  );
};
