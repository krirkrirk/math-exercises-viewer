import { useEffect, useState } from "react";
import "./App.css";
import { Exercise, Question } from "./types";
import MathInput from "react-math-keyboard";
import MarkdownParser from "./markdownParser";
import { QuestionDisplay } from "./questionDisplay";
import { GeneratorsList } from "./generatorsList";
import { GeneratorsListByLevel } from "./generatorsListByLevel";
import { GeneratorsListBySection } from "./generatorsListBySection";
import { SelectedExercisePage } from "./selectedExercisePage";

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
  const [isGGB, setIsGGB] = useState(false);

  const [showGeogebraExos, setShowGeogebraExos] = useState(
    window.location.href.includes("showGGB=true")
  );
  const [showStudentGeogebraExos, setShowStudentGeogebraExos] = useState(
    window.location.href.includes("showStudentGGB=true")
  );
  useEffect(() => {
    if (showGeogebraExos) {
      if (window.location.href.includes("showGGB"))
        window.location.href.replace("showGGB=false", "showGGB=true");
      else {
        window.location.href += "?showGGB=true";
      }
    } else {
      window.location.href.replace("?showGGB=true", "");
    }
  }, [showGeogebraExos]);
  useEffect(() => {
    if (showStudentGeogebraExos) {
      if (window.location.href.includes("showStudentGGB"))
        window.location.href.replace(
          "showStudentGGB=false",
          "showStudentGGB=true"
        );
      else {
        window.location.href += "?showStudentGGB=true";
      }
    } else {
      window.location.href.replace("?showStudentGGB=true", "");
    }
  }, [showStudentGeogebraExos]);
  useEffect(() => {
    const url = new URL(window.location.href);
    const exoId = url.searchParams.get("exoId");
    const exoOptions = url.searchParams.get("options");
    const qcm = url.searchParams.get("isQCM");
    const ggb = url.searchParams.get("isGGB");
    setIsQCM(qcm === "true");
    setIsGGB(ggb === "true");
    const isMathlive = url.pathname.includes("mathlive");
    const isXplive = url.pathname.includes("xplive");
    const showGeogebraExos = url.href.includes("showGGB=true");
    const showStudentGGBExos = url.href.includes("showStudentGGB=true");
    const exoFilter = (exo: Exercise) => {
      if (showGeogebraExos && !exo.hasGeogebra) return false;
      if (showStudentGGBExos && exo.answerType !== "GGB") return false;
      return true;
    };
    if (exoId) {
      if (ggb === "true") {
        fetch(`http://localhost:5000/exo?exoId=${exoId}&options=${exoOptions}`)
          .then((res) => res.json())
          .then((res) => {
            setSelectedExercise(res.exercise);
            setQuestions(res.questions);

            setNextExoId(res.nextId);
            setPrevExoId(res.prevId);
          })
          .catch((err) => console.log(err));
      } else if (qcm === "true") {
        fetch(
          `http://localhost:5000/qcmExo?exoId=${exoId}&options=${exoOptions}`
        )
          .then((res) => res.json())
          .then((res) => {
            setSelectedExercise(res.exercise);
            setQuestions(res.questions);
            setNextExoId(res.nextId);
            setPrevExoId(res.prevId);
          })
          .catch((err) => console.log(err));
      } else {
        fetch(`http://localhost:5000/exo?exoId=${exoId}&options=${exoOptions}`)
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
      if (isMathlive) {
        fetch("http://localhost:5000/mathlive")
          .then((res) => res.json())
          .then((res) => {
            setAllExercises(res.filter(exoFilter));
            setExoCount(res.length);
          })
          .catch((err) => console.log(err));
      } else if (isXplive) {
        fetch("http://localhost:5000/xplive")
          .then((res) => res.json())
          .then((res) => {
            setAllExercises(res.filter(exoFilter));
            setExoCount(res.length);
          })
          .catch((err) => console.log(err));
      } else {
        fetch("http://localhost:5000")
          .then((res) => res.json())
          .then((res) => {
            setAllExercises(res.filter(exoFilter));
            setExoCount(res.length);
          })
          .catch((err) => console.log(err));
      }
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
    <div className="App" style={{ width: "100vw", padding: "20px 50px" }}>
      <div style={{ display: "flex", columnGap: "1rem" }}>
        <button onClick={(e) => (window.location.href = "/mathlive")}>
          MathLive
        </button>
        <button onClick={(e) => (window.location.href = "/xplive")}>
          XpLive
        </button>
        <div>
          <input
            type="checkbox"
            id="ggb"
            name="ggb"
            checked={showGeogebraExos}
            onChange={(e) => setShowGeogebraExos(e.target.checked)}
          />
          <label>Geogebra</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="studentGgb"
            name="studentGgb"
            checked={showStudentGeogebraExos}
            onChange={(e) => setShowStudentGeogebraExos(e.target.checked)}
          />
          <label>Student Geogebra</label>
        </div>
      </div>
      {!!allExercises.length && (
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <p>{exoCount} Générateurs</p>
            <div
              style={{
                backgroundColor: "white",
                width: "2rem",
                height: "1rem",
                marginLeft: "2rem",
                marginRight: "0.5rem",
                padding: "3px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#097969",
                  width: "100%",
                  height: "100%",
                }}
              ></div>
            </div>
            <p> : Hint & correction ✅</p>
            <div
              style={{
                backgroundColor: "white",
                width: "2rem",
                height: "1rem",
                marginLeft: "2rem",
                marginRight: "0.5rem",
                padding: "3px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#D70040",
                  width: "100%",
                  height: "100%",
                }}
              ></div>
            </div>
            <p> : Premium 💰</p>
          </div>
          <div style={{ display: "flex", columnGap: "1rem" }}>
            <button onClick={(e) => setDisplayType("all")}>Tous</button>
            <button onClick={(e) => setDisplayType("byLevel")}>Niveaux</button>
            <button onClick={(e) => setDisplayType("bySection")}>
              Sections
            </button>
          </div>
          {displayType === "all" && (
            <GeneratorsList allExercises={allExercises} />
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
        <SelectedExercisePage
          isGGB={isGGB}
          isQCM={isQCM}
          selectedExercise={selectedExercise}
          onPrev={onPrev}
          onNext={onNext}
          questions={questions}
        />
      )}
    </div>
  );
}

export default App;
