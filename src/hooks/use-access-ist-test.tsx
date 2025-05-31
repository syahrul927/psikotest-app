"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

type AccessIstTestType = {
  id?: string;
  access: boolean;
  setAccess: (id: string, access: boolean) => void;
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
  const [id, setId] = useState<string>();
  const setAccessSuccess = (id: string, access: boolean) => {
    setAccess(access);
    setId(id);
  };
  const resetAccess = () => {
    setAccess(false);
    setId(undefined);
  };
  return (
    <AccessIstInvitationContext.Provider
      value={{ access, id, setAccess: setAccessSuccess, resetAccess }}
    >
      {children}
    </AccessIstInvitationContext.Provider>
  );
};
