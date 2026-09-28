# Casa Nativa

Frontend de ecommerce en React + Vite. Diseño editorial para una tienda de hogar, con catálogo, detalle, bolsa, checkout, cuentas y administración.

## Ver el diseño

```sh
npm install
npm run dev
```

Abre http://localhost:5000. En desarrollo, el modo demo está activo por defecto: ocho productos, cuatro categorías, pedidos de ejemplo y balance ficticio. En **Probar cuentas** puedes entrar como comprador o administrador sin contraseña.

Puedes buscar, filtrar, ordenar, añadir productos a la bolsa, modificar cantidades, eliminar artículos y simular una compra. No se hacen solicitudes a AWS ni a los proveedores de pago mientras la demo está activa. Los datos demo se guardan en claves independientes de localStorage; no se guardan las contraseñas introducidas en los formularios demo.

## API real

Configura tus variables locales:

```env
VITE_DEMO_MODE=false
VITE_API_BASE_URL=https://tu-api.example
VITE_APP_URL=http://localhost:5000
VITE_MERCHANT_ID=tu-merchant
```

`npm run build` desactiva la demo por defecto. Para una build de presentación, establece `VITE_DEMO_MODE=true` explícitamente. La edición de cantidades y eliminación están disponibles solo en demo hasta que el backend implemente sus endpoints. Los datos de prueba no se insertan en la base de datos.

La integración real de checkout conserva las limitaciones existentes del backend: reserva de inventario, persistencia y ciclo del pedido requieren el trabajo señalado en el diagnóstico. Este rediseño no las resuelve.

## Comprobaciones

```sh
npm run lint
npm run build
```

## Estructura visual

- `src/components/layout/StoreLayout.jsx`: navegación, pie y aviso demo.
- `src/pages/Home/HomePage.jsx`: portada y colecciones.
- `src/App.css` y `src/index.css`: sistema visual y adaptación móvil.
- `src/data/demo.js`: productos y categorías de ejemplo.
- `src/data/demoAdapter.js`: operaciones simuladas, aisladas de la API.

## Fotografías

Fotografías referenciales remotas de Unsplash y Pexels. Requieren conexión a internet. El catálogo y sus especificaciones son ficticios.

- Jarrón: [Ksenia Chernaya en Pexels](https://www.pexels.com/photo/a-vase-over-white-surface-8987439/).
- Manta: [Nati en Pexels](https://www.pexels.com/photo/a-close-up-shot-of-folded-knitted-clothes-14642652/).
- Las restantes URLs de imágenes de Unsplash están identificadas en `src/data/demo.js`.
