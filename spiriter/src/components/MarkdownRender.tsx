import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          p: ({ children }) => <p>{children}</p>, // Removed mb-3 to prevent extra space before lists
          li: ({ children }) => (
            <div className="flex flex-row items-start">
              <span className="w-2 h-2 rounded-full bg-black dark:bg-white mt-1 z-10 p-1"></span>
              <span className="pl-2 z-0">{children}</span>
            </div>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-400 pl-3 text-gray-600 italic">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 text-red-600 rounded">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className=" bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">
              <code>{children}</code>
            </pre>
          ),
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-4">{children}</h1>
          ), // Space after headers
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mb-3">{children}</h2>
          ), // Space after headers
          h3: ({ children }) => (
            <h3 className="text-base font-medium mb-2">{children}</h3>
          ), // Space after headers
          hr: () => (
            <hr className="my-3 border-gray-300 dark:border-gray-600" />
          ), // Space around horizontal rule
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-inside space-y-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-0">{children}</ol>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;