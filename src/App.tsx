import { useEffect, useState } from "react";
import "./App.css";
import { Exercise, Question } from "./types";
import MathInput from "react-math-keyboard";
import MarkdownParser from "./markdownParser";
import { QuestionDisplay } from "./questionDisplay";
import { GeneratorsList } from "./generatorsList";

function App() {
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // setSelectedExercise(allExercises.find((exo) => exo.id === e.target.value));
    window.location.href = `/exo?exoId=${e.target.value}`;
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const exoId = url.searchParams.get("exoId");
    const isQCM = url.searchParams.get("isQCM");
    console.log(isQCM === "true");
    if (exoId) {
      if (isQCM === "true") {
        fetch(`http://localhost:5000/qcmExo?exoId=${exoId}`)
          .then((res) => res.json())
          .then((res) => {
            setSelectedExercise(res.exercise);
            setQuestions(res.questions);
          })
          .catch((err) => console.log(err));
      } else {
        fetch(`http://localhost:5000/exo?exoId=${exoId}`)
          .then((res) => res.json())
          .then((res) => {
            setSelectedExercise(res.exercise);
            setQuestions(res.questions);
          })
          .catch((err) => console.log(err));
      }
    } else {
      fetch("http://localhost:5000")
        .then((res) => res.json())
        .then((res) => setAllExercises(res))
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <div className="App" style={{ width: "90vw", padding: "50px" }}>
      {!!allExercises.length && (
        <>
          <select onChange={(e) => onChange(e)} defaultValue="">
            <option disabled selected value="">
              {" "}
              -- select an option --{" "}
            </option>
            {allExercises.map((exercise) => (
              <option value={exercise.id} key={exercise.id}>
                {exercise.label}
              </option>
            ))}
          </select>
          <GeneratorsList allExercises={allExercises} />
        </>
      )}
      {selectedExercise?.id && (
        <div style={{ width: "100%" }}>
          <MarkdownParser>{selectedExercise.label}</MarkdownParser>
          <p>Section : {selectedExercise.section}</p>
          <p>Connecteur : {selectedExercise.connector}</p>
          <p>Clavier : </p>
          <MathInput numericToolbarKeys={[]} />
          {selectedExercise.instruction && (
            <p>
              Instruction :<MarkdownParser>{selectedExercise.instruction}</MarkdownParser>
            </p>
          )}

          <p>Niveau : {selectedExercise.levels}</p>
          <p>Is Signle Step : {selectedExercise.isSingleStep ? "oui" : "non"}</p>
          {questions.map((question, index) => (
            <QuestionDisplay question={question} key={index} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
