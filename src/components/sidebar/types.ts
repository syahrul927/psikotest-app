import { type LucideIcon } from "lucide-react";

export type NavigationType = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: Omit<NavigationType, "code" | "icon">[];
  hide?: boolean;
};
