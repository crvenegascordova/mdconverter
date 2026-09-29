# 🚀 mdconverter

[English](README.md) | [Español](README.es.md) | **Español (Chile)**

Hermanito mío este proyecto te convierte Markdown a PDF, DOCX o a los dos formatos con un par de comandos sin wear tanto. Usa un tema re vío que deja tus documentos joya, tambien podí usar un tema `latex` pa darle más cortecito. Una aplicación CLI en **TypeScript / Node.js (Bun)** para leer, revisar y procesar archivos `.md` —títulos, párrafos, listas, citas, tablas GFM y bloques de código— y convertirlos al toque en documentos **PDF** y **Word (.docx)**.

---

## 🌟 Características

- **Procesamiento completo de Markdown**:
  - 📌 **Títulos** (`# H1` hasta `###### H6`) con estilos y jerarquía de tamaños.
  - ✍️ **Texto enriquecido en línea**: negrita, cursiva, tachado, código y enlaces web.
  - 📊 **Tablas GFM** con filas, columnas, cabeceras destacadas, bordes y alineación izquierda/centro/derecha, sin que se salgan del margen.
  - 📜 **Listas anidadas** ordenadas y desordenadas, con varios niveles de sangría.
  - 💬 **Citas** con barra lateral estilizada.
  - 💻 **Bloques de código** con tipografía monoespaciada y fondo.
  - ➖ **Líneas horizontales** (`---`).
- **🎨 Temas visuales integrados, sin dependencias nativas**:
  - `--theme modern` (por defecto): estilo limpio tipo GitHub/Preview, con tipografía sans-serif, colores y filas alternadas.
  - `--theme latex` (académico): estilo formal tipo LaTeX, con tipografía serif Times New Roman/Times-Roman, texto justificado, tablas `booktabs` (`\toprule`, `\midrule`, `\bottomrule`) y numeración de páginas `- 1 -`.
- **100% multiplataforma**: funciona en **Ubuntu/Linux**, **macOS** y **Windows PowerShell**.
- **Sin cachos de dependencias nativas**: no necesitas Microsoft Word, Chromium ni TeX/LaTeX.

> **Mansa pantalla, mansas de estas:** en un buen monitor se aprecian mejor los estilos, tablas y documentos generados. Igual la herramienta funciona sin dramas en cualquier pantalla.

---

## 🥊 Requisitos del Sistema (Si te falta Ki, no entres)

Para instalar dependencias y ejecutar el proyecto desde el código fuente necesitas uno de estos entornos:

- **Bun**: alternativa recomendada a Node.js/npm y **requisito para compilar un binario autónomo** con `bun run build`.
- **Node.js** (incluye `npm`): alternativa compatible para instalar, ejecutar y correr pruebas.

Si el computador no tiene Bun ni Node.js, **te falta ki**. El instalador no puede preparar la herramienta sin uno de esos runtimes.

### Instalar Bun (recomendado)

En Linux o macOS:

```bash
curl -fsSL https://bun.sh/install | bash
```

En Windows PowerShell:

```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

Cierra y abre otra terminal después de instalarlo. Comprueba que quedó listo:

```bash
bun --version
```

Si aparece una versión, está todo en orden. ¡Brígido!

### Alternativa: instalar Node.js

En Linux o macOS, mediante `nvm`:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
nvm install --lts
```

En Windows PowerShell, mediante `winget`:

```powershell
winget install OpenJS.NodeJS.LTS
```

Comprueba la instalación:

```bash
node --version
npm --version
```

Si vas a usar un binario ya compilado desde `dist/mdconverter`, no necesitas instalar Node.js ni Bun en la máquina destino.

> **Advertencia, hasta la muerte:** no pegues comandos que no entiendes ni ejecutes instaladores de fuentes chantas. Usa fuentes oficiales y revisa permisos antes de modificar el sistema. Si cambias rutas o permisos sin cachar, **no te la vai a llevar pelá**.

---

## 🕺 Instalación y Mambo (Al toque)

Puedes instalar `mdconverter` para usarlo desde **cualquier carpeta** de la terminal. Para correr los instaladores necesitas tener antes **Node.js/npm o Bun**.

- Con **Node.js**, Node debe seguir instalado para ejecutar la herramienta.
- Con **Bun**, se compila un binario autónomo; después de instalarlo, ese binario no necesita Node.js ni Bun.

### Linux (Ubuntu/Debian/Arch) y macOS

Corre el instalador automático:

```bash
./install.sh
# O, si prefieres, mediante npm / Bun:
npm run install:global
```

### Windows (PowerShell)

Corre el script de PowerShell:

```powershell
.\install.ps1
```

Después puedes invocar `mdconverter` desde cualquier ubicación:

```bash
mdconverter mi_documento.md -f all
```

¿Y qué tanta hueá? Si tienes el runtime instalado, corre el script y sigue los mensajes de la terminal.

---

## 🚀 Uso de la CLI

### Convertir con el tema moderno (por defecto)

```bash
mdconverter sample.md -f all
```

### Convertir con el tema académico / LaTeX (`--theme latex`)

```bash
mdconverter sample.md -t latex -f all
```

### Especificar archivo de salida y formato

```bash
# Exportar solamente un PDF con estilo LaTeX:
mdconverter sample.md -t latex -f pdf -o reporte_academico.pdf

# Exportar solamente un DOCX con estilo LaTeX:
mdconverter sample.md -t latex -f docx -o reporte_academico.docx
```

---

## 🧪 Pruebas automatizadas

El proyecto trae archivos en `test/samples/` para comprobar que la conversión y el renderizado a PDF y DOCX anden bien con los temas `modern` y `latex`:

```bash
# Correr toda la suite de pruebas:
bun run test
# O usando npm:
npm test
```

### Archivos de prueba en `test/samples/`

- `01_basic_syntax.md`: sintaxis básica, títulos H1-H6, formato en línea y listas.
- `02_complex_tables.md`: tablas con alineaciones, texto en celdas, rutas largas y varias filas.
- `03_images_and_figures.md`: imágenes locales (`../assets/sample.png`), remotas y bloques `<figure>`.
- `04_math_and_latex.md`: ecuaciones matemáticas en línea (`$...$`) y en bloque (`$$...$$`).
- `05_edge_cases.md`: Unicode, acentos, emojis, citas anidadas y enlaces complejos.

Si pasan todas las pruebas, el sistema está filete y listo para ir al mambo.

---

## 🛠️ Desarrollo e instalación local

### Con Bun (recomendado)

```bash
# Instalar dependencias
bun install

# Correr una conversión local
bun run mdconverter sample.md -f all
```

### Con Node.js / npm

```bash
# Instalar dependencias
npm install

# Correr una conversión local
npm run mdconverter sample.md -f all
```

---

## 📦 Compilación a ejecutable único

Con **Bun** instalado puedes generar un ejecutable único que no necesita Node.js ni Bun en la máquina destino:

```bash
bun run build
```

Esto genera el ejecutable en `dist/mdconverter`.

---

## 📂 Estructura del proyecto

```text
mdconverter/
├── src/
│   ├── index.ts          # Entrada de la CLI: argumentos, temas y banderas
│   ├── parser.ts         # Escáner y parser AST con Marked
│   └── converters/
│       ├── docx.ts       # Motor de conversión a Word con temas
│       └── pdf.ts        # Motor de conversión a PDF con temas
├── test/
│   ├── assets/
│   │   └── sample.png    # Recurso gráfico para pruebas
│   ├── samples/
│   │   ├── 01_basic_syntax.md
│   │   ├── 02_complex_tables.md
│   │   ├── 03_images_and_figures.md
│   │   ├── 04_math_and_latex.md
│   │   └── 05_edge_cases.md
│   └── run_tests.test.ts # Ejecutor de la suite de pruebas
├── install.sh            # Instalador global para Linux / macOS
├── install.ps1           # Instalador global para Windows PowerShell
├── sample.md             # Archivo Markdown de ejemplo
├── package.json          # Configuración y dependencias
├── tsconfig.json         # Configuración de TypeScript
├── README.md             # Documentación en inglés
├── README.es.md          # Documentación en español
└── README.CL.md          # Documentación en español chileno
