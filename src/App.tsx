import { useEffect, useState } from "react";
import "./App.css";
import { Exercise, Question } from "./types";
import MathInput from "react-math-keyboard";
import MarkdownParser from "./markdownParser";
import { QuestionDisplay } from "./questionDisplay";
import { GeneratorsList } from "./generatorsList";
import { GeneratorsListByLevel } from "./generatorsListByLevel";
import { GeneratorsListBySection } from "./generatorsListBySection";
import { TableOfTwoEntries } from "./tableOfTwoEntries";

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
  const [isTable, setIsTable] = useState(false);
  useEffect(() => {
    const url = new URL(window.location.href);
    const exoId = url.searchParams.get("exoId");
    const qcm = url.searchParams.get("isQCM");
    const table = url.searchParams.get("isTable");
    setIsQCM(qcm === "true");
    setIsTable(table === "true")
    if (exoId) {
      if (table === "true"){
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
                (window.location.href = window.location.href.replace("&isTable=true","") + "&isQCM=true")
              }
              className="border-2 p-3"
            >
              Version QCM
            </button>
          )}
          {!isTable &&(
            <button
              onClick={(e) =>
                (window.location.href = window.location.href.replace("&isQCM=true","") + "&isTable=true")
              }
              className="border-2 p-3"
              >
                Version Table
            </button>
          )}
          {(isQCM || isTable) && (
              <button
                onClick={(e) =>
                  (window.location.href = window.location.href.replace(
                    "&isQCM=true",
                    ""
                  ).replace("&isTable=true",""))
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
              isTable={isTable}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
