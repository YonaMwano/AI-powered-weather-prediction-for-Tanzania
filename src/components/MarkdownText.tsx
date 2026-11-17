import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownText({ children }: { children: string }) {
  return (
    <div className="break-words [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold [&_a]:text-brand [&_a]:underline [&_pre]:overflow-x-auto [&_table]:block [&_table]:overflow-x-auto [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
