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
  onSelect,
}: {
  allExercises: Exercise[];
  onSelect: (exoId: string) => void;
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
        <button
          key={generator.id}
          className="border-2 px-4 py-4"
          onClick={(e) => onSelect(generator.id)}
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
      ))}
    </div>
  );
};
