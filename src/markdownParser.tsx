import ReactMarkdown from "react-markdown";
import "katex/dist/katex.min.css"; // `react-katex` does not import the CSS for you
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { ReactNode } from "react";
import remarkGfm from "remark-gfm";
type Props = {
  text: string;
};

export default function MarkdownParser({ text }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      className="markdown"
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
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
