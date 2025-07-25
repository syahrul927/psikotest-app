import type { NavigationType } from "@/components/sidebar/types";
import { PAGE_URLS } from "@/lib/page-url";
import {
  BrainCogIcon,
  CalculatorIcon,
  HomeIcon,
  Settings,
  UsersIcon,
} from "lucide-react";

export const NavigationMainConstant: NavigationType[] = [
  {
    title: "Dashboard",
    url: PAGE_URLS.HOME,
    icon: HomeIcon,
  },
  {
    title: "Psikotest Kraepelin",
    url: PAGE_URLS.KRAEPELIN_INVITATION,
    icon: CalculatorIcon,
  },
  {
    title: "Psikotest IST",
    url: PAGE_URLS.IST_INVITATION,
    icon: BrainCogIcon,
  },
];
export const NavigationSecondaryConstant: NavigationType[] = [
  {
    title: "IST Settings",
    url: PAGE_URLS.IST_SETTINGS,
    icon: Settings,
  },
  {
    title: "User Akses",
    url: PAGE_URLS.USER_ACCESS,
    icon: UsersIcon,
  },
];
