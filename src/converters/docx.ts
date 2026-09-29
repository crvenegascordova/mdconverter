import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  AlignmentType,
  ShadingType,
  ExternalHyperlink,
  convertInchesToTwip,
  Footer,
  PageNumber,
} from "docx";
import type { Token, Tokens } from "marked";
import fs from "fs/promises";

export type ConversionTheme = "modern" | "latex";
export type DocxAlignment = (typeof AlignmentType)[keyof typeof AlignmentType];

interface ThemeConfig {
  fontBody: string;
  fontCode: string;
  colorPrimary: string;
  colorSecondary: string;
  colorMuted: string;
  colorText: string;
  colorAccent: string;
  colorCodeBg: string;
  colorTableBgAlt: string;
  colorBorder: string;
  h1Alignment: DocxAlignment;
  bodyAlignment: DocxAlignment;
  isBooktabsTable: boolean;
}

function getThemeConfig(theme: ConversionTheme): ThemeConfig {
  if (theme === "latex") {
    return {
      fontBody: "Times New Roman",
      fontCode: "Courier New",
      colorPrimary: "000000",
      colorSecondary: "111111",
      colorMuted: "333333",
      colorText: "000000",
      colorAccent: "000000",
      colorCodeBg: "F8FAFC",
      colorTableBgAlt: "FFFFFF", // Classical academic white
      colorBorder: "000000",
      h1Alignment: AlignmentType.CENTER,
      bodyAlignment: AlignmentType.JUSTIFIED,
      isBooktabsTable: true,
    };
  }

  // Default 'modern' theme (Arial & Courier New for universal macOS/Linux/Windows compatibility)
  return {
    fontBody: "Arial",
    fontCode: "Courier New",
    colorPrimary: "0F172A",
    colorSecondary: "1E293B",
    colorMuted: "475569",
    colorText: "1E293B",
    colorAccent: "0284C7",
    colorCodeBg: "F1F5F9",
    colorTableBgAlt: "F8FAFC",
    colorBorder: "E2E8F0",
    h1Alignment: AlignmentType.LEFT,
    bodyAlignment: AlignmentType.LEFT,
    isBooktabsTable: false,
  };
}

/**
 * Inserts zero-width spaces (\u200B) after path separators and special chars
 * so long unbroken file paths wrap cleanly inside table cells.
 */
function enableLongWordWrapping(text: string = ""): string {
  if (!text) return "";
  return text.replace(/([\/_\\.-])/g, "$1\u200B");
}

interface InlineRun {
  text: string;
  bold?: boolean;
  italics?: boolean;
  strike?: boolean;
  codespan?: boolean;
  link?: string;
}

/**
 * Parses inline tokens into docx TextRun or ExternalHyperlink elements.
 */
function parseInlineTokens(
  tokens?: Token[],
  isTableCell: boolean = false,
  config?: ThemeConfig
): (TextRun | ExternalHyperlink)[] {
  if (!tokens || tokens.length === 0) return [];
  const runs: (TextRun | ExternalHyperlink)[] = [];
  const fontName = config?.fontBody || "Arial";
  const textColor = config?.colorText || "1E293B";

  function extractRuns(toks?: Token[], parentState: { bold?: boolean; italics?: boolean; strike?: boolean } = {}): InlineRun[] {
    if (!toks || toks.length === 0) return [];
    const list: InlineRun[] = [];

    for (const token of toks) {
      switch (token.type) {
        case "strong":
          list.push(...extractRuns((token as Tokens.Strong).tokens, { ...parentState, bold: true }));
          break;
        case "em":
          list.push(...extractRuns((token as Tokens.Em).tokens, { ...parentState, italics: true }));
          break;
        case "del":
          list.push(...extractRuns((token as Tokens.Del).tokens, { ...parentState, strike: true }));
          break;
        case "codespan":
          list.push({
            text: (token as Tokens.Codespan).text || "",
            bold: parentState.bold,
            italics: parentState.italics,
            strike: parentState.strike,
            codespan: true,
          });
          break;
        case "link": {
          const linkTok = token as Tokens.Link;
          list.push({
            text: linkTok.text || linkTok.href || "",
            bold: parentState.bold,
            italics: parentState.italics,
            strike: parentState.strike,
            link: linkTok.href || "",
          });
          break;
        }
        case "text":
        case "escape":
        case "html":
        default: {
          const textTok = token as Tokens.Text;
          if (textTok.tokens && textTok.tokens.length > 0) {
            list.push(...extractRuns(textTok.tokens, parentState));
          } else {
            let rawText = textTok.text || "";
            if (typeof rawText === "string" && (rawText.startsWith("°") || rawText.startsWith("◦") || rawText.startsWith("•"))) {
              rawText = rawText.replace(/^[°◦•]\s*/, "");
            }
            if (rawText) {
              list.push({ text: rawText, ...parentState });
            }
          }
          break;
        }
      }
    }
    return list;
  }

  const inlineRuns = extractRuns(tokens);

  for (const item of inlineRuns) {
    const textFormatted = isTableCell ? enableLongWordWrapping(item.text) : item.text;
    if (item.link) {
      runs.push(
        new ExternalHyperlink({
          children: [
            new TextRun({
              text: textFormatted,
              bold: item.bold,
              italics: item.italics,
              strike: item.strike,
              color: config?.colorAccent || "0284C7",
              font: fontName,
              underline: {},
            }),
          ],
          link: item.link,
        })
      );
    } else if (item.codespan) {
      runs.push(
        new TextRun({
          text: textFormatted,
          font: config?.fontCode || "Courier New",
          size: 18,
          shading: { fill: config?.colorCodeBg || "F1F5F9", type: ShadingType.CLEAR },
          color: config?.colorPrimary || "0F172A",
        })
      );
    } else {
      runs.push(
        new TextRun({
          text: textFormatted,
          bold: item.bold,
          italics: item.italics,
          strike: item.strike,
          color: textColor,
          font: fontName,
          size: 21,
        })
      );
    }
  }

  return runs;
}

/**
 * Converts a Marked List Token (including nested sub-lists) into Docx Paragraphs.
 */
function convertListToDocx(
  listToken: Tokens.List,
  config: ThemeConfig,
  depth: number = 0
): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const bulletSymbols = ["•  ", "-  ", "*  "];

  listToken.items.forEach((item, index) => {
    const inlineTokens: Token[] = [];
    const blockTokens: Token[] = [];

    if (item.tokens && Array.isArray(item.tokens)) {
      item.tokens.forEach((t: Token) => {
        if (t.type === "list") {
          blockTokens.push(t);
        } else if (t.type === "text" && (t as Tokens.Text).tokens) {
          const textTok = t as Tokens.Text;
          const subInline: Token[] = [];
          textTok.tokens?.forEach((st: Token) => {
            if (st.type === "list") {
              blockTokens.push(st);
            } else {
              subInline.push(st);
            }
          });
          if (subInline.length > 0) {
            inlineTokens.push({ ...t, tokens: subInline } as Token);
          }
        } else {
          inlineTokens.push(t);
        }
      });
    }

    let prefix = "";
    if (listToken.ordered) {
      const startNum = (listToken.start || 1) + index;
      if (depth === 0) prefix = `${startNum}.  `;
      else if (depth === 1) prefix = `${String.fromCharCode(96 + startNum)}.  `;
      else prefix = `${startNum})  `;
    } else {
      prefix = bulletSymbols[Math.min(depth, bulletSymbols.length - 1)];
    }

    const indentLeft = convertInchesToTwip(0.3 + depth * 0.3);

    paragraphs.push(
      new Paragraph({
        indent: { left: indentLeft },
        spacing: { after: 60, line: 260 },
        alignment: config.bodyAlignment,
        children: [
          new TextRun({ text: prefix, bold: true, color: config.colorMuted, font: config.fontBody, size: 21 }),
          ...parseInlineTokens(inlineTokens, false, config),
        ],
      })
    );

    blockTokens.forEach((bt) => {
      if (bt.type === "list") {
        paragraphs.push(...convertListToDocx(bt as Tokens.List, config, depth + 1));
      }
    });
  });

  return paragraphs;
}

/**
 * Converts Marked AST Tokens to docx Paragraphs / Tables / Elements.
 */
function convertTokensToDocxElements(tokens: Token[], config: ThemeConfig): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case "heading": {
        const headingToken = token as Tokens.Heading;
        const depth = headingToken.depth;

        const headingSizes: Record<number, number> = {
          1: depth === 1 && config.fontBody === "Times New Roman" ? 40 : 38,
          2: 30,
          3: 25,
          4: 22,
          5: 20,
          6: 18,
        };

        const headingColors: Record<number, string> = {
          1: config.colorPrimary,
          2: config.colorSecondary,
          3: config.colorMuted,
        };

        const spacingBefore: Record<number, number> = {
          1: depth === 1 && config.fontBody === "Times New Roman" ? 440 : 360,
          2: 280,
          3: 220,
          4: 180,
          5: 140,
          6: 120,
        };

        const spacingAfter: Record<number, number> = {
          1: 140,
          2: 100,
          3: 80,
          4: 60,
          5: 40,
          6: 40,
        };

        const inlineElements = parseInlineTokens(headingToken.tokens, false, config);

        elements.push(
          new Paragraph({
            alignment: depth === 1 ? config.h1Alignment : AlignmentType.LEFT,
            spacing: { before: spacingBefore[depth] || 180, after: spacingAfter[depth] || 60 },
            children: inlineElements,
          })
        );
        break;
      }

      case "paragraph": {
        const pToken = token as Tokens.Paragraph;
        elements.push(
          new Paragraph({
            alignment: config.bodyAlignment,
            spacing: { after: 140, line: 276 },
            children: parseInlineTokens(pToken.tokens, false, config),
          })
        );
        break;
      }

      case "blockquote": {
        const bqToken = token as Tokens.Blockquote;
        const bqElements = convertTokensToDocxElements(bqToken.tokens, config);
        for (const el of bqElements) {
          if (el instanceof Paragraph) {
            elements.push(
              new Paragraph({
                indent: { left: convertInchesToTwip(0.4), right: convertInchesToTwip(0.4) },
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: config.isBooktabsTable ? "" : "│ ",
                    bold: true,
                    color: config.colorAccent,
                    font: config.fontBody,
                  }),
                ],
              })
            );
          }
        }
        break;
      }

      case "code": {
        const codeToken = token as Tokens.Code;
        const rawCode = codeToken.text || "";
        const lines = rawCode.split("\n");
        const codeRuns: TextRun[] = [];

        lines.forEach((line, index) => {
          codeRuns.push(
            new TextRun({
              text: line,
              font: config.fontCode,
              size: 19,
              color: config.colorPrimary,
            })
          );
          if (index < lines.length - 1) {
            codeRuns.push(new TextRun({ break: 1, font: config.fontCode, size: 19 }));
          }
        });

        elements.push(
          new Paragraph({
            spacing: { before: 180, after: 180 },
            indent: { left: convertInchesToTwip(0.2), right: convertInchesToTwip(0.2) },
            shading: { fill: config.colorCodeBg, type: ShadingType.CLEAR },
            border: config.isBooktabsTable
              ? {
                  top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
                  bottom: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
                }
              : {
                  top: { style: BorderStyle.SINGLE, size: 4, color: config.colorBorder },
                  bottom: { style: BorderStyle.SINGLE, size: 4, color: config.colorBorder },
                  left: { style: BorderStyle.SINGLE, size: 12, color: config.colorAccent },
                  right: { style: BorderStyle.SINGLE, size: 4, color: config.colorBorder },
                },
            children: codeRuns,
          })
        );
        break;
      }

      case "list": {
        const listToken = token as Tokens.List;
        elements.push(...convertListToDocx(listToken, config, 0));
        break;
      }

      case "table": {
        const tableToken = token as Tokens.Table;
        const numCols = tableToken.header ? tableToken.header.length : 0;
        if (numCols === 0) break;
        const rows: TableRow[] = [];

        const colMaxLens = new Array(numCols).fill(5);
        tableToken.header.forEach((cell, idx) => {
          const len = cell && cell.text ? cell.text.trim().length : 5;
          if (len > colMaxLens[idx]) colMaxLens[idx] = len;
        });

        if (tableToken.rows && Array.isArray(tableToken.rows)) {
          tableToken.rows.forEach((row) => {
            row.forEach((cell, idx) => {
              if (idx < numCols) {
                const len = cell && cell.text ? cell.text.trim().length : 5;
                if (len > colMaxLens[idx]) colMaxLens[idx] = len;
              }
            });
          });
        }

        const cappedLens = colMaxLens.map((len) => Math.min(len, 45));
        const totalWeight = cappedLens.reduce((a, b) => a + b, 0);

        const TOTAL_TABLE_TWIPS = 9360;
        const rawWidths = cappedLens.map((len) =>
          Math.max(Math.floor((len / totalWeight) * TOTAL_TABLE_TWIPS), 1200)
        );

        const sumRaw = rawWidths.reduce((a, b) => a + b, 0);
        const colWidths = rawWidths.map((w) => Math.floor((w / sumRaw) * TOTAL_TABLE_TWIPS));
        const finalSum = colWidths.reduce((a, b) => a + b, 0);
        if (colWidths.length > 0 && finalSum !== TOTAL_TABLE_TWIPS) {
          colWidths[colWidths.length - 1] += TOTAL_TABLE_TWIPS - finalSum;
        }

        // Header Row
        const headerCells: TableCell[] = tableToken.header.map((cell, colIndex) => {
          const alignType =
            tableToken.align && tableToken.align[colIndex] === "center"
              ? AlignmentType.CENTER
              : tableToken.align && tableToken.align[colIndex] === "right"
              ? AlignmentType.RIGHT
              : AlignmentType.LEFT;

          return new TableCell({
            width: { size: colWidths[colIndex], type: WidthType.DXA },
            shading: { fill: config.isBooktabsTable ? "FFFFFF" : "F1F5F9", type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: [
              new Paragraph({
                alignment: alignType,
                children: parseInlineTokens(cell.tokens, true, config),
              }),
            ],
          });
        });
        rows.push(new TableRow({ children: headerCells, tableHeader: true, cantSplit: true }));

        // Data Rows
        if (tableToken.rows && Array.isArray(tableToken.rows)) {
          tableToken.rows.forEach((row, rowIndex) => {
            const bgFill = config.isBooktabsTable ? "FFFFFF" : (rowIndex % 2 === 1 ? config.colorTableBgAlt : "FFFFFF");
            const dataCells: TableCell[] = row.map((cell, colIndex) => {
              const cellWidth = colIndex < numCols ? colWidths[colIndex] : 1200;
              const alignType =
                tableToken.align && tableToken.align[colIndex] === "center"
                  ? AlignmentType.CENTER
                  : tableToken.align && tableToken.align[colIndex] === "right"
                  ? AlignmentType.RIGHT
                  : AlignmentType.LEFT;

              return new TableCell({
                width: { size: cellWidth, type: WidthType.DXA },
                shading: { fill: bgFill, type: ShadingType.CLEAR },
                margins: { top: 100, bottom: 100, left: 160, right: 160 },
                children: [
                  new Paragraph({
                    alignment: alignType,
                    children: parseInlineTokens(cell.tokens, true, config),
                  }),
                ],
              });
            });
            rows.push(new TableRow({ children: dataCells, cantSplit: true }));
          });
        }

        // Booktabs vs Modern borders
        const tableBorders = config.isBooktabsTable
          ? {
              top: { style: BorderStyle.SINGLE, size: 12, color: "000000" }, // \toprule
              bottom: { style: BorderStyle.SINGLE, size: 12, color: "000000" }, // \bottomrule
              insideHorizontal: { style: BorderStyle.SINGLE, size: 6, color: "666666" }, // \midrule
              left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            }
          : {
              top: { style: BorderStyle.SINGLE, size: 4, color: config.colorBorder },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: config.colorBorder },
              left: { style: BorderStyle.SINGLE, size: 4, color: config.colorBorder },
              right: { style: BorderStyle.SINGLE, size: 4, color: config.colorBorder },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: config.colorBorder },
              insideVertical: { style: BorderStyle.SINGLE, size: 4, color: config.colorBorder },
            };

        elements.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnWidths: colWidths,
            borders: tableBorders,
            rows,
          })
        );
        elements.push(new Paragraph({ spacing: { after: 180 } }));
        break;
      }

      case "hr": {
        elements.push(
          new Paragraph({
            spacing: { before: 240, after: 240 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 6, color: config.colorBorder },
            },
          })
        );
        break;
      }

      default:
        break;
    }
  }

  return elements;
}

/**
 * Converts Markdown AST tokens into a formatted .docx binary buffer and saves to disk.
 */
export async function convertToDocx(
  tokens: Token[],
  outputPath: string,
  theme: ConversionTheme = "modern"
): Promise<void> {
  const config = getThemeConfig(theme);
  const children = convertTokensToDocxElements(tokens, config);

  const footerParagraph = config.isBooktabsTable
    ? new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "- ", font: config.fontBody, color: "666666", size: 18 }),
          new TextRun({ children: [PageNumber.CURRENT], font: config.fontBody, color: "666666", size: 18 }),
          new TextRun({ text: " -", font: config.fontBody, color: "666666", size: 18 }),
        ],
      })
    : new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({ text: "Page ", font: config.fontBody, color: "A0AEC0", size: 18 }),
          new TextRun({ children: [PageNumber.CURRENT], font: config.fontBody, color: "A0AEC0", size: 18 }),
        ],
      });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
            },
          },
        },
        footers: {
          default: new Footer({
            children: [footerParagraph],
          }),
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  await fs.writeFile(outputPath, buffer);
}
