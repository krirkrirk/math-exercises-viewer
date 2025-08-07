import React from "react";
import MathInput from "react-math-keyboard";
import MarkdownParser from "./markdownParser";
import { Question } from "./types";

type Props = {
  question: Question;
  setTable: React.Dispatch<React.SetStateAction<string[][]>>;
};

export const TableAnswerInput = ({ question, setTable }: Props) => {
  return (
    <>
      {question.initTable?.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <td key={cellIndex}>
              {cell === "" ? (
                <MathInput
                  numericToolbarKeys={question.keys}
                  setValue={(x: string) =>
                    setTable((prev) =>
                      prev.map((row, rIndex) =>
                        row.map((cell, cIndex) =>
                          rowIndex === rIndex && cellIndex === cIndex ? x : cell
                        )
                      )
                    )
                  }
                  forbidOtherKeyboardKeys={true}
                  {...question.keyboardOptions}
                />
              ) : (
                <MarkdownParser text={cell ?? "\\ "} />
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};
