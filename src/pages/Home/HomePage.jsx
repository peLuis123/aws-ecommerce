import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productsApi } from "../../api/products.api";
import { demoCategories, editorialImages } from "../../data/demo";
import { ProductCard } from "../../components/product/ProductCard";
import { Icon } from "../../components/ui/Icon";

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    productsApi
      .list()
      .then(({ data }) => {
        if (active) setProducts(data.slice(0, 4));
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);
  return (
    <main>
      <section className="hero-section">
        <img
          className="hero-background"
          src={editorialImages.hero}
          alt="Un salón luminoso con texturas naturales, madera y tonos cálidos"
          fetchPriority="high"
        />
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> LA BELLEZA DE LO COTIDIANO
          </p>
          <h1>
            Tu casa.
            <br />
            Tu pausa.
            <br />
            <em>Tu naturaleza.</em>
          </h1>
          <p>
            Objetos que invitan a bajar el ritmo.
            <br />Y a sentirte un poquito más en casa.
          </p>
          <Link className="button button-light" to="/tienda">
            Descubre la colección <Icon name="arrow" />
          </Link>
        </div>
        <div className="hero-caption">
          <span>01 — ESPACIOS QUE ABRAZAN</span>
          <span>Diseño sencillo. Vida bonita.</span>
        </div>
        <div className="hero-stamp">
          ELEGIDO
          <br />
          <span>con calma</span>
          <Icon name="leaf" size={24} />
        </div>
      </section>
      <div className="manifesto-line">
        <span>Natural por esencia.</span>
        <span className="tiny-star">✳</span>
        <span>Especial por los detalles.</span>
        <span className="tiny-star">✳</span>
        <span>Tuyo por naturaleza.</span>
      </div>
      <section className="home-section categories-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ENCUENTRA TU ESENCIA</p>
            <h2>
              Pequeños cambios.
              <br className="mobile-only" /> Nuevas sensaciones.
            </h2>
          </div>
          <span className="section-note">
            Un objeto, muchas formas de habitar.
          </span>
        </div>
        <div className="category-grid">
          {demoCategories.map((category, index) => (
            <Link
              key={category.categoryId}
              className="category-card"
              to={`/tienda?categoria=${category.categoryId}`}
            >
              <div className="category-image">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  loading="lazy"
                />
                <span>0{index + 1}</span>
              </div>
              <div>
                <h3>{category.name}</h3>
                <Icon name="arrow" />
              </div>
              <p>{category.note}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="home-section featured-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LA SELECCIÓN NATIVA</p>
            <h2>Se van a sentir en casa.</h2>
          </div>
          <Link className="text-link" to="/tienda">
            Ver toda la colección <Icon name="arrow" size={18} />
          </Link>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
        {failed && (
          <p>
            No pudimos cargar la selección.{" "}
            <Link to="/tienda">Volver a intentarlo en la tienda</Link>
          </p>
        )}
      </section>
      <section className="story-section" id="nuestra-historia">
        <div className="story-image">
          <img
            src={editorialImages.story}
            alt="Un rincón acogedor con materiales y colores naturales"
            loading="lazy"
          />
          <span>EL ARTE DE ESTAR EN CASA</span>
        </div>
        <div className="story-copy">
          <span className="story-symbol">✳</span>
          <p className="eyebrow">NUESTRA ESENCIA</p>
          <h2>
            No es tener más.
            <br />
            Es <em>sentir más.</em>
          </h2>
          <p>
            Creemos en las casas que se viven. En la taza de cada mañana, la
            textura de una manta y ese rincón donde el tiempo pasa distinto.
          </p>
          <p>
            Por eso elegimos objetos sencillos, con carácter y con un propósito:
            hacer más bonito lo que ya es tuyo.
          </p>
          <Link className="text-link" to="/tienda">
            Encuentra tu próxima pieza <Icon name="arrow" size={18} />
          </Link>
        </div>
      </section>
      <section className="closing-note">
        <p className="eyebrow">UN HOGAR MUY TUYO</p>
        <h2>
          Lo extraordinario
          <br />
          está en <em>lo cotidiano.</em>
        </h2>
        <Link className="button button-dark" to="/tienda">
          Haz espacio para lo que te gusta <Icon name="arrow" />
        </Link>
      </section>
    </main>
  );
}
