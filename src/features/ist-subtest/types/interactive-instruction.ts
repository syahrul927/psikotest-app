export interface InteractiveExampleData {
  type: string;
  subtestType: string;
  question: InteractiveQuestionData;
  correctAnswer?: string;
  explanation?: string;
  exampleAnswer?: string;
  instruction?: string;
}

export interface InteractiveQuestionData {
  id: string;
  text?: string | null;
  imageUrl?: string | null;
  options?: InteractiveOptionData[];
}

export interface InteractiveOptionData {
  id: string;
  text?: string | null;
  imageUrl?: string | null;
  label?: string;
}