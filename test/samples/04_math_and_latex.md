# 04. Ecuaciones Matemáticas y Sintaxis LaTeX

Este archivo contiene expresiones matemáticas en línea (`$...$`) y bloques de ecuaciones centrados (`$$...$$`) en sintaxis LaTeX/MathJax para verificar el renderizado en PDF, DOCX y tema LaTeX.

---

## 1. Ecuaciones Matemáticas en Línea (Inline Math)

- La famosa relación de equivalencia entre masa y energía está dada por $E = mc^2$, donde $c \approx 3 \times 10^8 \text{ m/s}$.
- La fórmula cuadrática para encontrar las raíces de $ax^2 + bx + c = 0$ es $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$.
- El límite fundamental $\lim_{x \to 0} \frac{\sin x}{x} = 1$ es la base del cálculo diferencial de funciones trigonométricas.

---

## 2. Bloques de Ecuaciones Destacadas (Display Block Math)

### Identidad de Euler

$$e^{i\pi} + 1 = 0$$

### Integral Definida de Gauss (Distribución Normal)

$$\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}$$

### Serie de Teorema de Fourier

$$f(x) = \frac{a_0}{2} + \sum_{n=1}^{\infty} \left( a_n \cos\left(\frac{n\pi x}{L}\right) + b_n \sin\left(\frac{n\pi x}{L}\right) \right)$$

### Ecuaciones de Maxwell en Forma Diferencial

$$\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0 \mathbf{J} + \mu_0 \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}
\end{aligned}$$

---

## 3. Matrices y Álgebra Lineal

$$\mathbf{A} = \begin{pmatrix}
a_{11} & a_{12} & a_{13} \\
a_{21} & a_{22} & a_{23} \\
a_{31} & a_{32} & a_{33}
\end{pmatrix}, \quad \det(\mathbf{A}) \neq 0$$

---

*Fin del archivo de pruebas matemáticas.*
