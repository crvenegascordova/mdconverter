# 03. Imágenes, Figuras y Leyendas

Este archivo prueba la inserción y renderizado de recursos gráficos locales y remotos, así como etiquetas de figuras con subtítulos (*captions*) y referencias cruzadas simuladas.

---

## 1. Imagen Local Básica (Sintaxis Markdown)

![Muestra de Imagen Local](../assets/sample.png)
*Figura 1: Muestra de gráfico generado almacenado localmente en la carpeta de activos.*

---

## 2. Imagen Remota (URL Web Externa)

![Logotipo de Referencia Web](https://dummyimage.com/600x200/0f172a/ffffff.png&text=Diagrama+de+Arquitectura+CLI)
*Figura 2: Diagrama de arquitectura cargado desde una URL remota.*

---

## 3. Estructura de Figura HTML con Subtítulo (`<figure>`)

<figure>
  <img src="../assets/sample.png" alt="Diagrama de Flujo de Conversión AST" width="80%" />
  <figcaption><strong>Figura 3.1:</strong> Diagrama de flujo detallado mostrando el pipeline de transformación de tokens desde Marked AST hacia PDF/DOCX.</figcaption>
</figure>

---

## 4. Referencias Cruzadas Simuladas

Como se ilustra en la **Figura 1**, la disposición de elementos gráficos debe mantener las proporciones originales sin desbordar los márgenes laterales del documento.

En la **Figura 2**, se observa el diagrama de conexión entre los generadores de `pdfmake` y `docx`. Las llamadas a recursos externos son procesadas con enlaces de referencia cruzada hacia la **Sección 3**.

---

*Fin del archivo de pruebas de imágenes y figuras.*
