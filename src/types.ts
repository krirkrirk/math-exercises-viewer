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
export interface Question {
  instruction?: string;
  startStatement?: string;
  answer: string;
  answerFormat?: "tex" | "raw";
  keys?: string[];
  commands?: string[];
  coords?: number[];
  options?: any;
  propositions?: Proposition[];
  getPropositions?: (n: number) => Proposition[];
}

export interface Exercise {
  id: string;
  instruction: string;
  isSingleStep: boolean;
  label: string;
  sections: Section[];
  levels: Level[];
  connector: "=" | "\\iff" | "\\approx";
  keys?: string[];
  generator(nb: number, options?: GeneratorOptions): Question[];
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
