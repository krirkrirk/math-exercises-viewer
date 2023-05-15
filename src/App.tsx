import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Exercise, Question } from "./types";
import { MathComponent } from "mathjax-react";
import MathInput from "react-math-keyboard";
import MarkdownParser from "./markdownParser";
import { QuestionDisplay } from "./questionDisplay";
import { Configuration, OpenAIApi } from "openai";

function App() {
  const [count, setCount] = useState(0);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise>();
  const [questions, setQuestions] = useState<Question[]>([]);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // setSelectedExercise(allExercises.find((exo) => exo.id === e.target.value));
    window.location.href = `/exo?exoId=${e.target.value}`;
  };
  console.log(allExercises);
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

  /*const chatGPT = async () => {
    const configuration = new Configuration({
      apiKey: "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", // Idéalement, vous aurez mis votre clé api dans l'env
    });
    const openai = new OpenAIApi(configuration);

    const prompt = `
    Pour un QCM je veux uniquemnt 4 propositions concernant la question suivante : 
    instruction : ${selectedExercise?.instruction || questions[0].instruction} 
    startStamenent : ${questions[0]?.startStatement}
    et la réponse à cette question : ${questions[0].answer}.
    Les 4 propositions doivent etre séparés par des points virgules et sans énumérations. j'insiste sur ces deux remarques !!`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log(prompt);
    console.log(completion.data.choices[0].message?.content);

    const str = completion.data.choices[0].message?.content ?? "";
    const mots: string[] = str.split(";");
    console.log(mots);
  };

  const timeout = useRef<any>();

  const debounce = (func: any) => {
    const later = () => {
      clearTimeout(timeout.current);
      func();
    };

    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(later, 1000);
  };

  useEffect(() => {
    debounce(chatGPT);
  }, [questions]);
*/
  return (
    <div className="App">
      {/* Un exemple d'un tableau. Il n'y a pas les bordures, c'est normal, mais il devrait s'afficher sans les "|" */}
      <MarkdownParser>
        {`
| foo | bar |
| --- | --- |
| baz | bim |
`}
      </MarkdownParser>
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
          <p>Clavier : </p>
          <MathInput numericToolbarKeys={[]} />
          {selectedExercise.instruction && (
            <p>
              Instruction :
              <MarkdownParser>{selectedExercise.instruction}</MarkdownParser>
            </p>
          )}

          <p>Niveau : {selectedExercise.levels}</p>
          <p>
            Is Signle Step : {selectedExercise.isSingleStep ? "oui" : "non"}
          </p>
          {questions.map((question, index) => (
            <QuestionDisplay question={question} key={index} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
