import { marked, type TokensList } from "marked";

export interface ParsedMarkdown {
  tokens: TokensList;
}

/**
 * Parses markdown string into a structured Marked AST Token list.
 */
export function parseMarkdown(content: string): ParsedMarkdown {
  // Configure marked to parse GFM (tables, task lists, strikethrough, etc.)
  marked.use({
    gfm: true,
    breaks: true,
  });

  const tokens = marked.lexer(content);
  return { tokens };
}
