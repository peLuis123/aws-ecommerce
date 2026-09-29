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
```

`npm run build` desactiva la demo por defecto. Para una build de presentación, establece `VITE_DEMO_MODE=true` explícitamente. La edición de cantidades y eliminación usan PATCH y DELETE del backend y también funcionan en demo. Los datos de prueba no se insertan en la base de datos.

El backend incluye correcciones de carrito, reserva transaccional de inventario, actualización del pedido y permisos por propietario. Requieren desplegar los cambios de orders-service (incluidos permisos IAM y UserIndex de CommercialOrders). El ciclo posterior al pago sigue pendiente de completar.

## Sesión y comercios

El navegador no envía X-Merchant-Id ni API keys. El catálogo y los carritos utilizan STOREFRONT_MERCHANT_ID del backend. GET /me/merchants lista las tiendas administrables: una se selecciona automáticamente; con varias, el panel muestra un selector. El rol admin por sí solo no concede acceso a otras tiendas.

Despliega primero orders-service con el índice UserIndex de MerchantUsers y configura STOREFRONT_MERCHANT_ID. La tienda debe existir y estar activa; los administradores existentes necesitan una membresía activa. Las API keys se reservan para integraciones de servidor y nunca deben configurarse como variables VITE_*.

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

## Historial y permisos

El comprador consulta `GET /commercial-orders`; la administración consulta `GET /merchants/:merchantId/orders`. Esta última ruta requiere sesión de administrador y una membresía activa con rol `admin` en `MerchantUsers` para el comercio seleccionado.

El checkout conserva el pedido y la clave de idempotencia al reintentar dentro de la misma pantalla. Recargar o salir de ella inicia otro intento; la recuperación duradera del checkout sigue pendiente.

Los clientes API incluyen creación y edición de catálogo, consulta y ajuste de inventario y detalle de pedidos. El detalle de producto usa GET /products/:productId. Los formularios administrativos de edición de catálogo e inventario aún no forman parte de la interfaz.
