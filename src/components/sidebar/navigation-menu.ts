import type { NavigationType } from "@/components/sidebar/types";
import { wwqSettingsEnabled } from "@/lib/feature-flags";
import { PAGE_URLS } from "@/lib/page-url";
import {
  BrainCogIcon,
  CalculatorIcon,
  HomeIcon,
  HelpCircleIcon,
  Settings,
  UsersIcon,
  BarChartHorizontalIcon,
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
  {
    title: "Psikotest Papi Kostik",
    url: PAGE_URLS.PAPI_KOSTICK_INVITATION,
    icon: BarChartHorizontalIcon,
  },
  {
    title: "Psikotest WWQ",
    url: PAGE_URLS.WWQ_INVITATION,
    icon: HelpCircleIcon,
  },
];
export const NavigationSecondaryConstant: NavigationType[] = [
  {
    title: "IST Settings",
    url: PAGE_URLS.IST_SETTINGS,
    icon: Settings,
  },
  ...(wwqSettingsEnabled
    ? [
        {
          title: "WWQ Settings",
          url: PAGE_URLS.WWQ_SETTINGS,
          icon: Settings,
        },
      ]
    : []),
  {
    title: "User Akses",
    url: PAGE_URLS.USER_ACCESS,
    icon: UsersIcon,
  },
];
