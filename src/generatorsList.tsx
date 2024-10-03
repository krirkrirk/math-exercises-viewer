import { useEffect, useState } from "react";

import { quizPremiumGenerators } from "./collaborativeQuizPremiumGenerators";

import "./App.css";
import { Exercise, Question } from "./types";
import MarkdownParser from "./markdownParser";

type MLExercise = {
  isPremium: boolean;
} & Exercise;

export const isGeneratorPremium = (generatorId: string) => {
  return quizPremiumGenerators.includes(generatorId);
};

export const GeneratorsList = ({
  allExercises,
}: {
  allExercises: Exercise[];
}) => {
  const [generatorData, setGeneratorData] = useState<MLExercise[]>([]);
  useEffect(() => {
    if (!allExercises.length) return;
    setGeneratorData(
      allExercises.map((el) => {
        return { ...el, isPremium: isGeneratorPremium(el.id) };
      })
    );
  }, [allExercises]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {generatorData.map((generator) => (
        <a key={generator.id} href={`/exo?exoId=${generator.id}`}>
          <button
            key={generator.id}
            className="border-2 px-4 py-4"
            style={{
              ...(generator.hasHintAndCorrection && {
                color: "white",
                backgroundColor: "#097969",
              }),
            }}
          >
            <div key={generator.id}>
              <MarkdownParser text={generator.label}></MarkdownParser>
            </div>
          </button>
        </a>
      ))}
    </div>
  );
};
