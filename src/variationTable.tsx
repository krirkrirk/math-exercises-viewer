import React, { useState } from "react";
import "./variationTable.css"; // Assurez-vous d'importer le fichier CSS

type VariationTableProps = {
  xValues: number[];
  fValues: number[];
};

const WIDTH = 800;
const HEIGHT = 300; // Increase height to accommodate buttons
const HEADER_HEIGHT = 50;
const TEXT_Y_OFFSET = 25;
const FX_Y_OFFSET = 75;
const Y_TOP = 0;
const Y_BOTTOM = 100;
const OFFSET = 10;

const VariationTable: React.FC<VariationTableProps> = ({
  xValues,
  fValues,
}) => {
  const [xVals, setXVals] = useState<number[]>(xValues);
  const [fVals, setFVals] = useState<number[]>(fValues);
  const [inputValue, setInputValue] = useState<number | string>("");

  const xStep = WIDTH / (xVals.length + 1);
  const initialYPosition = fVals[0] > fVals[1] ? Y_TOP : Y_BOTTOM;

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  };

  const addXValue = () => {
    const newValue = parseFloat(inputValue as string);
    if (!isNaN(newValue)) {
      setXVals([...xVals, newValue]);
      setInputValue("");
    }
  };

  const addFValue = () => {
    const newValue = parseFloat(inputValue as string);
    if (!isNaN(newValue)) {
      setFVals([...fVals, newValue]);
      setInputValue("");
    }
  };

  const resetValues = () => {
    setXVals([]);
    setFVals([]);
  };

  const removeXValue = (index: number) => {
    const newXVals = xVals.filter((_, i) => i !== index);
    setXVals(newXVals);
  };

  const removeFValue = (index: number) => {
    const newFVals = fVals.filter((_, i) => i !== index);
    setFVals(newFVals);
  };

  return (
    <div>
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
        {xVals.map((x, index) => {
          const xPos = (index + 1) * xStep;
          const yPosCurrent = getYPosition(index);

          return (
            <React.Fragment key={index}>
              {/* Valeurs de x */}
              <g className="value-group">
                <text
                  x={xPos + xStep / 2}
                  y={TEXT_Y_OFFSET}
                  fontSize="12"
                  textAnchor="middle"
                >
                  {x}
                </text>
                <foreignObject
                  x={xPos + xStep / 2 + 10}
                  y={TEXT_Y_OFFSET - 10}
                  width="20"
                  height="20"
                >
                  <button
                    onClick={() => removeXValue(index)}
                    className="remove-button"
                  >
                    X
                  </button>
                </foreignObject>
              </g>
              {/* Valeurs de f(x) */}
              <g className="value-group">
                <text
                  x={xPos + xStep / 2}
                  y={yPosCurrent + FX_Y_OFFSET}
                  fontSize="12"
                  textAnchor="middle"
                >
                  {fVals[index]}
                </text>
                <foreignObject
                  x={xPos + xStep / 2 + 10}
                  y={yPosCurrent + FX_Y_OFFSET - 10}
                  width="20"
                  height="20"
                >
                  <button
                    onClick={() => removeFValue(index)}
                    className="remove-button"
                  >
                    X
                  </button>
                </foreignObject>
              </g>
              {index < xVals.length - 1 && (
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
      <div
        style={{
          marginBottom: "20px",
          marginTop: "10px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Entrez la valeur"
          style={{
            marginRight: "10px",
            padding: "5px",
            color: "black",
            border: "1px solid #ccc",
            borderRadius: "4px",
            outline: "none",
          }}
        />
        <button
          onClick={addXValue}
          style={{
            marginRight: "10px",
            padding: "5px 10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add x Value
        </button>
        <button
          onClick={addFValue}
          style={{
            marginRight: "10px",
            padding: "5px 10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add f(x) Value
        </button>
        <button
          onClick={resetValues}
          style={{
            padding: "5px 10px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default VariationTable;
