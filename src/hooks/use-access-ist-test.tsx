"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

type AccessIstTestType = {
  access: boolean;
  grantAccess: () => void;
  resetAccess: () => void;
};
const AccessIstInvitationContext = createContext<AccessIstTestType | null>(
  null,
);

export const useAccessIstInvitation = () => {
  const context = useContext(AccessIstInvitationContext);
  if (!context) {
    throw new Error(
      "useAccess must be used within a <AcessInvitationProvider />",
    );
  }
  return context;
};
export const AccessIstInvitationProvider = ({
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
    <AccessIstInvitationContext.Provider
      value={{ access, grantAccess, resetAccess }}
    >
      {children}
    </AccessIstInvitationContext.Provider>
  );
};
