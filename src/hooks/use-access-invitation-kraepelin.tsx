"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

type AccessInvitationType = {
  id?: string;
  access: boolean;
  setAccess: (id: string, access: boolean) => void;
  resetAccess: () => void;
};
const AccessInvitationContext = createContext<AccessInvitationType | null>(
  null,
);

export const useAccessInvitation = () => {
  const context = useContext(AccessInvitationContext);

  if (!context) {
    throw new Error(
      "useAccess must be used within a <AcessInvitationProvider />",
    );
  }
  return context;
};
export const AccessInvitationProvider = ({
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
    <AccessInvitationContext.Provider
      value={{ access, id, setAccess: setAccessSuccess, resetAccess }}
    >
      {children}
    </AccessInvitationContext.Provider>
  );
};
