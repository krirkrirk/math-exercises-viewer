import ReactMarkdown from "react-markdown";
import "katex/dist/katex.min.css"; // `react-katex` does not import the CSS for you
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { ReactNode } from "react";

type Props = {
  children: string;
};

export default function MarkdownParser({ children }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      className="markdown"
    >
      {children}
    </ReactMarkdown>
  );
}
