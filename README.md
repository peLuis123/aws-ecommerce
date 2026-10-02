# Casa Nativa

Frontend de ecommerce para una tienda de hogar, construido con React 19 y Vite. Se conecta a una API en AWS para autenticación, catálogo, carritos, pedidos y administración. Firebase proporciona Hosting y almacenamiento de imágenes.

## Requisitos e instalación

Usa Node.js compatible con Vite 8 y npm.

```sh
npm ci
npm run dev
```

El servidor local escucha en `http://localhost:5000`.

## Configuración

Los archivos `.env.local` y `.env.development.local` están excluidos de Git. Las variables `VITE_*` se incorporan al JavaScript público durante la compilación; no deben contener claves privadas ni cuentas de servicio.

| Variable | Uso |
| --- | --- |
| `VITE_DEMO_MODE` | `true` activa datos simulados; `false` conecta con la API. |
| `VITE_API_BASE_URL` | URL de la API; `/api` permite usar el proxy local de Vite. |
| `VITE_APP_URL` | Origen para el retorno del checkout. Vacío utiliza el dominio del navegador. |
| `DEV_API_TARGET` | Destino del proxy de desarrollo, configurado en `vite.config.js`. |
| `VITE_FIREBASE_*` | Configuración web de Firebase, según `.env.firebase.example`. |

Para trabajar localmente contra AWS, configura `.env.development.local`:

```env
VITE_DEMO_MODE=false
VITE_API_BASE_URL=/api
DEV_API_TARGET=https://tu-api.example
```

El proxy `/api` solo funciona en desarrollo. Adapta las cookies a HTTP local; producción utiliza directamente la API HTTPS. El backend debe permitir el origen exacto del frontend mediante `FRONTEND_ORIGIN`.

Copia las variables de `.env.firebase.example` a `.env.local` y completa la configuración del proyecto Firebase. En CI se proporcionan mediante el entorno de compilación. Analytics solo se inicia cuando se invoca `enableAnalytics()`.

## Funcionalidades

- Catálogo con detalle de producto, búsqueda, categorías, orden y paginación de 12 productos.
- Carrito con alta, cambio de cantidades y eliminación de artículos.
- Registro, inicio de sesión, renovación de sesión e historial del comprador.
- Checkout con selección de Stripe o PayPal y pantallas de retorno.
- Administración de productos y categorías, activación/desactivación y ajuste de inventario con control de concurrencia.
- Consulta administrativa de pedidos, detalle del pedido y saldo.
- Formularios de retiros y reembolsos con revisión previa e idempotencia en los reintentos.
- Subida de imágenes JPG, PNG y WebP de hasta 5 MB desde el navegador a Firebase Storage. La API recibe únicamente la URL.

El modelo es de tienda única: el backend asigna el comercio y verifica el rol de la sesión. El navegador no envía API keys ni `X-Merchant-Id`. La autenticación del ecommerce pertenece a AWS, no a Firebase Auth.

Las reglas del bucket determinan los permisos de subida. `storage.rules.example` contiene una política de creación pública de imágenes limitada por ruta, tamaño y tipo; es un ejemplo separado y no se publica con el despliegue de Hosting.

## Modo demo

En desarrollo se activa por defecto salvo que `VITE_DEMO_MODE=false`. En una compilación de producción solo se activa con `VITE_DEMO_MODE=true`.

Incluye ocho productos, cuatro categorías y datos ficticios. El adaptador simula acceso, carrito y compra sin contactar con AWS ni procesar pagos. No reproduce todas las operaciones administrativas de la API real. Sus datos se guardan en claves independientes de localStorage.

Las fotografías referenciales de la demo proceden de Unsplash y Pexels y requieren conexión a internet. Sus URLs están en `src/data/demo.js`.

## Paginación

El catálogo solicita páginas a la API y conserva búsqueda, categoría, orden y página en la URL. El contrato y las consideraciones de despliegue están en [PAGINATION.md](PAGINATION.md).

El backend aplica filtros y orden antes de devolver la página, pero el índice actual requiere leer el catálogo del comercio para calcular esos resultados.

## Pruebas y compilación

```sh
npm run lint
npm test
npm run build
```

La compilación genera `dist`. Las pruebas de componentes y servicios utilizan Vitest y Testing Library; no ejecutan transferencias reales.

## Despliegue en Firebase Hosting

```sh
npm install -g firebase-tools
firebase login
firebase deploy
```

`.firebaserc` vincula el target `ecommerce` con el sitio `casa-nativa` del proyecto `portafolio-91b9c`. `firebase.json` ejecuta la compilación antes de publicar `dist` y configura las rutas de la SPA.

El backend debe estar desplegado con el contrato de paginación antes de publicar esta versión del frontend. En producción, configura la API HTTPS y deja `VITE_APP_URL` vacío para utilizar el dominio de Hosting.

## Estructura

- `src/pages`: pantallas de tienda, cuenta, checkout y administración.
- `src/components`: navegación, tarjetas y componentes compartidos.
- `src/api`: clientes HTTP e interceptor de sesión.
- `src/context`: estado de autenticación y carrito.
- `src/config`: configuración de entorno y Firebase.
- `src/services/productImages.js`: subida de imágenes.
- `src/data`: catálogo y adaptador demo.
- `tests`: pruebas automatizadas.

## Comportamiento del checkout

El intento conserva el pedido y su clave de idempotencia mientras permanece montada la pantalla. Recargar o abandonar esa pantalla no conserva ese intento. La redirección desde el proveedor no equivale por sí sola a confirmar el pago: el estado debe consultarse en la API.
