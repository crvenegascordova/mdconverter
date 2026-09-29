import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
import { parseMarkdown } from "../src/parser";
import { convertToDocx } from "../src/converters/docx";
import { convertToPdf } from "../src/converters/pdf";

async function runTestSuite() {
  console.log(chalk.bold.cyan("\n🧪 Running mdconverter Automated Test Suite...\n"));
  const samplesDir = path.resolve(__dirname, "samples");
  const files = (await fs.readdir(samplesDir)).filter((f) => f.endsWith(".md"));

  let passed = 0;
  let failed = 0;

  for (const file of files) {
    const filePath = path.join(samplesDir, file);
    const baseName = path.basename(file, ".md");
    console.log(chalk.yellow(`📄 Testing Sample: ${file}`));

    try {
      const content = await fs.readFile(filePath, "utf-8");
      const { tokens } = parseMarkdown(content);

      // 1. Test Modern DOCX & PDF
      const pdfPathModern = path.join(samplesDir, `${baseName}_modern.pdf`);
      const docxPathModern = path.join(samplesDir, `${baseName}_modern.docx`);
      await convertToPdf(tokens, pdfPathModern, "modern");
      await convertToDocx(tokens, docxPathModern, "modern");

      // 2. Test LaTeX DOCX & PDF
      const pdfPathLatex = path.join(samplesDir, `${baseName}_latex.pdf`);
      const docxPathLatex = path.join(samplesDir, `${baseName}_latex.docx`);
      await convertToPdf(tokens, pdfPathLatex, "latex");
      await convertToDocx(tokens, docxPathLatex, "latex");

      console.log(chalk.green(`   ✅ Passed: PDF & DOCX generated (Modern + LaTeX themes)`));
      passed++;
    } catch (err: any) {
      console.error(chalk.red(`   ❌ Failed: ${err.message || err}`));
      failed++;
    }
  }

  console.log(chalk.bold.cyan("\n==================================================="));
  console.log(chalk.bold.green(`  Passed: ${passed} / ${files.length}`));
  if (failed > 0) {
    console.log(chalk.bold.red(`  Failed: ${failed}`));
    process.exit(1);
  } else {
    console.log(chalk.bold.green("  All test suites completed successfully! ✨"));
    console.log(chalk.bold.cyan("===================================================\n"));
  }
}

runTestSuite();
