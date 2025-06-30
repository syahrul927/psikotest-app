"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CriteriaItem {
  name: string;
  totalIQ: number;
  classification: string;
}

interface CriteriaInfoProps {
  criteria: CriteriaItem[];
}

export function CriteriaInfoCard({
  criteria = [
    {
      name: "Fleksibilitas Berfikir",
      totalIQ: 120.75,
      classification: "Superior",
    },
    {
      name: "Fleksibilitas Perhatian",
      totalIQ: 123.5,
      classification: "Superior",
    },
    { name: "Daya Nalar/Logika", totalIQ: 117, classification: "High Average" },
    {
      name: "Daya ingat &Konsentrasi",
      totalIQ: 77,
      classification: "Low Average",
    },
    { name: "Analisa Sintesa", totalIQ: 120.8, classification: "Superior" },
    { name: "Numerik", totalIQ: 120, classification: "Superior" },
    { name: "Total IQ", totalIQ: 160, classification: "Very Superior" },
  ],
}: CriteriaInfoProps) {
  const getBadgeVariant = (value: string) => {
    switch (value.toLowerCase()) {
      case "low":
        return "destructive";
      case "average":
        return "secondary";
      case "high":
        return "positive";
      case "superior":
        return "positive";
      case "very superior":
        return "positive";
      case "low average":
        return "destructive";
      case "high average":
        return "positiveBlue";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-xl font-medium">Criteria Info</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-muted-foreground py-2 text-left font-medium">
                Criteria
              </th>
              <th className="text-muted-foreground py-2 text-center font-medium">
                Total IQ
              </th>
              <th className="text-muted-foreground py-2 text-center font-medium">
                Classification
              </th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((item, index) => (
              <tr
                key={index}
                className={
                  index < criteria.length - 1 ? "border-b border-gray-100" : ""
                }
              >
                <td className="text-muted-foreground py-2 font-medium">
                  {item.name}
                </td>
                <td className="py-2 text-center font-medium">{item.totalIQ}</td>
                <td className="py-2 text-center">
                  <Badge variant={getBadgeVariant(item.classification)}>
                    {item.classification}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
