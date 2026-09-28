import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { demoMode } from "../../data/demo";
import { Icon } from "../ui/Icon";

export function StoreLayout({ children }) {
  const { itemCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const frame = window.requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView(),
      );
      return () => window.cancelAnimationFrame(frame);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);
  const account = isAuthenticated
    ? user?.role === "admin"
      ? "/admin"
      : "/cuenta"
    : "/login";
  return (
    <div className="site-shell">
      <a className="skip-link" href="#contenido">
        Ir al contenido
      </a>
      <div className="announcement">
        <span>Objetos con alma. Espacios para vivir.</span>
        <span>
          Una selección de Casa Nativa <span className="tiny-star">✳</span>
        </span>
      </div>
      <header className="site-header">
        <Link className="wordmark" to="/" aria-label="Casa Nativa, inicio">
          casa nativa<span>OBJETOS PARA HABITAR</span>
        </Link>
        <nav
          className={`main-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Navegación principal"
          onClick={() => setMenuOpen(false)}
        >
          <NavLink to="/tienda">La colección</NavLink>
          <Link to="/tienda?categoria=ceramica">Cerámica</Link>
          <Link to="/tienda?categoria=textiles">Textiles</Link>
          <Link to="/tienda?categoria=decoracion">Decoración</Link>
          <Link to="/#nuestra-historia">Nuestra esencia</Link>
        </nav>
        <div className="header-actions">
          <Link
            className="icon-button search-link"
            to="/tienda?buscar=1"
            aria-label="Buscar productos"
          >
            <Icon name="search" />
          </Link>
          <Link className="icon-button" to={account} aria-label="Mi cuenta">
            <Icon name="user" />
          </Link>
          <Link
            className="cart-link"
            to="/carrito"
            aria-label={`Bolsa, ${itemCount} productos`}
          >
            <Icon name="bag" />
            <span>{itemCount}</span>
          </Link>
          <button
            className="icon-button mobile-menu"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </header>
      <div id="contenido" className="page-content">
        {children}
      </div>
      <section className="values-strip" aria-label="Nuestros valores">
        <div>
          <Icon name="leaf" />
          <span>
            Materiales que se sienten
            <small>Texturas naturales, belleza sencilla</small>
          </span>
        </div>
        <div>
          <Icon name="box" />
          <span>
            Cada detalle importa<small>Una selección hecha con intención</small>
          </span>
        </div>
        <div>
          <Icon name="heart" />
          <span>
            Hecho para tu día a día
            <small>Objetos que hacen de una casa tu hogar</small>
          </span>
        </div>
      </section>
      <footer className="site-footer">
        <div className="footer-top">
          <div>
            <Link className="wordmark" to="/">
              casa nativa<span>OBJETOS PARA HABITAR</span>
            </Link>
            <p>
              Menos prisa. Más hogar.
              <br />
              Encuentra belleza en lo cotidiano.
            </p>
          </div>
          <div>
            <h3>Explora</h3>
            <Link to="/tienda">Toda la colección</Link>
            <Link to="/tienda?categoria=ceramica">Cerámica</Link>
            <Link to="/tienda?categoria=textiles">Textiles</Link>
            <Link to="/tienda?categoria=muebles">Muebles</Link>
          </div>
          <div>
            <h3>Tu espacio</h3>
            <Link to={account}>Mi cuenta</Link>
            <Link to="/cuenta/ordenes">Mis pedidos</Link>
            <Link to="/carrito">Mi bolsa</Link>
          </div>
          <div className="footer-note">
            <span className="tiny-star">✳</span>
            <h3>
              Una casa se construye
              <br />
              con lo que te hace sentir.
            </h3>
            <span>Empieza por algo pequeño.</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Casa Nativa</span>
          <span>
            {demoMode
              ? "Tienda de demostración · Sin cobros reales"
              : "Objetos cotidianos, elegidos con calma."}
          </span>
          <span>USD · Español</span>
        </div>
      </footer>
      {demoMode && (
        <div className="demo-dock">
          <span>
            <i /> Modo demo
          </span>
          <Link to="/login">
            Probar cuentas <Icon name="arrow" size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
