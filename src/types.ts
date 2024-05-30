// export enum Connector {
//   equal = "=",
//   equiv = "\\iff",
//   implies = "\\Rightarrow",
// }

import { KeyId } from "./keyIds";

export type GeneratorOptions = {};

export type Proposition = {
  id: string;
  statement: string;
  isRightAnswer: boolean;
  format: "tex" | "raw";
};

export interface Question<TIdentifiers = {}> {
  instruction: string;
  hint?: string;
  correction?: string;
  startStatement?: string;
  answer: string;
  answerFormat: "tex" | "raw";
  keys?: KeyId[];
  commands?: string[];
  coords?: number[];
  options?: {
    gridDistance?: [number, number] | false;
    hideGrid?: boolean;
    hideAxes?: boolean;
    isGridBold?: boolean;
    isGridSimple?: boolean;
    isAxesRatioFixed?: boolean;
    is3D?: boolean;
    axisLabels?: string[];
  };
  divisionFormat?: "fraction" | "obelus";
  identifiers: TIdentifiers;
  propositions?: Proposition[];
}

export type QCMGenerator<TIdentifiers> = (
  n: number,
  args: { answer: string } & TIdentifiers
) => Proposition[];
export type VEA<TIdentifiers> = (
  studentAnswer: string,
  args: { answer: string } & TIdentifiers
) => boolean;
export type QuestionGenerator<TIdentifiers = {}, TOptions = {}> = (
  opts?: TOptions
) => Question<TIdentifiers>;
export interface Exercise<TIdentifiers = {}> {
  id: string;
  isSingleStep: boolean;
  label: string;
  connector?: "=" | "\\iff" | "\\approx";
  generator: (n: number) => Question<TIdentifiers>[];
  maxAllowedQuestions?: number;
  answerType?: "QCM" | "free";
  qcmTimer: number;
  freeTimer: number;
  getPropositions?: QCMGenerator<{ answer: string } & TIdentifiers>;
  isAnswerValid?: VEA<TIdentifiers>;
  hasGeogebra?: boolean;
  is3d?: boolean;
  subject: "Mathématiques" | "Chimie" | "Physique";
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
