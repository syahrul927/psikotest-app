import { z } from "zod";
import {
  CheckCircledIcon,
  CircleIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

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
    style: "text-blue-600 bg-blue-200/30 rounded-lg py-0.5 px-2 font-semibold",
  },
  {
    value: "DONE",
    label: "Done",
    icon: CheckCircledIcon,
    style:
      "text-green-600 bg-green-200/30 rounded-lg py-0.5 px-2 font-semibold",
  },
  {
    value: "ONPROGRESS",
    label: "On Progress",
    icon: StopwatchIcon,
    style:
      "text-violet-600 bg-violet-200/30 rounded-lg py-0.5 px-2 font-semibold",
  },
];
