import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default function MarkdownRenderer({ content }: { content: string }) {
  // Check if content is undefined or null and provide a fallback
  const safeContent = content || '';
  
  return (
    <div className="prose max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkMath]} 
        rehypePlugins={[rehypeKatex]}
      >
        {safeContent}
      </ReactMarkdown>
    </div>
  );
}
