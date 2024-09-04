import { GeogebraOptions, Question } from "./types";

export const ggbStudentAnswerOnLoad = (
  app: any,
  ggbOptions: GeogebraOptions
) => {
  if (!ggbOptions?.coords?.length) return;

  if (ggbOptions?.commands) {
    ggbOptions.commands.forEach((command) => app.evalCommand(command));
  }

  app.setCoordSystem(...ggbOptions?.coords);
  if (ggbOptions?.hideAxes) {
    app.evalCommand("ShowAxes(false)");
  }
  if (ggbOptions?.hideGrid) {
    app.evalCommand("ShowGrid(false)");
  }

  const gridDistance = ggbOptions?.gridDistance;
  if (gridDistance) {
    app.setGraphicsOptions(1, {
      gridDistance: { x: gridDistance[0], y: gridDistance[1] },
    });
  }
  const isGridBold = ggbOptions?.isGridBold;
  if (isGridBold) {
    app.setGraphicsOptions(1, {
      gridIsBold: false,
    });
  }
  const isGridSimple = ggbOptions?.isGridSimple;
  if (isGridSimple) {
    app.setGraphicsOptions(1, {
      gridType: 0,
    });
  }

  const enableShiftDragZoom = !ggbOptions?.forbidShiftDragZoom;
  app.enableShiftDragZoom(enableShiftDragZoom);

  const xAxisLabel = ggbOptions.xAxis?.label;
  const yAxisLabel = ggbOptions.yAxis?.label;
  if (xAxisLabel || yAxisLabel) {
    app.setAxisLabels(1, xAxisLabel ?? "", yAxisLabel ?? "");
  }
};
