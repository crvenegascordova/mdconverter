# 02. Tablas Complejas y Desbordamiento

Este archivo valida el comportamiento del conversor al procesar tablas con alineaciones mixtas, texto enriquecido interno, rutas de archivos largas y tablas extensas de múltiples páginas.

---

## 1. Tabla con Alineaciones Mixtas y Formato Interno

| ID (Centro) | Componente (Izquierda) | Código (Centro) | Estado (Derecha) | Descripción & Enlaces (Izquierda) |
| :---: | :--- | :---: | ---: | :--- |
| **01** | `marked` Parser | `AST-01` | **Activo** | Transforma Markdown a tokens de AST. [Documentación](https://marked.js.org) |
| **02** | `docx` Generator | `DOC-02` | *En producción* | Construye documentos Word con anchos en **twips** de 9,360 twips. |
| **03** | `pdfmake` Generator | `PDF-03` | ~~Beta~~ | Genera PDFs con fuentes vectoriales y bordes `booktabs`. |
| **04** | CLI Runtime | `CLI-04` | **Estable** | Ejecutable único con Bun/Node. `mdconverter --theme latex` |

---

## 2. Tabla con Rutas de Archivo Largas (Prueba de Ajuste de Línea)

| Módulo | Ruta de Archivo Extensa | Tipo de Cambio | Impacto |
| :--- | :--- | :---: | :--- |
| Checkout Model | `app/design/frontend/Vdshop/tiendaunificada/Magento_Checkout/web/js/model/direccion.js` | Refactor | **Alto** |
| Template View | `app/design/frontend/Vdshop/tiendaunificada/Magento_Checkout/templates/captcha.phtml` | Bugfix | *Medio* |
| Config Provider | `app/code/TiendaUnificada/Checkout/Plugin/DefaultConfigProvider.php` | Feature | **Bajo** |

---

## 3. Tabla Extensa de Múltiples Filas (Prueba de Salto de Página)

| Registro # | Categoría | Código de Prueba | Valor Medido | Estado | Observación |
| :---: | :--- | :---: | ---: | :---: | :--- |
| 001 | Rendimiento | `PERF-01` | 0.04s | ✅ PASS | Conversión de sintaxis básica. |
| 002 | Rendimiento | `PERF-02` | 0.06s | ✅ PASS | Conversión de tablas GFM complejas. |
| 003 | Memoria | `MEM-01` | 14.2 MB | ✅ PASS | Uso de memoria RAM durante parseo AST. |
| 004 | Tipografía | `TYPO-01` | 100% | ✅ PASS | Renderizado de fuentes Serif en LaTeX. |
| 005 | Tipografía | `TYPO-02` | 100% | ✅ PASS | Renderizado de fuentes Sans-Serif en Modern. |
| 006 | Compatibilidad | `COMP-01` | POSIX | ✅ PASS | Prueba de ejecución en Ubuntu 22.04 LTS. |
| 007 | Compatibilidad | `COMP-02` | POSIX | ✅ PASS | Prueba de ejecución en macOS Sonoma. |
| 008 | Compatibilidad | `COMP-03` | Win32 | ✅ PASS | Prueba de ejecución en Windows PowerShell. |
| 009 | Formato | `FMT-01` | PDF | ✅ PASS | Validación de márgenes y bordes booktabs. |
| 010 | Formato | `FMT-02` | DOCX | ✅ PASS | Validación de celdas en OpenXML. |
| 011 | Seguridad | `SEC-01` | 0 Vuls | ✅ PASS | Auditoría de dependencias npm/bun. |
| 012 | Rendimiento | `PERF-03` | 0.05s | ✅ PASS | Re-evaluación de caché de fuentes. |
| 013 | Integración | `INT-01` | OK | ✅ PASS | Prueba del instalador automatizado `install.sh`. |
| 014 | Integración | `INT-02` | OK | ✅ PASS | Prueba del instalador automatizado `install.ps1`. |
| 015 | Salida | `OUT-01` | OK | ✅ PASS | Generación de artefactos de salida. |

---

*Fin del archivo de prueba de tablas.*
