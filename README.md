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

## Tienda única

El panel usa la sesión del administrador y no requiere seleccionar una tienda ni registros en Merchants/MerchantUsers. El backend asigna STOREFRONT_MERCHANT_ID a productos, categorías y carritos. No se envían X-Merchant-Id ni API keys desde el navegador.

Los pedidos y el balance del vendedor se consultan mediante GET /admin/orders y GET /admin/balance. Los compradores solo acceden a sus propios carritos, pedidos y pagos. La gestión de varios vendedores queda fuera del alcance actual.

Despliega orders-service para aplicar este flujo. Conserva el ID interno de la tienda que corresponda a tus datos; no hace falta crear un comercio ni vincular una membresía. Las tablas existentes se conservan.

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

El comprador consulta GET /commercial-orders; la administración consulta GET /admin/orders. Esta última ruta requiere una sesión con rol admin y usa la tienda configurada en el backend.

El checkout conserva el pedido y la clave de idempotencia al reintentar dentro de la misma pantalla. Recargar o salir de ella inicia otro intento; la recuperación duradera del checkout sigue pendiente.

Los clientes API incluyen creación y edición de catálogo, consulta y ajuste de inventario y detalle de pedidos. El detalle de producto usa GET /products/:productId. Los formularios administrativos de edición de catálogo e inventario aún no forman parte de la interfaz.

## Firebase Hosting

Firebase SDK está instalado e inicializado en src/config/firebase.js con el proyecto portafolio-91b9c. Storage está preparado para la futura subida de imágenes, sin cambiar reglas ni implementar subidas. Analytics es opcional: enableAnalytics() no se ejecuta automáticamente. El login y los datos del ecommerce permanecen en AWS. No se necesita Firebase Auth ni Realtime Database para publicar el frontend.

Instalar la CLI e iniciar sesión desde una terminal propia:

~~~powershell
npm install -g firebase-tools
firebase login
firebase hosting:sites:list --project portafolio-91b9c
~~~

Este repositorio usa el target ecommerce, vinculado al sitio casa-nativa en .firebaserc. Para publicar los cambios:

~~~powershell
firebase deploy
~~~

Si el sitio ya existe y es el destino correcto, omite hosting:sites:create. El deploy ejecuta npm run build mediante predeploy, publica dist y permite recargar rutas React como /admin y /login. No ejecutes firebase init sobre esta configuración. El target se guarda en .firebaserc y puedes versionar su asociación una vez elegida.

.env.production desactiva la demo y deja VITE_APP_URL vacío para usar el dominio real de Hosting (no localhost). No pongas localhost en .env.production.local. Las variables VITE_* son públicas al compilar.

Antes de usar login en producción, configura FRONTEND_ORIGIN en orders-service con el origen exacto del sitio (por ejemplo https://casa-nativa.web.app), corrige las cookies HTTPS a SameSite=None; Secure y despliega el backend. Estas correcciones de sesión siguen pendientes: publicar en Hosting no las resuelve. Las cookies entre dominios también dependen de las restricciones del navegador; para una solución estable habrá que planificar dominios del mismo sitio o un intermediario adecuado. El proxy de Vite propuesto para desarrollo tampoco está implementado en este paso.

La configuración web de Firebase no concede permisos para desplegar: firebase login usa tu cuenta autorizada. Las reglas de Storage y la autorización de subidas requieren un diseño específico porque la sesión actual está en AWS; no se habilitan escrituras públicas.


### Variables de Firebase

La configuración web de Firebase se lee desde VITE_FIREBASE_* en src/config/firebase.js. Copia las variables de .env.firebase.example a .env.local y completa sus valores antes de ejecutar desarrollo o firebase deploy. .env.local está ignorado por Git; en CI configura las mismas variables en el entorno de compilación. Vite incluye estos valores en el JavaScript público: no uses credenciales de servidor ni cuentas de servicio en variables VITE_*.
