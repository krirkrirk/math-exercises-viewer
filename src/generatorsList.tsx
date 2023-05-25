import { useEffect, useState } from "react";

import { quizPremiumGenerators } from "./collaborativeQuizPremiumGenerators";

import "./App.css";
import { Exercise, Question } from "./types";
import MathInput from "react-math-keyboard";
import MarkdownParser from "./markdownParser";
import { QuestionDisplay } from "./questionDisplay";

type MLExercise = {
  isPremium: boolean;
} & Exercise;

export const isGeneratorPremium = (generatorId: string) => {
  return quizPremiumGenerators.includes(generatorId);
};

export const GeneratorsList = ({ allExercises }: { allExercises: Exercise[] }) => {
  const [generatorData, setGeneratorData] = useState<{ level: string; data: MLExercise[] }[]>([]);
  console.log(quizPremiumGenerators);
  useEffect(() => {
    if (!allExercises.length) return;

    const data: { level: string; data: MLExercise[] }[] = ["6", "5", "4", "3", "2", "1", "0"].map((level) => {
      return {
        level: level,
        data: [],
      };
    });
    allExercises.forEach((generator, index) => {
      const levelsData = data.filter((el) => generator.levels.includes(el.level));
      levelsData.forEach((el) => el.data.push({ ...generator, isPremium: isGeneratorPremium(generator.id) }));
    });
    // console.log(data.map(data => data.data.map(generator => `${generator.id} : ${generator?.isPremium}`)))
    setGeneratorData(data);
  }, [allExercises]);
  return (
    <div className="flex">
      {generatorData.map((generatorData) => (
        <div key={generatorData.level} className="border-2 p-3">
          <div>
            <div>
              <h5>{generatorData.level}</h5>
            </div>
            <div style={{}}>
              {generatorData.data.map((generator) => {
                return (
                  <div key={generator.id} style={{ backgroundColor: isGeneratorPremium(generator.id) ? "red" : "" }}>
                    <MarkdownParser>{generator.label}</MarkdownParser>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
