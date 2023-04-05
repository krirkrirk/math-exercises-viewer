import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Exercise, Question } from "./types";
import { MathComponent } from "mathjax-react";
import MathInput from "react-math-keyboard";
import MarkdownParser from "./markdownParser";

function App() {
  const [count, setCount] = useState(0);
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

    if (exoId) {
      fetch(`http://localhost:5000/exo?exoId=${exoId}`)
        .then((res) => res.json())
        .then((res) => {
          setSelectedExercise(res.exercise);
          setQuestions(res.questions);
        })
        .catch((err) => console.log(err));
    } else {
      fetch("http://localhost:5000")
        .then((res) => res.json())
        .then((res) => setAllExercises(res))
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <div className="App">
      <MathInput numericToolbarKeys={["x", "y"]} />
      {!!allExercises.length && (
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
      )}
      {selectedExercise?.id && (
        <div>
          <MarkdownParser>{selectedExercise.label}</MarkdownParser>
          <p>Section : {selectedExercise.section}</p>
          <p>Connecteur : {selectedExercise.connector}</p>
          {selectedExercise.instruction && (
            <p>
              Instruction :<MarkdownParser>{selectedExercise.instruction}</MarkdownParser>
            </p>
          )}

          <p>Niveau : {selectedExercise.levels}</p>
          <p>Is Signle Step : {selectedExercise.isSingleStep ? "oui" : "non"}</p>
          {questions.map((question, index) => (
            <div key={index} className="border-white  bg-gray-500">
              {question.instruction && <MarkdownParser>{question.instruction}</MarkdownParser>}
              <p>Départ :</p>
              {question.startStatement && <MathComponent tex={question.startStatement} />}
              <p>Clavier : </p>
              {/* 
              ajouter les clés définis par la question
              <MathInput numericToolbarKeys={} />
              */}
              <p>Réponse : </p>
              <MathComponent tex={question.answer} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
