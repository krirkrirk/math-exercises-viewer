import ReactMarkdown from "react-markdown";
import "katex/dist/katex.min.css"; // `react-katex` does not import the CSS for you
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { ReactNode } from "react";
import remarkGfm from "remark-gfm";
//@ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
//@ts-ignore
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  text: string;
  className?:string
};
export default function MarkdownParser({ text,className = ""}: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      className={`markdown ${className}`}
      components={{
        table: ({ node, ...props }) => (
          <table style={{ border: "1px solid", margin: "auto" }} {...props} />
        ),
        tr: ({ node, ...props }) => (
          <tr style={{ border: "1px solid" }} {...props} />
        ),
        td: ({ node, ...props }) => (
          <td style={{ border: "1px solid", padding: "10px" }} {...props} />
        ),
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
      {text}
    </ReactMarkdown>
  );
}
