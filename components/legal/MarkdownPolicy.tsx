import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

interface MarkdownPolicyProps {
  content: string;
}

export function MarkdownPolicy({ content }: MarkdownPolicyProps) {
  const stripFrontmatter = (md: string) => {
    if (md.startsWith("---")) {
      const match = md.match(/^---[\s\S]*?---\r?\n([\s\S]*)$/);
      if (match) return match[1];
    }
    return md;
  };

  const cleanContent = stripFrontmatter(content);

  return (
    <div className="w-full text-foreground/90 font-sans">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="font-heading text-3xl font-extrabold mb-6 mt-8" {...props} />,
          h2: ({ node, ...props }) => <h2 className="font-heading text-2xl font-bold mt-10 mb-4 border-b pb-2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="font-heading text-xl font-bold mt-6 mb-3" {...props} />,
          p: ({ node, ...props }) => <p className="text-muted-foreground leading-relaxed mb-4 text-lg" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground" {...props} />,
          li: ({ node, ...props }) => <li className="pl-2" {...props} />,
          a: ({ node, href, ...props }) => {
            let mappedHref = href;
            if (href?.endsWith(".md")) {
              if (href.includes("privacy-policy")) mappedHref = "/privacy";
              else if (href.includes("terms-and-conditions") || href.includes("creator-terms")) mappedHref = "/terms";
              else if (href.includes("refund-policy")) mappedHref = "/refund";
            }
            return <a href={mappedHref} className="text-primary hover:underline font-medium" {...props} />;
          },
          strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse border border-border" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => <th className="border border-border bg-muted p-3 text-left font-semibold" {...props} />,
          td: ({ node, ...props }) => <td className="border border-border p-3" {...props} />,
        }}
      >
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
}
