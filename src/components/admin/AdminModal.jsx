import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

export function AdminModal({ title, onClose, busy = false, children }) {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    const opener = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      requestAnimationFrame(() => { if (opener?.isConnected) opener.focus(); });
    };
  }, []);
  return createPortal(
    <dialog ref={ref} className="admin-product-dialog admin-workspace" aria-labelledby={titleId}
      onCancel={e => { e.preventDefault(); if (!busy) onClose(); }}>
      <div className="admin-modal-content">
        <header className="admin-dialog-heading">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="admin-dialog-close" aria-label="Cerrar ventana" disabled={busy} onClick={onClose}>×</button>
        </header>
        {children}
      </div>
    </dialog>, document.body,
  );
}
