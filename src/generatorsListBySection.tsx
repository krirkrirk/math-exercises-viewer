import { useEffect, useState } from "react";

import { quizPremiumGenerators } from "./collaborativeQuizPremiumGenerators";

import "./App.css";
import { Exercise, Question, Section } from "./types";
import MarkdownParser from "./markdownParser";

type MLExercise = {
  isPremium: boolean;
} & Exercise;

export const isGeneratorPremium = (generatorId: string) => {
  return quizPremiumGenerators.includes(generatorId);
};

export const GeneratorsListBySection = ({
  allExercises,
}: {
  allExercises: Exercise[];
}) => {
  const [generatorData, setGeneratorData] = useState<
    { section: string; data: MLExercise[] }[]
  >([]);
  useEffect(() => {
    if (!allExercises.length) return;

    const data: { section: Section; data: MLExercise[] }[] = [];

    allExercises.forEach((exo) => {
      const sectionsData = data.filter((el) =>
        exo.sections.includes(el.section)
      );
      if (!sectionsData.length) {
        exo.sections.forEach((section) =>
          data.push({
            section,
            data: [{ ...exo, isPremium: isGeneratorPremium(exo.id) }],
          })
        );
      } else {
        sectionsData.forEach((sectionData) => {
          data
            .find((d) => d.section === sectionData.section)
            ?.data.push({
              ...exo,
              isPremium: isGeneratorPremium(exo.id),
            });
        });
      }
    });

    setGeneratorData(data);
  }, [allExercises]);
  return (
    <div className="flex">
      {generatorData.map((generatorData) => (
        <div
          key={generatorData.section}
          className="border-2 p-3 w-80 flex-none"
        >
          <div>
            <div>
              <h5>{generatorData.section}</h5>
            </div>
            <div style={{}}>
              {generatorData.data.map((generator) => {
                return (
                  <div
                    key={generator.id}
                    className="border-2 p-2"
                    style={{
                      backgroundColor: isGeneratorPremium(generator.id)
                        ? "red"
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
