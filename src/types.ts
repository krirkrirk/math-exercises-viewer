import { KeyId } from "./keyIds";
export type GeneratorOptions = {};

export type Proposition = {
  id: string;
  statement: string;
  isRightAnswer: boolean;
  format: "tex" | "raw";
};
export type GeogebraAxisOptions = {
  steps?: number;
  hiddden?: boolean;
  showNumbers?: boolean;
  label?: string;
  natural?: boolean;
};

export type GeogebraOptions = {
  customToolBar?: string;
  forbidShiftDragZoom?: boolean;
  commands?: string[];
  coords: number[];
  is3D?: boolean;
  gridDistance?: [number, number] | false;
  hideGrid?: boolean;
  hideAxes?: boolean;
  isGridBold?: boolean;
  isGridSimple?: boolean;
  lockedAxesRatio?: number | false;
  xAxis?: GeogebraAxisOptions;
  yAxis?: GeogebraAxisOptions;
};

export interface Question<TIdentifiers = {}> {
  instruction: string;
  hint?: string;
  correction?: string;
  startStatement?: string;
  answer?: string;
  answerFormat?: "tex" | "raw";
  ggbAnswer?: string[];
  keys?: KeyId[];
  ggbOptions?: GeogebraOptions;
  studentGgbOptions?: GeogebraOptions;
  style?: {
    tableHasNoHeader?: boolean;
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
export type GGBVEA<TIdentifiers> = (
  studentAnswer: string[],
  args: { ggbAnswer: string[] } & TIdentifiers
) => boolean;
export type QuestionGenerator<TIdentifiers = {}, TOptions = {}> = (
  opts?: TOptions
) => Question<TIdentifiers>;
export interface Exercise<TIdentifiers = {}> {
  id: string;
  isSingleStep: boolean;
  label: string;
  sections: (MathSection | PCSection)[];
  levels: MathLevel[];
  connector?: "=" | "\\iff" | "\\approx";
  generator: (n: number) => Question<TIdentifiers>[];
  maxAllowedQuestions?: number;
  answerType?: "GGB" | "QCM" | "free" | "QCU";
  isQCM?: boolean;
  qcmTimer: number;
  freeTimer: number;
  ggbTimer?: number;
  getPropositions?: QCMGenerator<{ answer: string } & TIdentifiers>;
  isAnswerValid?: VEA<TIdentifiers>;
  isGGBAnswerValid?: GGBVEA<TIdentifiers>;
  hasGeogebra?: boolean;
  hasHintAndCorrection?: boolean;
  subject: "Mathématiques" | "Chimie" | "Physique";
}

export type MathLevel =
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
  | "MathComp"
  | "CAP"
  | "2ndPro"
  | "1rePro"
  | "TermPro";

export type MathSection =
  | "Aires"
  | "Arithmétique"
  | "Calcul littéral"
  | "Calculs"
  | "Combinatoire et dénombrement"
  | "Conversions"
  | "Dérivation"
  | "Droites"
  | "Ensembles et intervalles"
  | "Équations"
  | "Équations différentielles"
  | "Exponentielle"
  | "Fonction cube"
  | "Fonction inverse"
  | "Fonctions"
  | "Fonctions affines"
  | "Fonctions de référence"
  | "Fractions"
  | "Géométrie cartésienne"
  | "Géométrie euclidienne"
  | "Inéquations"
  | "Intégration"
  | "Limites"
  | "Logarithme népérien"
  | "Logarithme décimal"
  | "Matrices"
  | "Nombres complexes"
  | "Périmètres"
  | "Pourcentages"
  | "Primitives"
  | "Probabilités"
  | "Produit scalaire"
  | "Proportionnalité"
  | "Python"
  | "Puissances"
  | "Python"
  | "Racines carrées"
  | "Second degré"
  | "Statistiques"
  | "Suites"
  | "Systèmes"
  | "Théorème de Pythagore"
  | "Théorème de Thalès"
  | "Trigonométrie"
  | "Valeur absolue"
  | "Vecteurs";

export type PCSection =
  | "Réaction chimique"
  | "Chimie des solutions"
  | "Forces"
  | "Chimie organique"
  | "Mécanique"
  | "Lumière"
  | "Acide / Base"
  | "Constitution et transformations de la matière"
  | "Ondes"
  | "Son"
  | "Corps purs et mélanges"
  | "Fluides"
  | "Mol"
  | "Électricité"
  | "Mécanique gravitationnelle"
  | "Spectrophotométrie"
  | "Quantique"
  | "Thermodynamique"
  | "Énergie";
