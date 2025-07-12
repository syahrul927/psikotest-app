import { DataTable } from "@/components/table/data-table";
import { useSession } from "next-auth/react";
import { UserForm } from "../user-form";
import type { UserTableProps } from "./schema";
import { columnsUser } from "./user-columns";
import { DataTableToolbarUser } from "./user-toolbar";
import { UserFormDialogProvider } from "../user-form/user-form-dialog-controller";
import { DeleteDialogProvider } from "./delete-dialog-context";
import { DeleteDialog } from "./delete-dialog";

export const UserTable = ({
  data = [],
  isLoading,
  refetch: refetchData,
}: {
  data?: UserTableProps[];
  isLoading?: boolean;
  refetch: () => void;
}) => {
  const { data: sessionData } = useSession();
  return (
    <UserFormDialogProvider>
      <DeleteDialogProvider>
        <DataTable
          isLoading={isLoading}
          columns={columnsUser}
          toolbar={DataTableToolbarUser}
          data={data}
        />
        <DeleteDialog />
        {sessionData?.user.id && (
          <UserForm
            onSuccessCallback={refetchData}
            currentUserId={sessionData?.user.id}
          />
        )}
      </DeleteDialogProvider>
    </UserFormDialogProvider>
  );
};
