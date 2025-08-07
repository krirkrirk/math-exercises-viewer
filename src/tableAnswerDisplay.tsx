import MarkdownParser from "./markdownParser";

type Props = {
  answerTable: string[][];
};

export const TableAnswerDisplay = ({ answerTable }: Props) => {
  return (
    <>
      {answerTable.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <td key={cellIndex}>
              <MarkdownParser text={cellIndex === 0 ? cell : `$${cell}$`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};
