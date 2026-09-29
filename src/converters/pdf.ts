import PdfPrinter from "pdfmake";
import type { TDocumentDefinitions, Content, TableCell } from "pdfmake/interfaces";
import type { Token, Tokens } from "marked";
import fs from "fs";

export type ConversionTheme = "modern" | "latex";

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
  h1Alignment: "left" | "center" | "right";
  bodyAlignment: "left" | "justify";
  isBooktabsTable: boolean;
}

function getThemeConfig(theme: ConversionTheme): ThemeConfig {
  if (theme === "latex") {
    return {
      fontBody: "Times",
      fontCode: "Courier",
      colorPrimary: "#000000",
      colorSecondary: "#111111",
      colorMuted: "#333333",
      colorText: "#000000",
      colorAccent: "#000000",
      colorCodeBg: "#F8FAFC",
      colorTableBgAlt: "#FFFFFF",
      colorBorder: "#000000",
      h1Alignment: "center",
      bodyAlignment: "justify",
      isBooktabsTable: true,
    };
  }

  return {
    fontBody: "Helvetica",
    fontCode: "Courier",
    colorPrimary: "#0F172A",
    colorSecondary: "#1E293B",
    colorMuted: "#475569",
    colorText: "#1E293B",
    colorAccent: "#0284C7",
    colorCodeBg: "#F1F5F9",
    colorTableBgAlt: "#F8FAFC",
    colorBorder: "#E2E8F0",
    h1Alignment: "left",
    bodyAlignment: "left",
    isBooktabsTable: false,
  };
}

// PDF Standard Built-in Fonts (no external TTF files required)
const pdfFonts = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
  Times: {
    normal: "Times-Roman",
    bold: "Times-Bold",
    italics: "Times-Italic",
    bolditalics: "Times-BoldItalic",
  },
  Courier: {
    normal: "Courier",
    bold: "Courier-Bold",
    italics: "Courier-Oblique",
    bolditalics: "Courier-BoldOblique",
  },
};

/**
 * Inserts zero-width spaces (\u200B) after path separators and special chars
 * so long unbroken file paths wrap cleanly inside table cells.
 */
function enableLongWordWrapping(text: string = ""): string {
  if (!text) return "";
  return text.replace(/([\/_\\.-])/g, "$1\u200B");
}

/**
 * Converts Marked inline tokens into pdfmake inline content array.
 */
function parseInlineTokens(
  tokens?: Token[],
  isTableCell: boolean = false,
  config?: ThemeConfig
): Content[] {
  if (!tokens || tokens.length === 0) return [];
  const inlines: Content[] = [];
  const fontName = config?.fontBody || "Helvetica";
  const textColor = config?.colorText || "#1E293B";

  for (const token of tokens) {
    switch (token.type) {
      case "strong":
        inlines.push({
          text: parseInlineTokens((token as Tokens.Strong).tokens, isTableCell, config) as any,
          bold: true,
          font: fontName,
        });
        break;

      case "em":
        inlines.push({
          text: parseInlineTokens((token as Tokens.Em).tokens, isTableCell, config) as any,
          italics: true,
          font: fontName,
        });
        break;

      case "del":
        inlines.push({
          text: parseInlineTokens((token as Tokens.Del).tokens, isTableCell, config) as any,
          decoration: "lineThrough",
          font: fontName,
        });
        break;

      case "codespan": {
        const rawCode = (token as Tokens.Codespan).text || "";
        inlines.push({
          text: isTableCell ? enableLongWordWrapping(rawCode) : rawCode,
          font: config?.fontCode || "Courier",
          fontSize: 8.5,
          background: config?.colorCodeBg || "#F1F5F9",
          color: config?.colorPrimary || "#0F172A",
        });
        break;
      }

      case "link": {
        const linkToken = token as Tokens.Link;
        const linkText = linkToken.text || linkToken.href || "";
        inlines.push({
          text: isTableCell ? enableLongWordWrapping(linkText) : linkText,
          font: fontName,
          color: config?.colorAccent || "#0284C7",
          decoration: "underline",
          link: linkToken.href || "",
        });
        break;
      }

      case "text":
      case "escape":
      case "html":
      default: {
        const textToken = token as Tokens.Text;
        if (textToken.tokens && textToken.tokens.length > 0) {
          inlines.push(...parseInlineTokens(textToken.tokens, isTableCell, config));
        } else {
          let rawText = textToken.text || "";
          if (typeof rawText === "string" && (rawText.startsWith("°") || rawText.startsWith("◦") || rawText.startsWith("•"))) {
            rawText = rawText.replace(/^[°◦•]\s*/, "");
          }
          const formattedText = isTableCell ? enableLongWordWrapping(rawText) : rawText;
          if (formattedText) {
            inlines.push({ text: formattedText, font: fontName, color: textColor });
          }
        }
        break;
      }
    }
  }

  return inlines;
}

/**
 * Converts a Marked List Token (including nested sub-lists) into pdfmake Content.
 */
function convertListToPdf(
  listToken: Tokens.List,
  config: ThemeConfig,
  depth: number = 0
): Content[] {
  const listItemsContent: Content[] = [];
  const bulletSymbols = ["•  ", "-  ", "*  "];

  if (!listToken.items || !Array.isArray(listToken.items)) return listItemsContent;

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

    const itemParagraph: Content = {
      text: [
        { text: prefix, bold: true, font: config.fontBody, color: config.colorMuted },
        ...parseInlineTokens(inlineTokens, false, config),
      ] as any,
      alignment: config.bodyAlignment,
      fontSize: 10,
      margin: [depth * 14, 2, 0, 2],
    };

    listItemsContent.push(itemParagraph);

    blockTokens.forEach((bt) => {
      if (bt.type === "list") {
        listItemsContent.push(...convertListToPdf(bt as Tokens.List, config, depth + 1));
      }
    });
  });

  return listItemsContent;
}

/**
 * Converts Marked AST Tokens to pdfmake Content items.
 */
function convertTokensToPdfContent(tokens: Token[], config: ThemeConfig): Content[] {
  const content: Content[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case "heading": {
        const headingToken = token as Tokens.Heading;
        const depth = headingToken.depth;
        const fontSizes: Record<number, number> = {
          1: depth === 1 && config.fontBody === "Times" ? 20 : 19,
          2: 15,
          3: 12.5,
          4: 11,
          5: 10,
          6: 9,
        };
        const colors: Record<number, string> = {
          1: config.colorPrimary,
          2: config.colorSecondary,
          3: config.colorMuted,
        };
        const marginBefores: Record<number, number> = {
          1: depth === 1 && config.fontBody === "Times" ? 22 : 18,
          2: 14,
          3: 11,
          4: 9,
          5: 7,
          6: 6,
        };
        const marginAfters: Record<number, number> = {
          1: 7,
          2: 5,
          3: 4,
          4: 3,
          5: 2,
          6: 2,
        };

        content.push({
          text: parseInlineTokens(headingToken.tokens, false, config) as any,
          font: config.fontBody,
          alignment: depth === 1 ? config.h1Alignment : "left",
          fontSize: fontSizes[depth] || 11,
          bold: true,
          color: colors[depth] || config.colorPrimary,
          margin: [0, marginBefores[depth] || 9, 0, marginAfters[depth] || 3],
        });
        break;
      }

      case "paragraph": {
        const pToken = token as Tokens.Paragraph;
        content.push({
          text: parseInlineTokens(pToken.tokens, false, config) as any,
          font: config.fontBody,
          alignment: config.bodyAlignment,
          fontSize: 10,
          lineHeight: 1.35,
          margin: [0, 0, 0, 7],
        });
        break;
      }

      case "blockquote": {
        const bqToken = token as Tokens.Blockquote;
        const bqItems = convertTokensToPdfContent(bqToken.tokens, config);
        content.push({
          table: {
            widths: ["*"],
            body: [[{ stack: bqItems, fillColor: "#F8FAFC", border: [true, false, false, false] }]],
          },
          layout: {
            defaultBorderColor: config.colorAccent,
          },
          margin: [0, 6, 0, 8],
        } as any);
        break;
      }

      case "code": {
        const codeToken = token as Tokens.Code;
        content.push({
          table: {
            widths: ["*"],
            body: [
              [
                {
                  text: codeToken.text || "",
                  font: config.fontCode,
                  fontSize: 9,
                  fillColor: config.colorCodeBg,
                  margin: [8, 8, 8, 8],
                },
              ],
            ],
          },
          layout: config.isBooktabsTable
            ? {
                hLineWidth: (i: number, node: any) => (i === 0 || i === node.table.body.length ? 0.5 : 0),
                vLineWidth: () => 0,
                hLineColor: () => "#CCCCCC",
              }
            : {
                hLineWidth: () => 0.5,
                vLineWidth: () => 0.5,
                hLineColor: () => config.colorBorder,
                vLineColor: () => config.colorBorder,
              },
          margin: [0, 6, 0, 8],
        });
        break;
      }

      case "list": {
        const listToken = token as Tokens.List;
        content.push(...convertListToPdf(listToken, config, 0));
        break;
      }

      case "table": {
        const tableToken = token as Tokens.Table;
        const numCols = tableToken.header ? tableToken.header.length : 0;
        if (numCols === 0) break;

        // Calculate maximum text length per column for proportional width distribution in PDF
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

        // Convert column weights into percentage width strings for pdfmake
        const widths = cappedLens.map((len) => `${((len / totalWeight) * 100).toFixed(1)}%`);

        // Header Row
        const headerRow: TableCell[] = tableToken.header.map((cell, colIndex) => {
          const cellAlign = (tableToken.align && tableToken.align[colIndex]) || "left";
          return {
            text: parseInlineTokens(cell.tokens, true, config) as any,
            bold: true,
            font: config.fontBody,
            color: config.colorPrimary,
            fillColor: config.isBooktabsTable ? "#FFFFFF" : "#F1F5F9",
            alignment: cellAlign as any,
            margin: [4, 6, 4, 6],
          };
        });

        // Data Rows
        const dataRows: TableCell[][] = (tableToken.rows || []).map((row, rowIndex) => {
          const bg = config.isBooktabsTable ? "#FFFFFF" : (rowIndex % 2 === 1 ? config.colorTableBgAlt : "#FFFFFF");
          return row.map((cell, colIndex) => {
            const cellAlign = (tableToken.align && tableToken.align[colIndex]) || "left";
            return {
              text: parseInlineTokens(cell.tokens, true, config) as any,
              fillColor: bg,
              alignment: cellAlign as any,
              margin: [4, 4, 4, 4],
            };
          });
        });

        const tableLayout = config.isBooktabsTable
          ? {
              hLineWidth: (i: number, node: any) =>
                i === 0 || i === node.table.body.length ? 1.2 : i === 1 ? 0.8 : 0,
              vLineWidth: () => 0,
              hLineColor: () => "#000000",
            }
          : {
              hLineWidth: () => 0.5,
              vLineWidth: () => 0.5,
              hLineColor: () => config.colorBorder,
              vLineColor: () => config.colorBorder,
            };

        content.push({
          table: {
            headerRows: 1,
            widths: widths as any,
            body: [headerRow, ...dataRows],
          },
          layout: tableLayout,
          margin: [0, 8, 0, 10],
        });
        break;
      }

      case "hr": {
        content.push({
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 5,
              x2: 515,
              y2: 5,
              lineWidth: 0.5,
              lineColor: config.colorBorder,
            },
          ],
          margin: [0, 12, 0, 14],
        });
        break;
      }

      default:
        break;
    }
  }

  return content;
}

/**
 * Converts Markdown AST tokens into a formatted PDF document and writes to disk.
 */
export async function convertToPdf(
  tokens: Token[],
  outputPath: string,
  theme: ConversionTheme = "modern"
): Promise<void> {
  const config = getThemeConfig(theme);
  const content = convertTokensToPdfContent(tokens, config);

  const docDefinition: TDocumentDefinitions = {
    defaultStyle: {
      font: config.fontBody,
      color: config.colorText,
    },
    pageSize: "A4",
    pageMargins: [40, 40, 40, 40],
    content,
    footer: (currentPage, pageCount) => ({
      text: config.isBooktabsTable ? `- ${currentPage} -` : `${currentPage} / ${pageCount}`,
      alignment: config.isBooktabsTable ? "center" : "right",
      font: config.fontBody,
      fontSize: 9,
      color: config.isBooktabsTable ? "#333333" : "#A0AEC0",
      margin: [0, 0, config.isBooktabsTable ? 0 : 40, 0],
    }),
  };

  const printer = new PdfPrinter(pdfFonts);
  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(outputPath);
    pdfDoc.pipe(writeStream);
    pdfDoc.end();

    writeStream.on("finish", () => resolve());
    writeStream.on("error", (err) => reject(err));
  });
}
