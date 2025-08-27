"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

type AccessTestType = {
  access: boolean;
  grantAccess: () => void;
  resetAccess: () => void;
};
const AccessTestInvitationContext = createContext<AccessTestType | null>(null);

export const useAccessTestInvitation = () => {
  const context = useContext(AccessTestInvitationContext);
  if (!context) {
    throw new Error(
      "useAccess must be used within a <AccessTestInvitationProvider />",
    );
  }
  return context;
};
export const AccessTestInvitationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [access, setAccess] = useState(false);
  const grantAccess = () => {
    setAccess(true);
  };
  const resetAccess = () => {
    setAccess(false);
  };
  return (
    <AccessTestInvitationContext.Provider
      value={{ access, grantAccess, resetAccess }}
    >
      {children}
    </AccessTestInvitationContext.Provider>
  );
};
