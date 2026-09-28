export const demoMode =
  import.meta.env.VITE_DEMO_MODE === "true" ||
  (import.meta.env.DEV && import.meta.env.VITE_DEMO_MODE !== "false");

const photo = (id, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
export const editorialImages = {
  hero: photo("photo-1600210492486-724fe5c67fb0", 1800),
  story: photo("photo-1616486338812-3dadae4b4ace", 1000),
};
export const demoCategories = [
  {
    categoryId: "ceramica",
    name: "Cerámica",
    note: "Formas que se sienten",
    imageUrl:
      "https://images.pexels.com/photos/8987439/pexels-photo-8987439.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    categoryId: "textiles",
    name: "Textiles",
    note: "Una pausa suave",
    imageUrl:
      "https://images.pexels.com/photos/14642652/pexels-photo-14642652.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    categoryId: "decoracion",
    name: "Decoración",
    note: "Detalles con carácter",
    imageUrl: photo("photo-1603006905003-be475563bc59"),
  },
  {
    categoryId: "muebles",
    name: "Muebles",
    note: "Tu próximo rincón favorito",
    imageUrl: photo("photo-1598300042247-d088f8ab3a91"),
  },
];
export const demoProducts = [
  {
    productId: "jarron-arena",
    name: "Jarrón Arena",
    categoryId: "ceramica",
    price: 3800,
    imageUrl:
      "https://images.pexels.com/photos/8987439/pexels-photo-8987439.jpeg?auto=compress&cs=tinysrgb&w=900",
    subtitle: "Cerámica · acabado mate",
    badge: "Favorito",
    color: "#ddd0bf",
    description:
      "Una silueta orgánica y un acabado de textura suave. Arena encuentra su lugar con unas ramas secas, flores frescas o simplemente por sí solo.",
    material: "Cerámica de acabado mate",
    dimensions: "18 × 24 cm",
  },
  {
    productId: "manta-calma",
    name: "Manta Calma",
    categoryId: "textiles",
    price: 6400,
    imageUrl:
      "https://images.pexels.com/photos/14642652/pexels-photo-14642652.jpeg?auto=compress&cs=tinysrgb&w=900",
    subtitle: "Algodón · tono natural",
    badge: "Nuevo",
    color: "#c3b29a",
    description:
      "Ligera, suave y siempre a mano. Una manta de algodón para las mañanas tranquilas y las tardes que se alargan en el sofá.",
    material: "Algodón",
    dimensions: "130 × 170 cm",
  },
  {
    productId: "vela-bosque",
    name: "Vela Bosque",
    categoryId: "decoracion",
    price: 2600,
    imageUrl: photo("photo-1603006905003-be475563bc59"),
    subtitle: "Notas de cedro y sándalo",
    color: "#877b55",
    description:
      "Un aroma cálido que invita a bajar el ritmo. Notas de madera y tierra en un recipiente que podrás conservar.",
    material: "Cera vegetal y vaso de vidrio",
    dimensions: "220 g",
  },
  {
    productId: "silla-nido",
    name: "Silla Nido",
    categoryId: "muebles",
    price: 18900,
    imageUrl: photo("photo-1598300042247-d088f8ab3a91"),
    subtitle: "Madera · líneas orgánicas",
    badge: "Selección Nativa",
    color: "#aa7750",
    description:
      "Líneas sencillas, proporciones acogedoras y un lugar para quedarte un rato más. Una pieza pensada para acompañar tu día a día.",
    material: "Madera y tapizado",
    dimensions: "58 × 60 × 78 cm",
  },
  {
    productId: "taza-tierra",
    name: "Taza Tierra",
    categoryId: "ceramica",
    price: 1800,
    imageUrl: photo("photo-1514228742587-6b1558fcca3d"),
    subtitle: "Cerámica · 300 ml",
    color: "#a87153",
    description:
      "Tu café de la mañana merece su propio ritual. Una taza de formas sencillas, tacto agradable y tamaño perfecto para empezar despacio.",
    material: "Cerámica esmaltada",
    dimensions: "300 ml",
  },
  {
    productId: "cojin-lino",
    name: "Cojín Lino",
    categoryId: "textiles",
    price: 3400,
    imageUrl: photo("photo-1584100936595-c0654b55a2e2"),
    subtitle: "Textura natural · crudo",
    color: "#e1d7c5",
    description:
      "Textura, comodidad y un pequeño cambio que transforma el ambiente. Combina su tono natural con los colores de tu casa.",
    material: "Funda de lino y algodón",
    dimensions: "45 × 45 cm",
  },
  {
    productId: "lampara-alba",
    name: "Lámpara Alba",
    categoryId: "decoracion",
    price: 8900,
    imageUrl: photo("photo-1507473885765-e6ed057f782c"),
    subtitle: "Luz cálida · sobremesa",
    badge: "Nuevo",
    color: "#dbc7a6",
    description:
      "Una luz suave para acompañar tus lecturas y dar calidez a ese rincón especial. Su forma limpia funciona en cualquier estancia.",
    material: "Metal y pantalla textil",
    dimensions: "32 × 48 cm",
  },
  {
    productId: "sillon-refugio",
    name: "Sillón Refugio",
    categoryId: "muebles",
    price: 24900,
    imageUrl: photo("photo-1567538096630-e0c55bd6374c"),
    subtitle: "Un lugar para desconectar",
    color: "#af9882",
    description:
      "Un asiento generoso y una presencia serena. Refugio convierte un rincón vacío en el lugar al que siempre quieres volver.",
    material: "Estructura de madera y tapizado",
    dimensions: "76 × 80 × 84 cm",
  },
].map((product, index) => ({
  ...product,
  currency: "USD",
  stock: 8 + index * 3,
  status: "active",
  sku: `CN-${100 + index}`,
}));

export const demoOrders = [
  {
    orderId: "CN-2026-1042",
    totalAmount: 10200,
    status: "Entregado",
    currency: "USD",
    createdAt: "2026-09-18T12:00:00Z",
    userId: "demo-buyer",
  },
  {
    orderId: "CN-2026-1086",
    totalAmount: 6400,
    status: "En preparación",
    currency: "USD",
    createdAt: "2026-09-25T12:00:00Z",
    userId: "demo-buyer",
  },
];
