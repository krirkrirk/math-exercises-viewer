import { GeogebraAxisOptions, GeogebraOptions, Question } from "./types";

export const ggbOnLoad = (app: any, ggbOptions: GeogebraOptions) => {
  if (!app) return;
  // if (ggbOptions?.is3D) app.setPerspective("T");
  // else app.setPerspective("G");
  if (!ggbOptions?.commands && !ggbOptions?.coords) return;

  app.getAllObjectNames().forEach((name: string) => app.deleteObject(name));

  ggbOptions?.commands?.forEach((command) => app.evalCommand(command));

  if (ggbOptions?.hideAxes) {
    app.evalCommand("ShowAxes(false)");
  } else {
    app.evalCommand("ShowAxes(true)");
  }

  app.setGridVisible(!ggbOptions.hideGrid);

  if (ggbOptions.fontSize) {
    const xml = app.getXML();
    const newXML = xml.replace(
      /<font {2}size="24"/g,
      `<font  size="${ggbOptions.fontSize}"`
    );

    app.setXML(newXML);
  }
  if (
    ggbOptions.lockedAxesRatio !== 1 &&
    ggbOptions.lockedAxesRatio !== false
  ) {
    const xml = app.getXML();

    const newXML = xml.replace(
      /lockedAxesRatio="1"/g,
      `lockedAxesRatio="${ggbOptions.lockedAxesRatio}"`
    );

    app.setXML(newXML);
  }

  const handleAxis = (
    xml: string,
    axisOptions: GeogebraAxisOptions,
    axisName: string
  ) => {
    const axisId = axisName === "x" ? 0 : axisName === "y" ? 1 : 2;
    const label = axisOptions.label
      ? axisOptions.label
      : ggbOptions?.is3D
      ? axisName
      : "";
    const s = `<axis id="${axisId}" show="${
      axisOptions.hidden ? "false" : "true"
    }" label="${label}" unitLabel="" tickStyle="1" showNumbers="${
      axisOptions.hideNumbers ? "false" : "true"
    }" ${axisOptions.steps ? `tickDistance="${axisOptions.steps}"` : ""} ${
      axisOptions.showPositive ? 'positiveAxis="true"' : ""
    }/>`;
    const regex = new RegExp(`<axis id="${axisId}"[^>]*\/>`, "g");
    return xml.replace(regex, s);
  };
  if (ggbOptions.xAxis || ggbOptions.yAxis || ggbOptions.zAxis) {
    const xml = app.getXML();
    let newXML = ggbOptions.xAxis
      ? handleAxis(xml, ggbOptions.xAxis, "x")
      : xml;
    newXML = ggbOptions.yAxis
      ? handleAxis(newXML, ggbOptions.yAxis, "y")
      : newXML;
    newXML = ggbOptions.zAxis
      ? handleAxis(newXML, ggbOptions.zAxis, "z")
      : newXML;
    app.setXML(newXML);
  }

  app.setCoordSystem(...ggbOptions.coords);

  const gridDistance = ggbOptions.gridDistance;
  if (gridDistance && !ggbOptions.is3D) {
    app.setGraphicsOptions(1, {
      gridDistance: { x: gridDistance[0], y: gridDistance[1] },
    });
    if (gridDistance[1] === 1) {
      const yDelta = ggbOptions!.coords[3] - ggbOptions!.coords[2];
      if (yDelta > 40) {
        const xml = app.getXML().replace('distY="1"', 'distY="10"');
        app.setXML(xml);
      }
    }
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
  // const xAxisLabel = ggbOptions.xAxis?.label;
  // const yAxisLabel = ggbOptions.yAxis?.label;
  // if (xAxisLabel || yAxisLabel) {
  //   app.setAxisLabels(1, xAxisLabel ?? "", yAxisLabel ?? "");
  // }

  const enableShiftDragZoom = !ggbOptions.forbidShiftDragZoom;
  app.enableShiftDragZoom(enableShiftDragZoom);

  if (ggbOptions.viewDirectionVector) {
    app.evalCommand(
      `SetViewDirection(Vector((${ggbOptions.viewDirectionVector.join(",")})))`
    );
  }
};
