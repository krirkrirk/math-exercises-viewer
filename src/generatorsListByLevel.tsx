import { useEffect, useState } from "react";

import { quizPremiumGenerators } from "./collaborativeQuizPremiumGenerators";

import "./App.css";
import { Exercise, Level, Question } from "./types";
import MarkdownParser from "./markdownParser";

type MLExercise = {
  isPremium: boolean;
} & Exercise;

export const isGeneratorPremium = (generatorId: string) => {
  return quizPremiumGenerators.includes(generatorId);
};

export const GeneratorsListByLevel = ({
  allExercises,
}: {
  allExercises: Exercise[];
}) => {
  const [generatorData, setGeneratorData] = useState<
    { level: Level; data: MLExercise[] }[]
  >([]);
  useEffect(() => {
    if (!allExercises.length) return;

    const data: { level: Level; data: MLExercise[] }[] = [
      "6ème",
      "5ème",
      "4ème",
      "3ème",
      "2nde",
      "1reTech",
      "1reESM",
      "1reSpé",
      "TermSpé",
      "TermTech",
      "MathExp",
      "MathComp",
    ].map((level) => {
      return {
        level: level as Level,
        data: [],
      };
    });
    allExercises.forEach((generator, index) => {
      const levelsData = data.filter((el) =>
        generator.levels.includes(el.level)
      );
      levelsData.forEach((el) =>
        el.data.push({
          ...generator,
          isPremium: isGeneratorPremium(generator.id),
        })
      );
    });
    setGeneratorData(data);
  }, [allExercises]);
  return (
    <div className="flex">
      {generatorData.map((generatorData) => (
        <div key={generatorData.level} className="border-2 p-3 w-80 flex-none">
          <div>
            <div>
              <h5
                className="pl-4 border-e-4"
                style={{
                  borderBottom: "#D70040 solid",
                }}
              >
                {generatorData.level}
              </h5>
            </div>
            <div className="gap-y-1 flex flex-col">
              {generatorData.data.map((generator) => {
                return (
                  <div
                    key={generator.id}
                    className="border-2 px-4 py-2"
                    style={{
                      backgroundColor: isGeneratorPremium(generator.id)
                        ? "#D70040"
                        : "",
                    }}
                  >
                    <MarkdownParser text={generator.label}></MarkdownParser>
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
