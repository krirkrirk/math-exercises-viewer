import React from "react";

type VariationTableProps = {
  xValues: number[];
  fValues: number[];
};

const WIDTH = 800;
const HEIGHT = 400;
const HEADER_HEIGHT = 50;
const TEXT_Y_OFFSET = 25;
const FX_Y_OFFSET = 75;
const Y_TOP = 100;
const Y_BOTTOM = 200;
const OFFSET = 10;

const VariationTable: React.FC<VariationTableProps> = ({
  xValues,
  fValues,
}) => {
  const xStep = WIDTH / (xValues.length + 1);
  const initialYPosition = fValues[0] > fValues[1] ? Y_TOP : Y_BOTTOM;

  const getYPosition = (index: number) => {
    const isEven = index % 2 === 0;
    return initialYPosition === Y_TOP
      ? isEven
        ? Y_TOP
        : Y_BOTTOM
      : isEven
      ? Y_BOTTOM
      : Y_TOP;
  };

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        background: "white",
        border: "1px solid black",
        display: "block",
        margin: "0 auto",
      }}
    >
      {/* Ligne du haut */}
      <line x1={0} y1={0} x2={WIDTH} y2={0} stroke="black" />
      {/* Ligne du bas */}
      <line x1={0} y1={HEIGHT} x2={WIDTH} y2={HEIGHT} stroke="black" />
      {/* Première colonne */}
      <line x1={xStep} y1={0} x2={xStep} y2={HEIGHT} stroke="black" />
      {/* Ligne séparant x de f(x) */}
      <line
        x1={0}
        y1={HEADER_HEIGHT}
        x2={WIDTH}
        y2={HEADER_HEIGHT}
        stroke="black"
      />
      {/* Texte des en-têtes */}
      <text x={xStep / 2} y={TEXT_Y_OFFSET} fontSize="14" textAnchor="middle">
        x
      </text>
      <text
        x={xStep / 2}
        y={(HEIGHT + HEADER_HEIGHT) / 2}
        fontSize="14"
        textAnchor="middle"
      >
        f(x)
      </text>
      {xValues.map((x, index) => {
        const xPos = (index + 1) * xStep;
        const yPosCurrent = getYPosition(index);

        return (
          <React.Fragment key={index}>
            {/* Valeurs de x */}
            <text
              x={xPos + xStep / 2}
              y={TEXT_Y_OFFSET}
              fontSize="12"
              textAnchor="middle"
            >
              {x}
            </text>
            {/* Valeurs de f(x) */}
            <text
              x={xPos + xStep / 2}
              y={yPosCurrent + FX_Y_OFFSET}
              fontSize="12"
              textAnchor="middle"
            >
              {fValues[index]}
            </text>
            {index < xValues.length - 1 && (
              <line
                x1={xPos + xStep / 2 + OFFSET}
                y1={yPosCurrent + FX_Y_OFFSET}
                x2={xPos + xStep + xStep / 2 - OFFSET}
                y2={getYPosition(index + 1) + FX_Y_OFFSET}
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
