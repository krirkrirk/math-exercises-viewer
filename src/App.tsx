import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Exercise, Question } from "./types";
import { MathComponent } from "mathjax-react";
import MathInput from "react-math-keyboard";
function App() {
  const [count, setCount] = useState(0);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [exercise, setExercise] = useState<Exercise>();
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
          setExercise(res.exercise);
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
        <select onChange={(e) => onChange(e)}>
          {allExercises.map((exo) => (
            <option value={exo.id} key={exo.id}>
              {exo.label}
            </option>
          ))}
        </select>
      )}
      {exercise?.id && (
        <div>
          <p>{exercise.label}</p>
          <p>Section : {exercise.section}</p>
          <p>Connecteur : {exercise.connector}</p>
          {exercise.instruction && <p>Instruction : {exercise.instruction}</p>}
          <p>Niveau : {exercise.levels}</p>
          <p>Is Signle Step : {exercise.isSingleStep ? "oui" : "non"}</p>
          <MathInput />
          {questions.map((question, index) => (
            <div key={index} className="border-white  bg-gray-500">
              {question.instruction && <p>{question.instruction}</p>}
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
