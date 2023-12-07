// export enum Connector {
//   equal = "=",
//   equiv = "\\iff",
//   implies = "\\Rightarrow",
// }

export type GeneratorOptions = {};

export type Proposition = {
  id: string;
  statement: string;
  isRightAnswer: boolean;
  format: "tex" | "raw";
};
export interface Question<TQCMProps = any, TVEAProps = any> {
  instruction: string;
  startStatement?: string;
  answer: string;
  answerFormat?: "tex" | "raw";
  keys?: string[];
  commands?: string[];
  coords?: number[];
  options?: any;
  propositions?: Proposition[];
  getPropositions?: (n: number) => Proposition[];
  qcmGeneratorProps?: TQCMProps;
  veaProps?: TVEAProps;
}

export type QCMGenerator<T> = (n: number, args: T) => Proposition[];
export type VEA<T> = (studentAnswer: string, args: T) => boolean;
export type QuestionGenerator<TQCMProps = any, TVEAProps = any> = () => Question<TQCMProps, TVEAProps>;
export interface Exercise<TQCMProps = any, TVEAProps = any> {
  id: string;
  instruction: string;
  isSingleStep: boolean;
  label: string;
  sections: Section[];
  levels: Level[];
  connector: "=" | "\\iff" | "\\approx";
  keys?: string[];
  generator: (n: number) => Question<TQCMProps, TVEAProps>[];
  getPropositions?: QCMGenerator<TQCMProps>;
  isAnswerValid?: VEA<TVEAProps>;
}

export type Level =
  | "6ème"
  | "5ème"
  | "4ème"
  | "3ème"
  | "2nde"
  | "1reTech"
  | "1reESM"
  | "1reSpé"
  | "TermSpé"
  | "TermTech"
  | "MathExp"
  | "MathComp";

export type Section =
  | "Calcul littéral"
  | "Équations"
  | "Racines carrées"
  | "Fractions"
  | "Calculs"
  | "Géométrie cartésienne"
  | "Vecteurs"
  | "Puissances"
  | "Suites"
  | "Pourcentages"
  | "Dérivation"
  | "Probabilités"
  | "Droites"
  | "Géométrie euclidienne"
  | "Conversions"
  | "Arithmétique"
  | "Fonctions affines"
  | "Proportionnalité"
  | "Logarithme népérien"
  | "Exponentielle"
  | "Fonctions"
  | "Statistiques"
  | "Limites"
  | "Intégration"
  | "Primitives"
  | "Équations différentielles"
  | "Trigonométrie";
