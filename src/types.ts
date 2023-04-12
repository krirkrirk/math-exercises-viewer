export interface Question {
  instruction?: string;
  startStatement?: string;
  answer: string;
  keys?: string[];
  commands?: string[];
  coords?: number[];
}

export interface Exercise {
  id: string;
  instruction: string;
  isSingleStep: boolean;
  label: string;
  section: string;
  levels: string[];
  connector: string;
  generator(nb: number): Question[];
}

export interface ExerciseData {
  exercise: Exercise;
  questions: Question[];
}
