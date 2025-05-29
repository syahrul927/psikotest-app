import type { NavigationType } from "@/components/sidebar/types";
import { PAGE_URLS } from "@/lib/page-url";
import {
  BrainCogIcon,
  CalculatorIcon,
  HomeIcon,
  UsersIcon,
} from "lucide-react";

export const NavigationMainConstant: NavigationType[] = [
  {
    title: "Dashboard",
    url: PAGE_URLS.HOME,
    icon: HomeIcon,
  },
  {
    title: "Psikotest Kraeplin",
    url: PAGE_URLS.KRAEPLIN_INVITATION,
    icon: CalculatorIcon,
  },
  {
    title: "Psikotest IST",
    url: PAGE_URLS.IST_INVITATION,
    icon: BrainCogIcon,
  },
  {
    title: "User Akses",
    url: PAGE_URLS.USER_ACCESS,
    icon: UsersIcon,
  },
];
