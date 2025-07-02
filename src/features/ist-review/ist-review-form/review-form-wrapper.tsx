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
  const FallbackComponent = () => <div>Unknown Type: {type}</div>;
  FallbackComponent.displayName = `FallbackComponent_${type}`;
  return FallbackComponent;
};
export const IstReviewFormWrapper = (props: IstReviewFormWrapperProps) => {
  const ReviewItem = getComponentByType(props.type);

  return (
    <div className="flex flex-col gap-3">
      {props.data.map((item) => (
        <ReviewItem {...item} key={item.id} />
      ))}
    </div>
  );
};
