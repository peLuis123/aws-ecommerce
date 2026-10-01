# Paginación del catálogo

Desplegar primero `services/orders-service` del backend y después ejecutar `firebase deploy` en el frontend.

El catálogo solicita `GET /products?page=1&pageSize=12&q=&category=&sort=featured`.
La respuesta es `{ items, page, pageSize, total, totalPages }`. Los tamaños admitidos son 1–48; los órdenes son `featured`, `low`, `high` y `name`. La categoría admite ID o slug. Los filtros se aplican antes de ordenar y paginar. Una página fuera del rango devuelve la última disponible; un catálogo vacío devuelve página 1 y cero resultados.

Las consultas sin `page` ni `pageSize` mantienen la respuesta de array para compatibilidad con administración y otras pantallas. La paginación de esta entrega corresponde al catálogo público. La demo también admite el contrato paginado.

La URL del frontend conserva `pagina`, `q`, `categoria` y `orden`. Cambiar búsqueda, categoría u orden reinicia a la primera página. Los resultados tardíos de una petición anterior no reemplazan los actuales.

Limitación: el índice MerchantIndex actual no permite búsqueda de texto ni orden global por precio. El backend recorre las páginas de DynamoDB del comercio y aplica esos criterios antes de devolver únicamente la página solicitada. Reduce la transferencia al navegador, pero no las lecturas de DynamoDB. Para catálogos grandes se necesitan índices adicionales o un motor de búsqueda.
