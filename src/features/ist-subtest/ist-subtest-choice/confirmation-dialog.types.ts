export interface ConfirmationDialogProps
  extends React.HTMLAttributes<HTMLDivElement> {
  subtestType: string;
  instruction?: string | null;
  informationData: {
    name: string;
    description: string;
    duration: number;
    totalQuestion: number;
  };
  onConfirm: () => void;
  istInvitationId?: string;
}

export interface InformationData {
  name: string;
  description: string;
  duration: number;
  totalQuestion: number;
}

export interface MemorizationTimerState {
  isMemorizing: boolean;
  timeLeft: number;
  hasViewedImage: boolean;
}

export interface UseMemorizationTimerReturn {
  isMemorizing: boolean;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  startTimer: () => void;
}

export interface UseSubtest9AccessReturn {
  hasViewedImage: boolean;
  isCheckingAccess: boolean;
  isMarkingAccess: boolean;
  markImageViewed: (invitationId: string, subtestId: string) => void;
}

export interface Subtest9MemorizationProps {
  subtestType: string;
  istInvitationId?: string;
  hasViewedImage: boolean;
  isMemorizing: boolean;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  startMemorization: () => void;
  isCheckingAccess: boolean;
  isMarkingAccess: boolean;
}
