export interface IstReviewFormWrapperDataProps {
  id: string;
  order: number;
  text?: string;
  image?: string;
  correctAnswer?: string;
  userAnswer?: string;
}
export interface IstReviewFormWrapperProps {
  title: string;
  type: string;
  totalCorrect: number;
  description?: string;
  data: IstReviewFormWrapperDataProps[];
}
