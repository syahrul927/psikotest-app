"use client";
import { UserTable } from "@/features/user";
import { useDeleteUserAccess } from "@/hooks/api/user-access/use-delete-user-access";
import { useGetAllUserAccess } from "@/hooks/api/user-access/use-get-all-user-access";

const UserPage = () => {
  const { data, refetch, isLoading } = useGetAllUserAccess();
  const { mutate: onDelete } = useDeleteUserAccess(() => {
    void refetch();
  });
  return (
    <UserTable
      isLoading={isLoading}
      refetch={refetch}
      data={data?.map(({ name, id, email, image }) => ({
        id,
        name,
        email,
        image,
        onDelete,
      }))}
    />
  );
};
export default UserPage;
