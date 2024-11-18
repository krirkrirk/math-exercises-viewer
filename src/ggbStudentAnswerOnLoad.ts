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
  if (ggbOptions.xAxis) {
    const xml = app.getXML();
    let s = `<axis id="0" show="${
      ggbOptions.xAxis.hidden ? "false" : "true"
    }" label="" unitLabel="" tickStyle="1" showNumbers="${
      ggbOptions.xAxis.hideNumbers ? "false" : "true"
    }" ${
      ggbOptions.xAxis.steps ? `tickDistance="${ggbOptions.xAxis.steps}"` : ""
    } ${ggbOptions.xAxis.showPositive ? 'positiveAxis="true"' : ""}/>`;
    const newXML = xml.replace(/<axis id="0"[^>]*\/>/g, s);
    app.setXML(newXML);
  }
  if (ggbOptions.yAxis) {
    const xml = app.getXML();
    let s = `<axis id="1" show="${
      ggbOptions.yAxis.hidden ? "false" : "true"
    }" label="" unitLabel="" tickStyle="1" showNumbers="${
      ggbOptions.yAxis.hideNumbers ? "false" : "true"
    }" ${
      ggbOptions.yAxis.steps ? `tickDistance="${ggbOptions.yAxis.steps}"` : ""
    } ${ggbOptions.yAxis.showPositive ? 'positiveAxis="true"' : ""}/>`;
    const newXML = xml.replace(/<axis id="1"[^>]*\/>/g, s);
    app.setXML(newXML);
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
  console.log(ggbOptions);
  const enableShiftDragZoom = !ggbOptions?.forbidShiftDragZoom;
  app.enableShiftDragZoom(enableShiftDragZoom);

  const xAxisLabel = ggbOptions.xAxis?.label;
  const yAxisLabel = ggbOptions.yAxis?.label;
  if (xAxisLabel || yAxisLabel) {
    app.setAxisLabels(1, xAxisLabel ?? "", yAxisLabel ?? "");
  }
};
