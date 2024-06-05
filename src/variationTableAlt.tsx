import React, { useState, useEffect } from "react";
import "./variationTableAlt.css";

type VariationTableAltProps = {
  xValues: number[];
  fValues: number[];
  onValuesChange: (fValues: number[]) => void;
};

const WIDTH = 800;
const HEIGHT = 300;
const HEADER_HEIGHT = 50;
const TEXT_Y_OFFSET = 25;
const FX_Y_OFFSET = 100;
const Y_TOP = 0;
const Y_BOTTOM = 100;
const OFFSET = 10;
const BUTTON_SIZE = 30;
const BUTTON_BG_COLOR = "#28a745";
const BUTTON_TEXT_COLOR = "white";
const INPUT_WIDTH = 20;
const ARROW_MARKER_WIDTH = 10;
const ARROW_MARKER_HEIGHT = 10;

const VariationTableAlt: React.FC<VariationTableAltProps> = ({
  xValues,
  fValues,
  onValuesChange,
}) => {
  const [xVals, setXVals] = useState<number[]>(xValues);
  const [fVals, setFVals] = useState<number[]>(fValues);

  useEffect(() => {
    onValuesChange(fVals);
  }, [fVals]);

  const xStep = WIDTH / (xVals.length + 2);
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

  const addEmptyValues = () => {
    setXVals([...xVals, NaN]);
    setFVals([...fVals, NaN]);
  };

  const resetValues = () => {
    setXVals([]);
    setFVals([]);
  };

  const removeXValue = (index: number) => {
    const newXVals = xVals.filter((_, i) => i !== index);
    const newFVals = fVals.filter((_, i) => i !== index);
    setXVals(newXVals);
    setFVals(newFVals);
  };

  const handleXValueChange = (index: number, value: string) => {
    const newXVals = [...xVals];
    newXVals[index] = parseFloat(value);
    setXVals(newXVals);
  };

  const handleFValueChange = (index: number, value: string) => {
    const newFVals = [...fVals];
    newFVals[index] = parseFloat(value);
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
          const xPosAdjustment = 12.5 * (xVals.length - 2);
          const xPos = (index + 1) * xStep - xPosAdjustment;
          const yPosCurrent = getYPosition(index);

          return (
            <React.Fragment key={index}>
              {/* Valeurs de x */}
              <g className="value-group">
                <foreignObject
                  x={xPos + 110 - xPosAdjustment}
                  y={TEXT_Y_OFFSET - 15}
                  width="50"
                  height="30"
                >
                  <div className="value-container">
                    <input
                      type="text"
                      value={isNaN(x) ? "" : x}
                      onChange={(e) =>
                        handleXValueChange(index, e.target.value)
                      }
                      className="value-input"
                      style={{ color: "black", width: `${INPUT_WIDTH}px` }}
                    />
                    <button
                      onClick={() => removeXValue(index)}
                      className="remove-button"
                    >
                      X
                    </button>
                  </div>
                </foreignObject>
              </g>
              {/* Valeurs de f(x) */}
              <g className="value-group">
                <foreignObject
                  x={xPos + 110 - xPosAdjustment}
                  y={yPosCurrent + FX_Y_OFFSET - 15}
                  width="50"
                  height="30"
                >
                  <div className="value-container">
                    <input
                      type="text"
                      value={isNaN(fVals[index]) ? "" : fVals[index]}
                      onChange={(e) =>
                        handleFValueChange(index, e.target.value)
                      }
                      className="value-input"
                      style={{ color: "black", width: `${INPUT_WIDTH}px` }}
                    />
                  </div>
                </foreignObject>
              </g>
              {index < xVals.length - 1 && (
                <line
                  x1={xPos + xStep / 2 + OFFSET + 35}
                  y1={yPosCurrent + FX_Y_OFFSET}
                  x2={xPos + xStep + xStep / 2 - OFFSET + 15}
                  y2={getYPosition(index + 1) + FX_Y_OFFSET}
                  stroke="black"
                  markerEnd="url(#arrow)"
                />
              )}
            </React.Fragment>
          );
        })}
        <foreignObject
          x={
            xVals.length === 0
              ? xStep + (xStep - BUTTON_SIZE) / 2
              : (xVals.length + 1) * xStep - 15
          }
          y={TEXT_Y_OFFSET - 15}
          width={BUTTON_SIZE}
          height={BUTTON_SIZE}
        >
          <button
            onClick={addEmptyValues}
            className="add-button"
            style={{
              width: `${BUTTON_SIZE}px`,
              height: `${BUTTON_SIZE}px`,
              backgroundColor: BUTTON_BG_COLOR,
              border: "none",
              borderRadius: "50%",
              color: BUTTON_TEXT_COLOR,
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            +
          </button>
        </foreignObject>
        <defs>
          <marker
            id="arrow"
            markerWidth={ARROW_MARKER_WIDTH}
            markerHeight={ARROW_MARKER_HEIGHT}
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

export default VariationTableAlt;
