# Reporte de Incidencias

## Archivos e Incidencias

| Ruta del archivo | Código(s) de incidencia | Propósito |
| :--- | :---: | :--- |
| `tiendaunificada/Magento_Checkout/web/template/accesorios.html` | | sugeridos en el carrito |
| `app/design/frontend/Vdshop/tiendaunificada/Magento_Checkout/web/js/model/direccion.js` | C-02 | Eliminación de código que generaba una ruta relativa |
| `app/design/frontend/Vdshop/tiendaunificada/Magento_Checkout/templates/captcha.phtml` | A-01 | Carga única de script de reCAPTCHA y clave de sitio configurada |
| `app/code/TiendaUnificada/Checkout/Plugin/DefaultConfigProvider.php` | C-03, A-02 | Preparación de datos de respuesta y persistencia del hash token |

---

## Validación recomendada

1. Abrir una categoría o página que muestre el carrusel.
2. Confirmar que la estructura principal se renderiza aunque la consulta de productos tome más tiempo.
3. Verificar en la pestaña **Network** del navegador.
4. Simular una respuesta fallida.
   - ° Confirmar que el carrusel conserva productos esperados.
   - ° Confirmar el manejo de precios y promociones.
   - ° Confirmar el comportamiento cuando no existen resultados.
5. Probar un token inválido.
6. Verificar los logs de error.
   - ° Errores de red.
   - ° JSON inválido.
   - ° Resultado, sin bloqueos en la interfaz.
