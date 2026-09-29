# mdconverter 🚀

**English** | [Español](README.es.md)

A **TypeScript / Node.js (Bun)** CLI application that reads, scans, and parses `.md` files (headings, paragraphs, lists, blockquotes, GFM tables, and code blocks), then automatically converts them to **PDF** and **Word (.docx)** documents.

---

## 🌟 Features

- **Complete Markdown Parsing**:
  - 📌 **Headings** (`# H1` through `###### H6`) with visual styles and size hierarchy.
  - ✍️ **Inline rich text** (bold, italic, strikethrough, inline code, and web links).
  - 📊 **GFM tables** (rows, columns, highlighted headers, borders, left/center/right alignment, and margin overflow prevention).
  - 📜 **Nested lists** (ordered and unordered, with multilevel bullets and proportional indentation).
  - 💬 **Blockquotes** with a styled side bar.
  - 💻 **Code blocks** formatted with a monospace font and background container.
  - ➖ **Horizontal rules** (`---`).
- **🎨 Built-in Visual Themes (No Native Dependencies)**:
  - `--theme modern` (default): Clean GitHub/Preview-like style (sans-serif, color accents, and zebra striping).
  - `--theme latex` (academic): Formal LaTeX-like style (Times New Roman/Times-Roman serif font, justified text, `booktabs`-style tables using `\toprule`, `\midrule`, and `\bottomrule`, plus `- 1 -` page numbering).
- **100% Cross-platform**: Works on **Ubuntu/Linux**, **macOS**, and **Windows PowerShell**.
- **No complex native dependencies**: Microsoft Word, Chromium, and TeX/LaTeX are not required.

---

## ✅ Requirements

To install dependencies and run the project from source, you need one of these runtimes:

- **Bun**: the recommended alternative to Node.js/npm and **required to compile a standalone binary** with `bun run build`.
- **Node.js** (includes `npm`): a compatible alternative for installation, execution, and testing.

### Install Bun (recommended)

On Linux or macOS:

```bash
curl -fsSL https://bun.sh/install | bash
```

On Windows PowerShell:

```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

Close and reopen your terminal after the installation. Verify it with:

```bash
bun --version
```

### Alternative: install Node.js

On Linux or macOS, using `nvm`:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
nvm install --lts
```

On Windows PowerShell, using `winget`:

```powershell
winget install OpenJS.NodeJS.LTS
```

Verify it with:

```bash
node --version
npm --version
```

If you use a precompiled binary from `dist/mdconverter`, Node.js and Bun are not needed on the target machine.

---

## ⚡ Automated Global Installation

You can install `mdconverter` to make it available globally from **any directory**. To run these installers, **Node.js/npm or Bun** must already be installed:

- With **Node.js**, Node must remain installed to run the tool.
- With **Bun**, a standalone binary is compiled; after installation, that binary does not require Node.js or Bun.

### Linux (Ubuntu/Debian/Arch) and macOS

Run the automated installation script:

```bash
./install.sh
# Or alternatively through npm / Bun:
npm run install:global
```

### Windows (PowerShell)

Run the PowerShell script:

```powershell
.\install.ps1
```

After installation, you can run `mdconverter` from any location:

```bash
mdconverter my_document.md -f all
```

---

## 🚀 CLI Usage

### Convert with the Modern Theme (Default)

```bash
mdconverter sample.md -f all
```

### Convert with the Academic / LaTeX Theme (`--theme latex`)

```bash
mdconverter sample.md -t latex -f all
```

### Specify an output file and format

```bash
# Export only a LaTeX-styled PDF:
mdconverter sample.md -t latex -f pdf -o academic_report.pdf

# Export only a LaTeX-styled DOCX:
mdconverter sample.md -t latex -f docx -o academic_report.docx
```

---

## 🧪 Automated Tests

The project includes test files in `test/samples/` to validate PDF and DOCX rendering and conversion accuracy for both `modern` and `latex` themes:

```bash
# Run the complete test suite:
bun run test
# Or with npm:
npm test
```

### Test files in `test/samples/`

- `01_basic_syntax.md`: Basic syntax, H1-H6 headings, inline formatting, and lists.
- `02_complex_tables.md`: Tables with alignment, text in cells, long paths, and multiple rows.
- `03_images_and_figures.md`: Local (`../assets/sample.png`) and remote images, plus `<figure>` blocks.
- `04_math_and_latex.md`: Inline (`$...$`) and block (`$$...$$`) mathematical equations.
- `05_edge_cases.md`: Unicode, accented characters, emojis, nested quotes, and complex links.

---

## 🛠️ Local Development and Installation

### Using Bun (Recommended)

```bash
# Install dependencies
bun install

# Run a local conversion
bun run mdconverter sample.md -f all
```

### Using Node.js / npm

```bash
# Install dependencies
npm install

# Run a local conversion
npm run mdconverter sample.md -f all
```

---

## 📦 Compile a Standalone Binary

With **Bun** installed, you can generate a standalone executable that does not require Node.js or Bun on the target machine:

```bash
bun run build
```

This generates the executable at `dist/mdconverter`.

---

## 📂 Project Structure

```text
mdconverter/
├── src/
│   ├── index.ts          # CLI entry point (arguments, themes, and flags)
│   ├── parser.ts         # Scanner and AST parser using Marked
│   └── converters/
│       ├── docx.ts       # Word conversion engine with themes
│       └── pdf.ts        # PDF conversion engine with themes
├── test/
│   ├── assets/
│   │   └── sample.png    # Test image asset
│   ├── samples/
│   │   ├── 01_basic_syntax.md
│   │   ├── 02_complex_tables.md
│   │   ├── 03_images_and_figures.md
│   │   ├── 04_math_and_latex.md
│   │   └── 05_edge_cases.md
│   └── run_tests.test.ts # Automated test-suite runner
├── install.sh            # Global installation script for Linux / macOS
├── install.ps1           # Global installation script for Windows PowerShell
├── sample.md             # Sample Markdown file
├── package.json          # Project configuration and dependencies
├── tsconfig.json         # TypeScript configuration
├── README.md             # English documentation
└── README.es.md          # Spanish documentation
