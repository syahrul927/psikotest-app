import {
  BarChartIcon,
  EyeOpenIcon,
  FaceIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DataNorma,
  JankerLabel,
  type NormaValidation,
  TiankerLabel,
} from "@/server/data/norma";

interface KraepelinResultPointProps {
  educationId: string;
  panker: number;
  janker: number;
  tianker: number;
  hanker: number;
  isLoading?: boolean;
}
export function KraepelinResultPoint({
  educationId,
  hanker,
  janker,
  panker,
  tianker,
  isLoading,
}: KraepelinResultPointProps) {
  const data = educationSelector(educationId);
  const labelPanker = getLabel(panker, data?.panker);
  const labelJanker = getLabel(janker, data?.janker);
  const labelTianker = getLabel(tianker, data?.tianker);
  const labelHanker = getLabel(hanker, data?.hanker);
  return (
    <div className="col-span-2 grid grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Panker
            <span className="text-muted-foreground inline text-sm italic">
              (Kecepatan Kerja)
            </span>
          </CardTitle>
          <LightningBoltIcon className="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{panker}</div>
          <p className="text-muted-foreground text-xs">{labelPanker}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Janker
            <span className="text-muted-foreground inline italic">
              ({getLabelAdditional(janker, JankerLabel)})
            </span>
          </CardTitle>
          <FaceIcon className="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{janker}</div>
          <p className="text-muted-foreground text-xs">{labelJanker}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tianker
            <span className="text-muted-foreground inline italic">
              ({getLabelAdditional(tianker, TiankerLabel)})
            </span>
          </CardTitle>
          <EyeOpenIcon className="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tianker}</div>
          <p className="text-muted-foreground text-xs">{labelTianker}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Hanker
            <span className="text-muted-foreground inline italic">
              (Ketahanan Kerja)
            </span>
          </CardTitle>
          <BarChartIcon className="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{hanker}</div>
          <p className="text-muted-foreground text-xs">{labelHanker}</p>
        </CardContent>
      </Card>
    </div>
  );
}
const educationSelector = (id: string) => {
  return DataNorma.find((data) => data.id === id);
};
const getLabel = (value: number, data?: NormaValidation[]) => {
  if (!data) {
    return "-";
  }
  return (
    data.find((item) => operator(value, item.value, item.operator))?.label ??
    "-"
  );
};
const getLabelAdditional = (value: number, data: NormaValidation[]) => {
  return (
    data.find((item) => operator(value, item.value, item.operator))?.label ??
    "-"
  );
};
const operator = (a: number, b: number, operator: string) => {
  switch (operator) {
    case ">=":
      return a >= b;
    case "<=":
      return a <= b;
    default:
      return false;
  }
};
