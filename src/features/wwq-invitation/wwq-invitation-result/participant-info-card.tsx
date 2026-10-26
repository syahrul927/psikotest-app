"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProfileWwqInvitation } from "@/hooks/api/wwq-invitation/use-get-profile-wwq-invitation";
import { formatDate, getAge, localDate } from "@/lib/date-utils";

export function WwqParticipantInfoCard({ slug }: { slug: string }) {
  const { data, isLoading } = useGetProfileWwqInvitation(slug);
  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profil tidak ditemukan</CardTitle>
        </CardHeader>
      </Card>
    );
  }
  const { name, phone, dateOfBirth, createdAt } = data;
  const age = getAge(dateOfBirth);
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Informasi Peserta</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b">
              <td className="text-muted-foreground w-1/3 py-2 font-medium">
                Nama
              </td>
              <td className="py-2 font-medium">{name}</td>
            </tr>
            <tr className="border-b">
              <td className="text-muted-foreground py-2 font-medium">
                Nomor Telepon
              </td>
              <td className="py-2">{phone}</td>
            </tr>
            <tr className="border-b">
              <td className="text-muted-foreground py-2 font-medium">
                Tanggal Lahir
              </td>
              <td className="py-2">{formatDate(dateOfBirth)}</td>
            </tr>
            <tr className="border-b">
              <td className="text-muted-foreground py-2 font-medium">Usia</td>
              <td className="py-2">{age} tahun</td>
            </tr>
            <tr>
              <td className="text-muted-foreground py-2 font-medium">
                Tanggal Mulai Test
              </td>
              <td className="py-2">{localDate(createdAt)}</td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
