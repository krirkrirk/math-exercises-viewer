import React from "react";
import MathJaxComponent from "./mathJaxComponent";

type VariationTableProps = {
  xValues: number[];
  fValues: number[];
};

const VariationTable: React.FC<VariationTableProps> = ({
  xValues,
  fValues,
}) => {
  const width = 1200;
  const height = 800;
  const xStep = width / (xValues.length + 1);
  const yMax = Math.max(...fValues);
  const yMin = Math.min(...fValues) - 5;
  const yRange = yMax - yMin;
  const yScale = height / (yRange * 1.2);

  // Determine the unique y positions for different fValues
  const yPositions = fValues.map(
    (value) => height - yScale * (value - yMin) - 50
  );
  const uniqueYPositions = Array.from(new Set(yPositions));

  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: "white", border: "1px solid black" }}
    >
      {/* Ligne du haut */}
      <line x1={0} y1={50} x2={width} y2={50} stroke="black" />
      {/* Ligne du bas */}
      <line x1={0} y1={height} x2={width} y2={height} stroke="black" />
      {/* Première colonne */}
      <line x1={xStep} y1={0} x2={xStep} y2={height} stroke="black" />
      {/* Ligne séparant x de f(x) */}
      <line x1={0} y1={100} x2={width} y2={100} stroke="black" />
      {/* Texte des en-têtes */}
      <foreignObject x={xStep / 2 - 20} y={55} width="40" height="40">
        <MathJaxComponent latex={"x"} />
      </foreignObject>
      <foreignObject x={xStep / 2 - 20} y={105} width="40" height="40">
        <MathJaxComponent latex={"f(x)"} />
      </foreignObject>
      {xValues.map((x, index) => {
        const xPos = (index + 1) * xStep;
        const yPos = uniqueYPositions.indexOf(
          height - yScale * (fValues[index] - yMin) - 50
        );
        return (
          <React.Fragment key={index}>
            {/* Valeurs de x */}
            <foreignObject x={xPos + 30} y={55} width="40" height="40">
              <MathJaxComponent latex={`${x}`} />
            </foreignObject>
            {/* Valeurs de f(x) */}
            <foreignObject
              x={xPos + 30}
              y={uniqueYPositions[yPos] + 90}
              width="40"
              height="40"
            >
              <MathJaxComponent latex={`${fValues[index]}`} />
            </foreignObject>
            {index > 0 && (
              <line
                x1={index * xStep + 55}
                y1={
                  uniqueYPositions[
                    uniqueYPositions.indexOf(
                      height - yScale * (fValues[index - 1] - yMin) - 50
                    )
                  ] + 90
                }
                x2={xPos + 30}
                y2={uniqueYPositions[yPos] + 90}
                stroke="black"
                markerEnd="url(#arrow)"
              />
            )}
          </React.Fragment>
        );
      })}
      <defs>
        <marker
          id="arrow"
          markerWidth="10"
          markerHeight="10"
          refX="5"
          refY="5"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#000" />
        </marker>
      </defs>
    </svg>
  );
};

export default VariationTable;
