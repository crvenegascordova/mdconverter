# mdconverter 🚀

Una aplicación CLI en **TypeScript / Node.js (Bun)** para leer, escanear e interpretar archivos `.md` (encabezados, párrafos, listas, citas, tablas GFM y bloques de código) y convertirlos automáticamente en documentos **PDF** y **Word (.docx)**.

---

## 🌟 Características

- **Interpretación Completa de Markdown**:
  - 📌 **Encabezados** (`# H1` a `###### H6`) con estilos visuales y jerarquía de tamaños.
  - ✍️ **Texto enriquecido inline** (negrita, cursiva, tachado, código inline, enlaces web).
  - 📊 **Tablas GFM** (filas, columnas, cabeceras destacadas, bordes y alineación izquierda/centro/derecha sin desbordar el margen).
  - 📜 **Listas anidadas** (ordenadas y desordenadas con viñetas multinivel e indentación proporcional).
  - 💬 **Citas / Blockquotes** con barra lateral estilizada.
  - 💻 **Bloques de código** formateados con tipografía monoespaciada y contenedor de fondo.
  - ➖ **Líneas divisorias horizontal** (`---`).
- **🎨 Temas Visuales Integrados (Sin dependencias nativas)**:
  - `--theme modern` (predeterminado): Estilo limpio tipo GitHub / Preview (Sans-Serif, acentos de color, zebra striping).
  - `--theme latex` (académico): Estilo formal tipo LaTeX (Tipografía Serif Times New Roman/Times-Roman, justificado, tablas formato `booktabs` con reglas `\toprule`, `\midrule`, `\bottomrule` y numeración de página `- 1 -`).
- **100% Multiplataforma**: Ejecución transparente en **Ubuntu / Linux**, **macOS** y **Windows PowerShell**.
- **Sin dependencias nativas complejas**: No requiere Microsoft Word, ni Chromium, ni TeX/LaTeX preinstalados.

---

## ⚡ Instalación Global Automatizada

Puedes instalar `mdconverter` para que esté disponible de forma global en tu consola desde **cualquier directorio**:

### Linux (Ubuntu/Debian/Arch) y macOS
Ejecuta el script automatizado de instalación:

```bash
./install.sh
# O alternativamente usando npm / bun:
npm run install:global
```

### Windows (PowerShell)
Ejecuta el script de PowerShell:

```powershell
.\install.ps1
```

Una vez ejecutado, puedes invocar `mdconverter` desde cualquier ubicación en tu sistema:
```bash
mdconverter mi_documento.md -f all
```

---

## 🚀 Uso de la CLI

### Convertir con Tema Moderno (Por defecto)
```bash
mdconverter sample.md -f all
```

### Convertir con Tema Académico / LaTeX (`--theme latex`)
```bash
mdconverter sample.md -t latex -f all
```

### Especificar archivo de salida y formato
```bash
# Exportar solo PDF estilo LaTeX:
mdconverter sample.md -t latex -f pdf -o reporte_academico.pdf

# Exportar solo DOCX estilo LaTeX:
mdconverter sample.md -t latex -f docx -o reporte_academico.docx
```

---

## 🧪 Pruebas Automatizadas (Suite de Test)

El proyecto incluye una estructura de pruebas en `test/samples/` para verificar la precisión del renderizado y conversión en PDF y DOCX tanto en tema `modern` como `latex`:

```bash
# Ejecutar la suite de pruebas completa:
bun run test
# O usando npm:
npm test
```

### Archivos de Prueba en `test/samples/`:
- `01_basic_syntax.md`: Sintaxis básica, encabezados H1-H6, formatos inline y listas.
- `02_complex_tables.md`: Tablas con alineaciones, texto en celdas, rutas largas y múltiples filas.
- `03_images_and_figures.md`: Figuras locales (`../assets/sample.png`), remotas y bloques `<figure>`.
- `04_math_and_latex.md`: Ecuaciones matemáticas en línea (`$...$`) y bloques (`$$...$$`).
- `05_edge_cases.md`: Unicode, acentos, emojis, citas anidadas y enlaces complejos.

---

## 🛠️ Desarrollo e Instalación Local

### Usando Bun (Recomendado)

```bash
# Instalar dependencias
bun install

# Ejecutar conversión local
bun run mdconverter sample.md -f all
```

### Usando Node.js / npm

```bash
# Instalar dependencias
npm install

# Ejecutar conversión local
npm run mdconverter sample.md -f all
```

---

## 📦 Compilación a Ejecutable Único (Standalone Binary)

Puedes generar un binario ejecutable único que no requiere tener Node ni Bun instalado en la máquina destino:

```bash
bun run build
```

Esto generará el ejecutable en `dist/mdconverter`.

---

## 📂 Estructura del Proyecto

```
mdconverter/
├── src/
│   ├── index.ts          # Punto de entrada CLI (Argumentos, temas y banderas)
│   ├── parser.ts         # Escáner y Parser AST con Marked
│   └── converters/
│       ├── docx.ts       # Motor de conversión a Word (.docx) con temas
│       └── pdf.ts        # Motor de conversión a PDF (pdfmake) con temas
├── test/
│   ├── assets/
│   │   └── sample.png    # Activos gráficos para pruebas
│   ├── samples/
│   │   ├── 01_basic_syntax.md
│   │   ├── 02_complex_tables.md
│   │   ├── 03_images_and_figures.md
│   │   ├── 04_math_and_latex.md
│   │   └── 05_edge_cases.md
│   └── run_tests.test.ts # Runner automatizado de la suite de pruebas
├── install.sh            # Script de instalación global para Linux / macOS
├── install.ps1           # Script de instalación global para Windows PowerShell
├── sample.md             # Archivo Markdown de prueba
├── package.json          # Configuración y dependencias
├── tsconfig.json         # Configuración de TypeScript
└── README.md             # Documentación
```
