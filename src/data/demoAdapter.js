import { demoCategories, demoOrders, demoProducts } from "./demo";

const storageKey = "casa-nativa-demo-v1";
const initialState = () => ({
  user: null,
  carts: {},
  orders: [...demoOrders],
  payments: {},
});
function readState() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || initialState();
  } catch {
    return initialState();
  }
}
function fail(message, status = 400) {
  const error = new Error(message);
  error.response = { status, data: { error: message } };
  throw error;
}

// This adapter only handles explicitly enabled demo requests; it never contacts the API.
export async function demoAdapter(request) {
  const state = readState();
  const url = request.url.split("?")[0];
  const method = request.method.toLowerCase();
  const body =
    typeof request.data === "string"
      ? JSON.parse(request.data)
      : request.data || {};
  let data;
  if (/^\/products\/[^/]+$/.test(url) && method === "get")
    data =
      demoProducts.find((product) => product.productId === url.split("/")[2]) ||
      fail("Producto no encontrado.", 404);
  else if (url === "/products" && method === "get") data = demoProducts;
  else if (url === "/categories" && method === "get") data = demoCategories;
  else if (url === "/auth/me")
    data =
      state.user ||
      fail("Elige una cuenta de demostración para continuar.", 401);
  else if (url === "/auth/login") {
    state.user = {
      userId: "demo-buyer",
      displayName: "Alex",
      email: "alex@example.com",
      role: body.demoRole === "admin" ? "admin" : "buyer",
    };
    data = state.user;
  } else if (url === "/auth/register") data = { registered: true };
  else if (url === "/auth/logout") {
    state.user = null;
    data = {};
  } else if (url === "/carts" && method === "post") {
    data = {
      cartId: `demo-cart-${crypto.randomUUID()}`,
      currency: "USD",
      items: [],
    };
    state.carts[data.cartId] = data;
  } else if (/^\/carts\/[^/]+\/items/.test(url)) {
    const [, , cartId, , productId] = url.split("/");
    const cart =
      state.carts[cartId] || fail("No encontramos este carrito demo.", 404);
    const product =
      demoProducts.find(
        (item) => item.productId === (productId || body.productId),
      ) || fail("Producto no encontrado.", 404);
    const item = cart.items.find(
      (item) => item.productId === product.productId,
    );
    if (method === "delete")
      cart.items = cart.items.filter(
        (item) => item.productId !== product.productId,
      );
    else {
      const quantity =
        method === "patch"
          ? body.quantity
          : (item?.quantity || 0) + body.quantity;
      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > product.stock
      )
        fail("La cantidad supera el stock disponible.");
      const updated = {
        cartItemId: `${cartId}:${product.productId}`,
        productId: product.productId,
        productName: product.name,
        imageUrl: product.imageUrl,
        quantity,
        unitAmount: product.price,
        totalAmount: product.price * quantity,
      };
      cart.items = [
        ...cart.items.filter((item) => item.productId !== product.productId),
        updated,
      ];
    }
    data = cart;
  } else if (url.startsWith("/carts/"))
    data =
      state.carts[url.split("/")[2]] || fail("Carrito no encontrado.", 404);
  else if (
    (url === "/commercial-orders" ||
      url === "/admin/orders" ||
      /^\/merchants\/[^/]+\/orders$/.test(url)) &&
    method === "get"
  )
    data = state.orders;
  else if (/^\/commercial-orders\/[^/]+$/.test(url) && method === "get")
    data =
      state.orders.find((order) => order.orderId === url.split("/")[2]) ||
      fail("Pedido no encontrado.", 404);
  else if (url === "/commercial-orders" && method === "post") {
    const cart = state.carts[body.cartId];
    if (!cart?.items.length) fail("Tu carrito está vacío.");
    data = {
      orderId: `CN-DEMO-${Date.now().toString().slice(-6)}`,
      totalAmount: cart.items.reduce((sum, item) => sum + item.totalAmount, 0),
      currency: "USD",
      status: "Pendiente",
      createdAt: new Date().toISOString(),
      userId: "demo-buyer",
      cartId: cart.cartId,
    };
    state.orders.unshift(data);
  } else if (url.endsWith("/inventory-reservations"))
    data = { status: "reserved" };
  else if (url.endsWith("/checkout")) {
    const order =
      state.orders.find((order) => order.orderId === url.split("/")[2]) ||
      fail("Orden no encontrada.", 404);
    const paymentId = `demo-payment-${crypto.randomUUID()}`;
    state.payments[paymentId] = {
      paymentId,
      status: "approved",
      amount: order.totalAmount,
      currency: "USD",
    };
    order.status = "En preparación";
    state.carts[order.cartId].items = [];
    data = { checkoutUrl: `/checkout/success?paymentId=${paymentId}` };
  } else if (url.startsWith("/payments/"))
    data =
      state.payments[url.split("/")[2]] || fail("Pago no encontrado.", 404);
  else if (url.endsWith("/balance"))
    data = {
      available: 124860,
      currency: "USD",
      updatedAt: "2026-09-27T12:00:00Z",
    };
  else fail("Esta acción todavía no está disponible en la demo.", 404);
  localStorage.setItem(storageKey, JSON.stringify(state));
  return { data, status: 200, statusText: "OK", headers: {}, config: request };
}
