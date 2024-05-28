import React, { useEffect, useRef } from "react";
import { mathjax } from "mathjax-full/js/mathjax.js";
import { TeX } from "mathjax-full/js/input/tex.js";
import { CHTML } from "mathjax-full/js/output/chtml.js";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor.js";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html.js";

const MathJaxRender: React.FC<{ tex: string }> = ({ tex }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const adaptor = liteAdaptor();
    RegisterHTMLHandler(adaptor);

    const texInput = new TeX();
    const chtmlOutput = new CHTML();

    const html = mathjax.document(containerRef.current!, {
      InputJax: texInput,
      OutputJax: chtmlOutput,
    });

    html.convert(tex, { display: true });
  }, [tex]);

  return <div ref={containerRef}></div>;
};

export default MathJaxRender;
