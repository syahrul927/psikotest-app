"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProfileIstReview } from "@/hooks/api/ist-review/use-get-profile-ist-review";
import { formatDate, getAge, localDate } from "@/lib/date-utils";

export function ParticipantInfoCard({ slug }: { slug: string }) {
  const { data, isLoading } = useGetProfileIstReview(slug);
  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not found profile</CardTitle>
        </CardHeader>
      </Card>
    );
  }
  const {
    name,
    startAt: createdDate,
    phone,
    placeOfBirth,
    dayOfBirth,
    educationName,
  } = data;
  const age = dayOfBirth ? getAge(dayOfBirth) : 0;
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
                Tempat Lahir
              </td>
              <td className="py-2">{placeOfBirth}</td>
            </tr>
            <tr className="border-b">
              <td className="text-muted-foreground py-2 font-medium">
                Tanggal Lahir
              </td>
              <td className="py-2">{dayOfBirth && formatDate(dayOfBirth)}</td>
            </tr>
            <tr className="border-b">
              <td className="text-muted-foreground py-2 font-medium">Usia</td>
              <td className="py-2">{age} tahun</td>
            </tr>
            <tr className="border-b">
              <td className="text-muted-foreground py-2 font-medium">
                Pendidikan
              </td>
              <td className="py-2">{educationName}</td>
            </tr>
            <tr>
              <td className="text-muted-foreground py-2 font-medium">
                Created Date
              </td>
              <td className="py-2">{localDate(createdDate)}</td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
