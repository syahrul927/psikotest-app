import { CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { EducationLabel } from "@/types/kraepelin-invitation-constanta";

interface KraepelinResultInfoTesterProps {
  name: string;
  phone: string;
  educationId: string;
  educationDescription: string;
  address: string;
  isLoading?: boolean;
}

export function KraepelinResultInfoTester({
  name,
  address,
  educationDescription,
  educationId,
  phone,
  isLoading,
}: KraepelinResultInfoTesterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Peserta</CardTitle>
        <p className="text-muted-foreground text-sm">
          Data di isi sendiri oleh peserta
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody className="[&>tr>td]:text-right [&>tr>td]:whitespace-normal">
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableCell>{name}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Nomor Telepon</TableHead>
              <TableCell>
                <Button
                  variant={"link"}
                  onClick={async () => {
                    toast.success("Berhasil Copy Contact ke Clipboard");
                    return navigator.clipboard.writeText(phone);
                  }}
                  className="px-0"
                >
                  <CopyIcon size={16} />
                  {phone}
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Pendidikan</TableHead>
              <TableCell>
                {EducationLabel.find((item) => item.id === educationId)
                  ?.label ?? "Tidak diketahui"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Jurusan/Deskripsi Pendidikan</TableHead>
              <TableCell>{educationDescription}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Alamat</TableHead>
              <TableCell>{address}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
