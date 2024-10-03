import MarkdownParser from "./markdownParser";
import { QuestionDisplay } from "./questionDisplay";
import { Exercise, Question } from "./types";

type Props = {
  isGGB: boolean;
  isQCM: boolean;
  selectedExercise: Exercise;
  onPrev: () => void;
  onNext: () => void;
  questions: Question[];
};
export const SelectedExercisePage = ({
  isGGB,
  isQCM,
  selectedExercise,
  onPrev,
  onNext,
  questions,
}: Props) => {
  return (
    <div style={{ width: "100%" }}>
      {!isGGB && (
        <button
          onClick={(e) =>
            (window.location.href =
              window.location.href.replace("&isQCM=true", "") + "&isGGB=true")
          }
          className="border-2 p-3"
        >
          Version GGB
        </button>
      )}
      {!isQCM && (
        <button
          onClick={(e) =>
            (window.location.href =
              window.location.href.replace("&isGGB=true", "") + "&isQCM=true")
          }
          className="border-2 p-3"
        >
          Version QCM
        </button>
      )}
      {(isQCM || isGGB) && (
        <button
          onClick={(e) =>
            (window.location.href = window.location.href
              .replace("&isQCM=true", "")
              .replace("&isGGB=true", ""))
          }
          className="border-2 p-3"
        >
          Version Free
        </button>
      )}

      <button onClick={(e) => onPrev()} className="border-2 p-3">
        Prev Generator
      </button>
      <button onClick={(e) => onNext()} className="border-2 p-3">
        Next Generator
      </button>
      <span className="flex p-3">
        <p className="m-0 mr-3 text-2xl">
          {selectedExercise.sections.join(", ")} {">>"}
        </p>
        <MarkdownParser text={selectedExercise.label}></MarkdownParser>
      </span>
      <p>Connecteur : {selectedExercise.connector}</p>

      <p>Niveaux : {selectedExercise.levels.join(", ")}</p>
      <p>
        {selectedExercise.isSingleStep ? "En une étape" : "Plusieurs étapes"}
      </p>

      {questions.map((question, index) => (
        <QuestionDisplay
          exo={selectedExercise}
          question={question}
          key={index}
          index={index}
          isQCM={isQCM}
          isGGB={isGGB}
        />
      ))}
    </div>
  );
};
