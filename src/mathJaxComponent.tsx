import React, { useEffect, useRef } from "react";
import { mathjax } from "mathjax-full/js/mathjax";
import { TeX } from "mathjax-full/js/input/tex";
import { SVG } from "mathjax-full/js/output/svg";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html";
import { browserAdaptor } from "mathjax-full/js/adaptors/browserAdaptor";
import { AllPackages } from "mathjax-full/js/input/tex/AllPackages";

const adaptor = browserAdaptor();
RegisterHTMLHandler(adaptor);

const tex = new TeX({ packages: AllPackages });
const svg = new SVG({ fontCache: "local" });
const document = mathjax.document("", { InputJax: tex, OutputJax: svg });

const MathJaxComponent: React.FC<{ latex: string }> = ({ latex }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const node = svgRef.current;
    if (node) {
      node.innerHTML = "";
      const math = document.convert(latex, { display: true });
      node.appendChild(math);
    }
  }, [latex]);

  return <svg ref={svgRef} />;
};

export default MathJaxComponent;
