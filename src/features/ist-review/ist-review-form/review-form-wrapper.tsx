import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReviewFormNumber } from "./review-form-number";
import { ReviewFormRadio } from "./review-form-radio";
import { ReviewFormText } from "./review-form-text";
import type {
  IstReviewFormWrapperDataProps,
  IstReviewFormWrapperProps,
} from "./types";

// Main utility function
export const getComponentByType = (
  type: string,
): React.FC<IstReviewFormWrapperDataProps> => {
  if (["1", "2", "3", "7", "8", "9"].includes(type)) {
    return ReviewFormRadio;
  }

  if (type === "4") {
    return ReviewFormText;
  }

  if (["5", "6"].includes(type)) {
    return ReviewFormNumber;
  }

  // Optional: Fallback
  return () => <div>Unknown Type: {type}</div>;
};
export const IstReviewFormWrapper = (props: IstReviewFormWrapperProps) => {
  const ReviewItem = getComponentByType(props.type);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {props.data.map((item) => (
          <ReviewItem {...item} key={item.id} />
        ))}
      </CardContent>
    </Card>
  );
};
