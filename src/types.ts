import { KeyId } from "./keyIds";

export enum GeneratorOptionTarget {
  generation = "generation",
  vea = "vea",
  ggb = "ggb",
  instruction = "instruction",
  hint = "hint",
  correction = "correction",
  answer = "answer",
  qcm = "qcm",
  keys = "keys",
}
export enum GeneratorOptionType {
  checkbox = "checkbox",
  select = "select",
  multiselect = "multiselect",
}
export type GeneratorOption<TValue = any> = {
  id: string;
  label: string;
  type: GeneratorOptionType;
  target: GeneratorOptionTarget;
  tooltipText?: string;
  defaultValue?: TValue;
  values?: TValue[];
};

export type Proposition = {
  id: string;
  statement: string;
  isRightAnswer: boolean;
  format: "tex" | "raw";
};

export type GeogebraAxisOptions = {
  steps?: number;
  hidden?: boolean;
  hideNumbers?: boolean;
  label?: string;
  natural?: boolean;
  showPositive?: boolean;
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
  zAxis?: GeogebraAxisOptions;
  viewDirectionVector?: number[];
  fontSize?: number;
  maxHeight?: number;
  maxWidth?: number;
};

export type KeyboardOptions = {
  parenthesisShouldNotProduceLeftRight?: boolean;
};
export interface MathfieldInstructions {
  method: "write" | "cmd" | "keystroke" | "typedText";
  content: string;
}

export type KeyProps = {
  id: KeyId;
  label: string;
  labelType: "raw" | "tex" | "svg";
  mathfieldInstructions?: MathfieldInstructions;
};

export interface Question<TIdentifiers = {}, TOptions = {}> {
  instruction: string;
  hint?: string;
  correction?: string;
  startStatement?: string;
  answer?: string;
  answers?: string[];
  answerFormat?: "tex" | "raw";
  ggbAnswer?: string[];
  keyboardOptions?: KeyboardOptions;
  keys?: (KeyId | KeyProps)[];
  // keys?: KeyId[];
  ggbOptions?: GeogebraOptions;
  studentGgbOptions?: GeogebraOptions;
  correctionGgbOptions?: GeogebraOptions;
  style?: {
    tableHasNoHeader?: boolean;
  };
  divisionFormat?: "fraction" | "obelus";
  identifiers: TIdentifiers;
  options?: TOptions;
  answerTable?: string[][];
  initTable?: string[][];
  propositions?: Proposition[];
}

export type QCMGenerator<TIdentifiers, TOptions = {}> = (
  n: number,
  args: { answer: string } & TIdentifiers,
  options?: TOptions
) => Proposition[];
export type VEA<TIdentifiers, TOptions = {}> = (
  studentAnswer: string,
  args: { answer: string } & TIdentifiers,
  options?: TOptions
) => boolean;
export type TableVEA<TIdentifiers, TOptions = {}> = (
  studentAnswer: string[][],
  args: { answerTable: string[][] } & TIdentifiers,
  options?: TOptions
) => boolean;
export type GGBVEA<TIdentifiers, TOptions = {}> = (
  studentAnswer: string[],
  args: { ggbAnswer: string[] } & TIdentifiers,
  options?: TOptions
) => boolean;
export type QuestionGenerator<TIdentifiers = {}, TOptions = any> = (
  opts?: TOptions
) => Question<TIdentifiers, TOptions>;
export type GetHint<TIdentifiers, TOptions = {}> = (
  args: TIdentifiers,
  options?: TOptions
) => string;
export type GetCorrection<TIdentifiers, TOptions = {}> = (
  args: TIdentifiers,
  options?: TOptions
) => string;
export type GetInstruction<TIdentifiers, TOptions = {}> = (
  args: TIdentifiers,
  options?: TOptions
) => string;
export type GetStartStatement<TIdentifiers, TOptions = {}> = (
  args: TIdentifiers,
  options?: TOptions
) => string;
export type GetAnswer<TIdentifiers, TOptions = {}> = (
  args: TIdentifiers,
  options?: TOptions
) => string;
export type GetAnswerTable<TIdentifiers, TOptions = {}> = (
  args: TIdentifiers,
  options?: TOptions
) => string[][];
export type GetKeys<TIdentifiers, TOptions = {}> = (
  args: TIdentifiers,
  options?: TOptions
) => (KeyId | KeyProps)[];
export type GetGGBAnswer<TIdentifiers, TOptions = {}> = (
  args: TIdentifiers,
  options?: TOptions
) => string[];
export type GetGGBOptions<TIdentifiers, TOptions = {}> = (
  args: TIdentifiers,
  options?: TOptions
) => GeogebraOptions;
export type GetStudentGGBOptions<TIdentifiers, TOptions = {}> = (
  args: TIdentifiers,
  options?: TOptions
) => GeogebraOptions;
export type RebuildIdentifiers<TIdentifiers, TOptions = {}> = (
  oldIdentifiers: any,
  options?: TOptions
) => TIdentifiers;
export type GetQuestionFromIdentifiers<TIdentifiers, TOptions = {}> = (
  identifiers: TIdentifiers,
  options?: TOptions
) => Question<TIdentifiers, TOptions>;
export type QuestionHotFix<TIdentifiers, TOptions = {}> = (
  q: Question<TIdentifiers>,
  options?: TOptions
) => Question<TIdentifiers>;
export type ValidateOptions<TOptions = {}> = (options: TOptions) => {
  valid: boolean;
  message: string;
};
export type TestData<TIdentifiers, TOptions = {}> = {
  identifiers: TIdentifiers;
  options?: TOptions;
  answer: string;
  valids?: string[];
};
export type GetTests<TIdentifiers, TOptions = {}> = () => TestData<
  TIdentifiers,
  TOptions
>[];
type PDFOptions = {
  //on pourrait mettre ici des props pour geogebra
  shouldSpreadPropositions?: boolean;
};
export interface Exercise<TIdentifiers = {}, TOptions = {}> {
  id: string;
  isSingleStep: boolean;
  label: string;
  pdfOptions?: PDFOptions;
  options?: GeneratorOption[];
  sections?: (MathSection | PCSection)[];
  levels?: MathLevel[];
  connector?: "=" | "\\iff" | "\\approx";
  generator: (n: number, opts?: TOptions) => Question<TIdentifiers, TOptions>[];
  maxAllowedQuestions?: number;
  answerType?:
    | "GGB"
    | "QCM"
    | "free"
    | "QCU"
    | "valueTable"
    | "varTable"
    | "signTable";
  isQCM?: boolean;
  shouldHaveCalculator?: boolean;
  qcmTimer?: number;
  freeTimer?: number;
  ggbTimer?: number;
  valueTableTimer?: number;
  getPropositions?: QCMGenerator<{ answer: string } & TIdentifiers, TOptions>;
  isAnswerValid?: VEA<TIdentifiers, TOptions>;
  isAnswerTableValid?: TableVEA<TIdentifiers, TOptions>;
  isGGBAnswerValid?: GGBVEA<TIdentifiers, TOptions>;
  hasGeogebra?: boolean;
  subject: "Mathématiques" | "Chimie" | "Physique";
  hasHintAndCorrection?: boolean;
  getInstruction?: GetInstruction<TIdentifiers, TOptions>;
  getStartStatement?: GetStartStatement<TIdentifiers, TOptions>;
  getHint?: GetHint<TIdentifiers, TOptions>;
  getCorrection?: GetCorrection<TIdentifiers, TOptions>;
  getKeys?: GetKeys<TIdentifiers, TOptions>;
  getAnswer?: GetAnswer<TIdentifiers, TOptions>;
  getAnswerTable?: GetAnswerTable<TIdentifiers, TOptions>;

  getGGBAnswer?: GetGGBAnswer<TIdentifiers, TOptions>;
  getGGBOptions?: GetGGBOptions<TIdentifiers, TOptions>;
  getStudentGGBOptions?: GetStudentGGBOptions<TIdentifiers, TOptions>;
  rebuildIdentifiers?: RebuildIdentifiers<TIdentifiers, TOptions>;
  getQuestionFromIdentifiers: GetQuestionFromIdentifiers<
    TIdentifiers,
    TOptions
  >;
  hotFix?: QuestionHotFix<TIdentifiers, TOptions>;
  validateOptions?: (opts: TOptions) => { message: string; valid: boolean };
  getTests?: GetTests<TIdentifiers, TOptions>;
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
