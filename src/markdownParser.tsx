import ReactMarkdown from "react-markdown";
import "katex/dist/katex.min.css"; // `react-katex` does not import the CSS for you
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { ReactNode, useEffect, useState } from "react";
import remarkGfm from "remark-gfm";
//@ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import rehypeRaw from "rehype-raw";
import { TableAnswerDisplay } from "./tableAnswerDisplay";
type Props = {
  text: string;
};
export default function MarkdownParser({ text }: Props) {
  const [formatedText, setFormatedText] = useState("");
  const [rawSVG, setRawSVG] = useState("");
  useEffect(() => {
    if (!text) {
      setFormatedText("");
      return;
    }

    //destroys comments
    let formated = text.replaceAll(/\n<!--.*/g, "");

    const svgMatch = formated.match(/<svg ([\s\S]*?)<\/svg>/);
    if (svgMatch) {
      const svgContent = svgMatch[1];
      setRawSVG(svgContent);
      // formated =
      //   formated.substring(0, svgMatch.index!) +
      //   formated.substring(svgMatch.index! + 2 + svgContent?.length);
    }
    setFormatedText(formated);
  }, [text]);

  if (!formatedText.length) return <></>;
  return (
    <>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        className="markdown"
        components={{
          table: ({ node, ...props }) => {
            console.log(node, props);
            return (
              <table
                style={{ border: "1px solid", margin: "auto" }}
                {...props}
              />
            );
          },
          tr: ({ node, ...props }) => (
            <tr style={{ border: "1px solid" }} {...props} />
          ),
          td: ({ node, ...props }) => (
            <td style={{ border: "1px solid", padding: "10px" }} {...props} />
          ),
          svg: ({ node, ...props }) => {
            if (props.id === "signTable") {
              console.log(node.children[0].value);
              return (
                <TableAnswerDisplay
                  answerTable={JSON.parse(
                    node.children[0].value
                      .replaceAll("\\", "\\\\")
                      .replaceAll("£", "$")
                  )}
                />
              );
            }
            if (props.id === "varTable") {
              console.log(node.children[0].value);

              return (
                <TableAnswerDisplay
                  answerTable={JSON.parse(
                    node.children[0].value
                      .replaceAll("\\", "\\\\")
                      .replaceAll("£", "$")
                  )}
                />
              );
            }
            if (props.id === "nonLatex") return <svg {...props} />;
            return (
              // <div style={{ backgroundColor: "white" }}>
              <svg {...props} />
              // </div>
            );
          },
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, "")}
                language={match[1]}
                // style={dark}
              />
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
        }}
      >
        {/* <svg width={10} height={20} xmlns="http://www.w3.org/2000/svg">
        <g></g>
      </svg> */}
        {/* destroys comments */}
        {formatedText}
      </ReactMarkdown>
      {/* {rawSVG && (
        <span
          dangerouslySetInnerHTML={{ __html: `<svg ${rawSVG}</svg>` }}
        ></span>
      )} */}
    </>
  );
}
