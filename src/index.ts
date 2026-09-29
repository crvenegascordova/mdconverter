#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import fs from "fs/promises";
import path from "path";
import { parseMarkdown } from "./parser";
import { convertToDocx, type ConversionTheme } from "./converters/docx";
import { convertToPdf } from "./converters/pdf";

const program = new Command();

program
  .name("mdconverter")
  .description("🚀 Converter CLI: Transform Markdown (.md) into styled PDF and Word (.docx) documents")
  .version("1.0.0")
  .argument("<input>", "Input Markdown (.md) file path")
  .option("-o, --output <path>", "Output file path (e.g. output.pdf or output.docx)")
  .option(
    "-f, --format <type>",
    "Target format: 'pdf', 'docx', or 'all'",
    "auto"
  )
  .option(
    "-t, --theme <theme>",
    "Visual theme style: 'modern' (default sans-serif) or 'latex' (academic serif & booktabs)",
    "modern"
  )
  .action(async (inputPath: string, options: { output?: string; format: string; theme: string }) => {
    const startTime = Date.now();

    try {
      // 1. Validate Input File
      const absoluteInputPath = path.resolve(process.cwd(), inputPath);
      try {
        await fs.access(absoluteInputPath);
      } catch {
        console.error(chalk.red(`\n❌ Error: File not found at path: ${absoluteInputPath}\n`));
        process.exit(1);
      }

      console.log(chalk.bold.cyan(`\n🔍 Reading Markdown file: `) + chalk.underline(inputPath));
      const fileContent = await fs.readFile(absoluteInputPath, "utf-8");

      // 2. Parse Markdown AST
      console.log(chalk.cyan(`⚙️  Parsing Markdown tokens & structure...`));
      const { tokens } = parseMarkdown(fileContent);

      const parsedExt = options.output ? path.extname(options.output).toLowerCase().replace(".", "") : "";
      let format = options.format.toLowerCase();
      const theme = (options.theme.toLowerCase() === "latex" ? "latex" : "modern") as ConversionTheme;

      if (format === "auto") {
        if (parsedExt === "pdf" || parsedExt === "docx") {
          format = parsedExt;
        } else {
          format = "all"; // Default to generating both if no extension given
        }
      }

      const baseName = path.basename(inputPath, path.extname(inputPath));
      const targetDir = options.output ? path.dirname(path.resolve(process.cwd(), options.output)) : path.dirname(absoluteInputPath);

      console.log(chalk.magenta(`🎨 Using visual theme: `) + chalk.bold(theme === "latex" ? "LaTeX / Academic" : "Modern"));

      // 3. Process Conversions
      if (format === "pdf" || format === "all") {
        const pdfPath = options.output && parsedExt === "pdf"
          ? path.resolve(process.cwd(), options.output)
          : path.join(targetDir, `${baseName}.pdf`);

        console.log(chalk.yellow(`📄 Generating PDF document...`));
        await convertToPdf(tokens, pdfPath, theme);
        const stats = await fs.stat(pdfPath);
        console.log(chalk.green(`   ✅ PDF created successfully: `) + chalk.bold(pdfPath) + chalk.gray(` (${(stats.size / 1024).toFixed(1)} KB)`));
      }

      if (format === "docx" || format === "all") {
        const docxPath = options.output && parsedExt === "docx"
          ? path.resolve(process.cwd(), options.output)
          : path.join(targetDir, `${baseName}.docx`);

        console.log(chalk.blue(`📝 Generating DOCX document...`));
        await convertToDocx(tokens, docxPath, theme);
        const stats = await fs.stat(docxPath);
        console.log(chalk.green(`   ✅ DOCX created successfully: `) + chalk.bold(docxPath) + chalk.gray(` (${(stats.size / 1024).toFixed(1)} KB)`));
      }

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(chalk.bold.green(`\n✨ Done in ${elapsed}s!\n`));
    } catch (err: any) {
      console.error(chalk.red(`\n❌ Error during conversion: ${err.message || err}\n`));
      process.exit(1);
    }
  });

program.parse(process.argv);
