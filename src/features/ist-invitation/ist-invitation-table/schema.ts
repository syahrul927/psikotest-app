import { z } from "zod";
import {
  CheckCircledIcon,
  CircleIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { CircleDashed } from "lucide-react";

export const IstInvitationTableSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  status: z.string(),
  secretKey: z.string(),
  startAt: z.date().nullish(),
  profileName: z.string().nullish(),
});
export type IstInvitationTableProps = z.infer<
  typeof IstInvitationTableSchema
> & {
  onDelete: (id: string) => void;
};

export const IstInvitationStatus = [
  {
    value: "PENDING",
    label: "Pending",
    icon: CircleIcon,
    style: "text-blue-600 bg-blue-200/30 dark:text-blue-400 dark:bg-blue-900/30",
  },
  {
    value: "AWAITING_REVIEW",
    label: "Awaiting Review",
    icon: CircleDashed,
    style: "text-amber-600 bg-amber-200/30 dark:text-amber-400 dark:bg-amber-900/30",
  },
  {
    value: "DONE",
    label: "Done",
    icon: CheckCircledIcon,
    style: "text-green-600 bg-green-200/30 dark:text-green-400 dark:bg-green-900/30",
  },
  {
    value: "ONPROGRESS",
    label: "On Progress",
    icon: StopwatchIcon,
    style: "text-violet-600 bg-violet-200/30 dark:text-violet-400 dark:bg-violet-900/30",
  },
];
