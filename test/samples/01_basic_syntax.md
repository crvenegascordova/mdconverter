# 01. Sintaxis Básica de Markdown

Este archivo tiene como objetivo validar la interpretación de elementos sintácticos básicos en la conversión de Markdown a PDF, DOCX y formato estilo LaTeX.

---

## Encabezados de Varios Niveles

# Encabezado Nivel 1 (H1)
## Encabezado Nivel 2 (H2)
### Encabezado Nivel 3 (H3)
#### Encabezado Nivel 4 (H4)
##### Encabezado Nivel 5 (H5)
###### Encabezado Nivel 6 (H6)

---

## Formato de Texto Inline

- **Texto en negrita** para enfatizar conceptos clave.
- *Texto en cursiva* para términos extranjeros o citas en texto.
- ***Texto en negrita y cursiva*** para máximo énfasis.
- ~~Texto tachado~~ para contenido que ha sido descartado o reemplazado.
- Código inline como `const result = await processFile(path);` o banderas CLI como `--theme latex`.
- Enlaces hipertexto: [Visitar sitio web oficial](https://github.com) y enlace con título [Ejemplo de Enlace](https://example.com "Título del enlace").

---

## Listas Desordenadas (Viñetas)

- Elemento de primer nivel A
- Elemento de primer nivel B
  - Sub-elemento de segundo nivel B.1
  - Sub-elemento de segundo nivel B.2
    - Sub-elemento de tercer nivel B.2.a
- Elemento de primer nivel C

---

## Listas Ordenadas (Numeradas)

1. Primer paso: Configurar el entorno de desarrollo.
2. Segundo paso: Compilar las dependencias del proyecto.
   1. Sub-paso 2.1: Verificar compatibilidad del compilador.
   2. Sub-paso 2.2: Generar binarios estáticos.
3. Tercer paso: Ejecutar la suite de pruebas automatizadas.

---

## Bloques de Código Simples

```javascript
// Función para saludar al usuario en consola
function greetUser(name) {
  console.log(`Hola, ${name}! Bienvenido a mdconverter.`);
}

greetUser("Cristian");
```

---

*Fin del archivo de sintaxis básica.*
