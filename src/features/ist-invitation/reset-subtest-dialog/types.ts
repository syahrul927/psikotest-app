export interface SubtestInfo {
  id: number;
  name: string;
  startedAt?: Date;
  finishedAt?: Date;
  canReset: boolean;
}

export interface ResetSubtestDialogProps {
  invitationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}