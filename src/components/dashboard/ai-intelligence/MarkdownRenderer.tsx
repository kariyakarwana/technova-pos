import React from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Parses inline markdown elements:
 * - Bold + Italic: ***text*** or ___text___
 * - Bold: **text** or __text__
 * - Italic: *text* or _text_
 * - Inline Code: `code`
 * - Links: [label](url)
 */
function parseInline(text: string): React.ReactNode[] {
  if (!text) return [];

  const tokens: React.ReactNode[] = [];
  // Matches inline code, bold-italic, bold, italic, and safe markdown links
  const regex =
    /(`[^`]+`|\*\*\*[^*]+\*\*\*|___[^_]+___|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith("`") && token.endsWith("`") && token.length >= 2) {
      tokens.push(
        <code
          key={`code-${keyIndex++}`}
          className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] font-medium text-slate-800 border border-slate-200"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (
      (token.startsWith("***") && token.endsWith("***") && token.length >= 6) ||
      (token.startsWith("___") && token.endsWith("___") && token.length >= 6)
    ) {
      tokens.push(
        <strong key={`bi-${keyIndex++}`} className="font-bold text-slate-900">
          <em className="italic">{token.slice(3, -3)}</em>
        </strong>
      );
    } else if (
      (token.startsWith("**") && token.endsWith("**") && token.length >= 4) ||
      (token.startsWith("__") && token.endsWith("__") && token.length >= 4)
    ) {
      tokens.push(
        <strong key={`b-${keyIndex++}`} className="font-bold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (
      (token.startsWith("*") && token.endsWith("*") && token.length >= 2) ||
      (token.startsWith("_") && token.endsWith("_") && token.length >= 2)
    ) {
      tokens.push(
        <em key={`i-${keyIndex++}`} className="italic text-slate-800">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("[") && token.includes("](") && token.endsWith(")")) {
      const splitIdx = token.indexOf("](");
      const label = token.slice(1, splitIdx);
      const rawUrl = token.slice(splitIdx + 2, -1).trim();

      // Only allow safe HTTP/HTTPS links or internal anchors to prevent javascript: XSS
      const isSafe =
        rawUrl.startsWith("https://") ||
        rawUrl.startsWith("http://") ||
        rawUrl.startsWith("/");

      if (isSafe) {
        tokens.push(
          <a
            key={`a-${keyIndex++}`}
            href={rawUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
          >
            {label}
          </a>
        );
      } else {
        tokens.push(label);
      }
    } else {
      tokens.push(token);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }

  return tokens;
}

/**
 * Checks if a table separator row looks like |---|---|
 */
function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.includes("|")) return false;
  const cells = trimmed
    .split("|")
    .map((c) => c.trim())
    .filter((c) => c.length > 0);
  return cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c));
}

/**
 * Safe, zero-dependency Markdown renderer for React 19 / Next.js
 *
 * Fully supports:
 * - Headings (#, ##, ###, ####, #####, ######)
 * - Bold (**text** or __text__)
 * - Italic (*text* or _text_)
 * - Unordered bullet lists (-, *, +)
 * - Ordered numbered lists (1., 2.)
 * - Inline code (`code`)
 * - Multi-line fenced code blocks (```lang ... ```)
 * - Tables (| col | col | with |---|---| separator)
 * - Paragraphs with proper line breaks
 *
 * Security:
 * - ZERO dangerouslySetInnerHTML
 * - Arbitrary HTML tags are treated as plain text strings (escaped automatically by React)
 */
export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content) return null;

  const lines = content.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let blockKey = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // 2. Fenced Code Blocks (```)
    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) {
        i++; // skip closing ```
      }

      elements.push(
        <div key={`codeblock-${blockKey++}`} className="my-2.5">
          {lang ? (
            <div className="rounded-t-lg bg-slate-800 px-3 py-1 text-[10px] font-mono text-slate-300">
              {lang}
            </div>
          ) : null}
          <pre
            className={`overflow-x-auto p-3 text-[11px] font-mono text-slate-100 bg-slate-900 border border-slate-800 ${
              lang ? "rounded-b-lg" : "rounded-lg"
            }`}
          >
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      continue;
    }

    // 3. Headings (# ... ######)
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const parsedContent = parseInline(text);

      switch (level) {
        case 1:
          elements.push(
            <h1 key={`h1-${blockKey++}`} className="mt-3.5 mb-1.5 text-base font-bold text-slate-900">
              {parsedContent}
            </h1>
          );
          break;
        case 2:
          elements.push(
            <h2 key={`h2-${blockKey++}`} className="mt-3 mb-1 text-sm font-bold text-slate-900">
              {parsedContent}
            </h2>
          );
          break;
        case 3:
          elements.push(
            <h3 key={`h3-${blockKey++}`} className="mt-2.5 mb-1 text-xs font-bold text-slate-900 tracking-tight">
              {parsedContent}
            </h3>
          );
          break;
        case 4:
          elements.push(
            <h4 key={`h4-${blockKey++}`} className="mt-2 mb-0.5 text-xs font-semibold text-slate-900">
              {parsedContent}
            </h4>
          );
          break;
        case 5:
        case 6:
          elements.push(
            <h5 key={`h5-${blockKey++}`} className="mt-1.5 mb-0.5 text-xs font-semibold text-slate-800">
              {parsedContent}
            </h5>
          );
          break;
      }
      i++;
      continue;
    }

    // 4. Horizontal Rule (---, ***, ___)
    if (/^([-*_]\s*){3,}$/.test(trimmed)) {
      elements.push(<hr key={`hr-${blockKey++}`} className="my-3 border-slate-200" />);
      i++;
      continue;
    }

    // 5. Blockquote (> ...)
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      elements.push(
        <blockquote
          key={`quote-${blockKey++}`}
          className="my-2 border-l-2 border-emerald-600 bg-emerald-50/40 py-1.5 pl-3 pr-2 text-xs italic text-slate-700 rounded-r-md"
        >
          {quoteLines.map((ql, qIdx) => (
            <div key={qIdx}>{parseInline(ql)}</div>
          ))}
        </blockquote>
      );
      continue;
    }

    // 6. Tables (| col | col |)
    if (trimmed.includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const headerLine = trimmed;
      const separatorLine = lines[i + 1].trim();
      const headers = headerLine
        .split("|")
        .map((h) => h.trim())
        .filter((_, idx, arr) => (idx > 0 && idx < arr.length - 1) || arr.length <= 2);

      // Extract alignments from separator
      const rawAlignments = separatorLine
        .split("|")
        .map((a) => a.trim())
        .filter((_, idx, arr) => (idx > 0 && idx < arr.length - 1) || arr.length <= 2);

      const alignments = rawAlignments.map((a) => {
        if (a.startsWith(":") && a.endsWith(":")) return "text-center";
        if (a.endsWith(":")) return "text-right";
        return "text-left";
      });

      i += 2; // skip header and separator
      const dataRows: string[][] = [];

      while (i < lines.length && lines[i].trim().includes("|") && lines[i].trim().length > 0) {
        const rowCells = lines[i]
          .trim()
          .split("|")
          .map((c) => c.trim())
          .filter((_, idx, arr) => (idx > 0 && idx < arr.length - 1) || arr.length <= 2);
        dataRows.push(rowCells);
        i++;
      }

      elements.push(
        <div key={`table-${blockKey++}`} className="my-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  {headers.map((h, hIdx) => (
                    <th key={hIdx} className={`px-3 py-2 whitespace-nowrap ${alignments[hIdx] || "text-left"}`}>
                      {parseInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dataRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className={`px-3 py-2 whitespace-nowrap text-slate-700 ${alignments[cIdx] || "text-left"}`}>
                        {parseInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
      continue;
    }

    // 7. Unordered Bullet Lists (-, *, +)
    if (/^[-*+]\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[-*+]\s+/, ""));
        i++;
      }

      elements.push(
        <ul key={`ul-${blockKey++}`} className="my-2 list-disc pl-5 space-y-1 text-xs text-slate-800">
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx} className="leading-relaxed">
              {parseInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 8. Ordered Numbered Lists (1., 2., etc.)
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }

      elements.push(
        <ol key={`ol-${blockKey++}`} className="my-2 list-decimal pl-5 space-y-1 text-xs text-slate-800">
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx} className="leading-relaxed">
              {parseInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 9. Standard Paragraphs (gather lines until blank line or block start)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim().length > 0 &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().match(/^#{1,6}\s+/) &&
      !lines[i].trim().match(/^[-*+]\s+/) &&
      !lines[i].trim().match(/^\d+\.\s+/) &&
      !lines[i].trim().startsWith(">") &&
      !(lines[i].trim().includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1]))
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }

    if (paraLines.length > 0) {
      elements.push(
        <p key={`p-${blockKey++}`} className="my-1.5 text-xs text-slate-800 leading-relaxed">
          {parseInline(paraLines.join(" "))}
        </p>
      );
    }
  }

  return <div className={`markdown-content space-y-1 ${className}`}>{elements}</div>;
}

export default MarkdownRenderer;
