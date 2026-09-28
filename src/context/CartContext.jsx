import { useEffect, useRef, useState } from "react";
import { cartApi } from "../api/cart.api";
import { config } from "../config/env";
import { CartContext } from "./cart.context";
import { demoMode } from "../data/demo";

const cartStorageKey = demoMode
  ? "casa-nativa-demo-cart-id"
  : "casa-nativa-cart-id";

export function CartProvider({ children }) {
  const [cartId, setCartId] = useState(() =>
    window.localStorage.getItem(cartStorageKey),
  );
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const pendingCart = useRef(null);

  const loadCart = async (currentCartId = cartId) => {
    if (!currentCartId) return null;
    setIsLoading(true);
    try {
      const response = await cartApi.get(currentCartId);
      setCart(response.data);
      return response.data;
    } finally {
      setIsLoading(false);
    }
  };

  const ensureCart = async () => {
    if (cartId) return cartId;

    if (pendingCart.current) return pendingCart.current;
    pendingCart.current = cartApi
      .create({ merchantId: config.merchantId, currency: "USD" })
      .then((response) => {
        const nextCartId = response.data.cartId;
        window.localStorage.setItem(cartStorageKey, nextCartId);
        setCartId(nextCartId);
        setCart(response.data);
        return nextCartId;
      })
      .finally(() => {
        pendingCart.current = null;
      });
    return pendingCart.current;
  };

  const addItem = async (productId, quantity) => {
    const currentCartId = await ensureCart();
    await cartApi.addItem(currentCartId, { productId, quantity });
    return loadCart(currentCartId);
  };
  const updateItem = async (productId, quantity) => {
    await cartApi.updateItem(cartId, productId, quantity);
    return loadCart();
  };
  const removeItem = async (productId) => {
    await cartApi.removeItem(cartId, productId);
    return loadCart();
  };

  useEffect(() => {
    if (!cartId) return undefined;

    let active = true;
    cartApi
      .get(cartId)
      .then((response) => {
        if (active) setCart(response.data);
      })
      .catch(() => {
        if (active) setCart(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [cartId]);

  const itemCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId,
        itemCount,
        isLoading,
        loadCart,
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
