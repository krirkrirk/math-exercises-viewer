import { useEffect, useState } from "react";
import "./App.css";
import { Exercise, Question } from "./types";
import MathInput from "react-math-keyboard";
import MarkdownParser from "./markdownParser";
import { QuestionDisplay } from "./questionDisplay";
import { GeneratorsList } from "./generatorsList";
import { GeneratorsListByLevel } from "./generatorsListByLevel";
import { GeneratorsListBySection } from "./generatorsListBySection";

function App() {
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [prevExoId, setPrevExoId] = useState("");
  const [nextExoId, setNextExoId] = useState("");
  const [exoCount, setExoCount] = useState(0);
  const onSelect = (exoId: string) => {
    // setSelectedExercise(allExercises.find((exo) => exo.id === e.target.value));
    window.location.href = `/exo?exoId=${exoId}`;
  };

  const [isQCM, setIsQCM] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const exoId = url.searchParams.get("exoId");
    const qcm = url.searchParams.get("isQCM");
    setIsQCM(qcm === "true");
    if (exoId) {
      if (qcm === "true") {
        fetch(`http://localhost:5000/qcmExo?exoId=${exoId}`)
          .then((res) => res.json())
          .then((res) => {
            setSelectedExercise(res.exercise);
            setQuestions(res.questions);
            setNextExoId(res.nextId);
            setPrevExoId(res.prevId);
          })
          .catch((err) => console.log(err));
      } else {
        fetch(`http://localhost:5000/exo?exoId=${exoId}`)
          .then((res) => res.json())
          .then((res) => {
            setSelectedExercise(res.exercise);
            setQuestions(res.questions);

            setNextExoId(res.nextId);
            setPrevExoId(res.prevId);
          })
          .catch((err) => console.log(err));
      }
    } else {
      fetch("http://localhost:5000")
        .then((res) => res.json())
        .then((res) => {
          setAllExercises(res);
          setExoCount(res.length);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const [displayType, setDisplayType] = useState<
    "all" | "byLevel" | "bySection"
  >("all");

  const onNext = () => {
    if (!nextExoId) return;
    onSelect(nextExoId);
  };

  const onPrev = () => {
    if (!prevExoId) return;
    onSelect(prevExoId);
  };
  return (
    <div className="App" style={{ width: "90vw", padding: "50px" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        fill="currentColor"
        // class="bi bi-google"
        viewBox="0 0 16 16"
      >
        <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
      </svg>
      {!!allExercises.length && (
        <div>
          <p>{exoCount} Générateurs</p>
          <div>
            <button onClick={(e) => setDisplayType("all")}>Tous</button>
            <button onClick={(e) => setDisplayType("byLevel")}>Niveaux</button>
            <button onClick={(e) => setDisplayType("bySection")}>
              Sections
            </button>
          </div>
          {displayType === "all" && (
            <GeneratorsList allExercises={allExercises} onSelect={onSelect} />
          )}
          {displayType === "byLevel" && (
            <GeneratorsListByLevel allExercises={allExercises} />
          )}
          {displayType === "bySection" && (
            <GeneratorsListBySection allExercises={allExercises} />
          )}
        </div>
      )}
      {selectedExercise?.id && (
        <div style={{ width: "100%" }}>
          {!isQCM && (
            <button
              onClick={(e) =>
                (window.location.href = window.location.href + "&isQCM=true")
              }
              className="border-2 p-3"
            >
              Version QCM
            </button>
          )}
          {isQCM && (
            <button
              onClick={(e) =>
                (window.location.href = window.location.href.replace(
                  "&isQCM=true",
                  ""
                ))
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
            <p className="mr-3 text-2xl">
              {selectedExercise.sections.join(", ")} {">>"}
            </p>
            <MarkdownParser text={selectedExercise.label}></MarkdownParser>
          </span>
          <p>Connecteur : {selectedExercise.connector}</p>

          <p>Niveaux : {selectedExercise.levels.join(", ")}</p>
          <p>
            {selectedExercise.isSingleStep
              ? "En une étape"
              : "Plusieurs étapes"}
          </p>

          {questions.map((question, index) => (
            <QuestionDisplay
              exo={selectedExercise}
              question={question}
              key={index}
              index={index}
              isQCM={isQCM}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
