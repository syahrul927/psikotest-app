import type { InformationData } from "./confirmation-dialog.types";

interface ConfirmationDialogInfoProps {
  informationData: InformationData;
}

export const ConfirmationDialogInfo = ({ informationData }: ConfirmationDialogInfoProps) => {
  return (
    <div className="bg-muted/50 rounded-lg border p-4 text-left">
      <h4 className="mb-2 font-semibold">Information:</h4>
      <ul className="space-y-1">
        <li>
          <strong>Nama:</strong> {informationData.name}
        </li>
        <li>
          <strong>Deskripsi:</strong> {informationData.description}
        </li>
        <li>
          <strong>Durasi:</strong> {informationData.duration}
        </li>
        <li>
          <strong>Total Pertanyaan:</strong> {informationData.totalQuestion}
        </li>
      </ul>
    </div>
  );
};