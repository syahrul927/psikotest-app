export interface IstReviewFormWrapperDataProps {
  id: string;
  order: number;
  text?: string;
  image?: string;
  correctAnswer?: string;
  userAnswer?: string;
  isCorrect: boolean | null;
  score: number | null;
}
export interface IstReviewFormWrapperProps {
  id: string;
  title: string;
  type: string;
  totalCorrect: number;
  description?: string;
  data: IstReviewFormWrapperDataProps[];
}
