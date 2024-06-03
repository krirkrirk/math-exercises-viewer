import React from "react";

type ExtendedDivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  xmlns: string;
};

type ForeignObjectWrapperProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  children: React.ReactNode;
};

const ForeignObjectWrapper: React.FC<ForeignObjectWrapperProps> = ({
  x,
  y,
  width,
  height,
  children,
}) => {
  return (
    <foreignObject x={x} y={y} width={width} height={height}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{ fontFamily: "Times", fontSize: "15px" }}
      >
        {children}
      </div>
    </foreignObject>
  );
};

export default ForeignObjectWrapper;
