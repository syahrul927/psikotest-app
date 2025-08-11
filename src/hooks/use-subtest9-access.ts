import { useCheckSubtest9Access } from "@/hooks/api/ist-test/use-check-subtest9-access";
import { useMarkSubtest9Image } from "@/hooks/api/ist-test/use-mark-subtest9-image";
import { useState, useEffect } from "react";

export const useSubtest9Access = () => {
  const [hasViewedImage, setHasViewedImage] = useState(false);
  
  // Extract common logic into this hook
  const { data: imageAccessData, isLoading: isCheckingAccess } = 
    useCheckSubtest9Access("", "");
  
  const markMutation = useMarkSubtest9Image(
    (data) => {
      setHasViewedImage(data.viewed);
    },
    () => {
      setHasViewedImage(true);
    }
  );

  useEffect(() => {
    if (imageAccessData) {
      setHasViewedImage(imageAccessData.viewed);
    }
  }, [imageAccessData]);

  const markImageViewed = (invitationId: string, subtestId: string) => {
    // Re-enable check before marking
    const { data } = useCheckSubtest9Access(invitationId, subtestId);
    if (data && !data.viewed) {
      markMutation.mutate({ istInvitationId: invitationId, subtestId });
    }
  };

  return {
    hasViewedImage,
    isCheckingAccess,
    isMarkingAccess: markMutation.isPending,
    markImageViewed,
  };
};

// Simplified version for immediate use
export const useSubtest9AccessSimple = (invitationId?: string, subtestType?: string) => {
  const [hasViewedImage, setHasViewedImage] = useState(false);
  
  const { data, isLoading: isCheckingAccess } = useCheckSubtest9Access(
    invitationId || "", 
    subtestType || ""
  );

  useEffect(() => {
    if (data) {
      setHasViewedImage(data.viewed);
    }
  }, [data]);

  const markMutation = useMarkSubtest9Image(
    (response) => setHasViewedImage(response.viewed),
    () => setHasViewedImage(true)
  );

  const markImageViewed = () => {
    if (invitationId && subtestType === "9" && !hasViewedImage) {
      markMutation.mutate({
        istInvitationId: invitationId,
        subtestId: subtestType,
      });
    }
  };

  return {
    hasViewedImage,
    isCheckingAccess,
    isMarkingAccess: markMutation.isPending,
    markImageViewed,
  };
};