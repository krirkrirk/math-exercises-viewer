import React from "react";
import MathJaxSvg from "./mathJaxSvg";

type VariationTableProps = {
  xValues: number[];
  fValues: number[];
};

const VariationTable: React.FC<VariationTableProps> = ({
  xValues,
  fValues,
}) => {
  const width = 800;
  const height = 400;
  const xStep = width / (xValues.length + 1);
  const yMax = Math.max(...fValues);
  const yMin = Math.min(...fValues) - 5;
  const yRange = yMax - yMin;
  const yScale = height / (yRange * 1.2);

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
      <text x={xStep / 2} y={75} fontSize="14" textAnchor="middle">
        x
      </text>
      <text x={xStep / 2} y={200} fontSize="14" textAnchor="middle">
        f(x)
      </text>
      {xValues.map((x, index) => {
        const xPos = (index + 1) * xStep;
        const yPos = height - yScale * (fValues[index] - yMin) - 50;
        return (
          <React.Fragment key={index}>
            {/* Valeurs de x */}
            <text x={xPos + 50} y={75} fontSize="12" textAnchor="middle">
              {x}
            </text>
            {/* Valeurs de f(x) */}
            <text
              x={xPos + 50}
              y={yPos + 100}
              fontSize="12"
              textAnchor="middle"
            >
              {fValues[index]}
            </text>
            {index > 0 && (
              <line
                x1={index * xStep + 55}
                y1={height - yScale * (fValues[index - 1] - yMin) + 50} // Adjust y position for shorter arrows
                x2={xPos + 40}
                y2={yPos + 100}
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
