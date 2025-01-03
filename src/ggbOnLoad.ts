import { GeogebraOptions, Question } from "./types";

export const ggbOnLoad = (app: any, ggbOptions: GeogebraOptions) => {
  if (!ggbOptions.commands?.length) return;
  ggbOptions.commands.forEach((command) => app.evalCommand(command));
  if (!ggbOptions.coords?.length) return;

  let willChangeXML = false;
  let xml = "";
  let newXML = "";

  if (ggbOptions.lockedAxesRatio !== 1) {
    willChangeXML = true;
    xml = app.getXML();
    if (ggbOptions.lockedAxesRatio) {
      newXML = xml.replace(
        /lockedAxesRatio="1"/g,
        `lockedAxesRatio="${ggbOptions.lockedAxesRatio}"`
      );
    } else {
      newXML = xml.replace(/lockedAxesRatio="1"/g, " ");
    }
    // newXML = xml.replace(/showNumbers="true"/g, 'showNumbers="false"');
    app.setXML(newXML);
  }
  if (ggbOptions.xAxis) {
    xml = app.getXML();
    let s = `<axis id="0" show="${
      ggbOptions.xAxis.hidden ? "false" : "true"
    }" label="" unitLabel="" tickStyle="1" showNumbers="${
      ggbOptions.xAxis.hideNumbers ? "false" : "true"
    }" ${
      ggbOptions.xAxis.steps ? `tickDistance="${ggbOptions.xAxis.steps}"` : ""
    } ${ggbOptions.xAxis.showPositive ? 'positiveAxis="true"' : ""}/>`;
    newXML = xml.replace(/<axis id="0"[^>]*\/>/g, s);
    app.setXML(newXML);
  }
  if (ggbOptions.yAxis) {
    xml = app.getXML();
    let s = `<axis id="1" show="${
      ggbOptions.yAxis.hidden ? "false" : "true"
    }" label="" unitLabel="" tickStyle="1" showNumbers="${
      ggbOptions.yAxis.hideNumbers ? "false" : "true"
    }" ${
      ggbOptions.yAxis.steps ? `tickDistance="${ggbOptions.yAxis.steps}"` : ""
    } ${ggbOptions.yAxis.showPositive ? 'positiveAxis="true"' : ""}/>`;
    newXML = xml.replace(/<axis id="1"[^>]*\/>/g, s);
    app.setXML(newXML);
  }

  if (ggbOptions.is3D) {
    // Gestion des coordonnées en 3D
    app.setCoordSystem(
      ggbOptions.coords[0],
      ggbOptions.coords[1],
      ggbOptions.coords[2],
      ggbOptions.coords[3],
      ggbOptions.coords[4],
      ggbOptions.coords[5]
    );
  } else {
    // Gestion des coordonnées en 2D
    app.setCoordSystem(
      ggbOptions.coords[0],
      ggbOptions.coords[1],
      ggbOptions.coords[2],
      ggbOptions.coords[3]
    );
  }

  if (ggbOptions.hideAxes) {
    app.evalCommand("ShowAxes(false)");
  }
  if (ggbOptions.hideGrid) {
    app.evalCommand("ShowGrid(false)");
  }

  const gridDistance = ggbOptions.gridDistance;
  if (gridDistance) {
    app.setGraphicsOptions(1, {
      gridDistance: { x: gridDistance[0], y: gridDistance[1] },
    });
    if (gridDistance[1] === 1) {
      const yDelta = ggbOptions!.coords[3] - ggbOptions!.coords[2];
      if (yDelta > 40) {
        const xml = app.getXML().replace('distY="1"', "distY='10'");
        app.setXML(xml);
      }
    }
  }
  const isGridBold = ggbOptions.isGridBold;
  if (isGridBold) {
    app.setGraphicsOptions(1, {
      gridIsBold: false,
    });
  }
  const isGridSimple = ggbOptions.isGridSimple;
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
