import { Link } from 'react-router-dom';
import './PaginaNoEncontrada.css';

// ─────────────────────────────────────────────
// COMPONENTE: PaginaNoEncontrada (Error 404)
// Se renderiza cuando el usuario intenta acceder a una ruta
// que no está definida en App.jsx (la ruta comodín: path="*").
//
// Temática: Red Ring of Death (RROD) — el famoso error de hardware
// de Xbox 360 que se muestra como anillo rojo, adaptado al error 404.
//
// No recibe props — es un componente estático sin lógica.
// ─────────────────────────────────────────────
function PaginaNoEncontrada() {
    return (
        <div className="pagina404-container">

            {/* ── Animación: Anillo Rojo de la Muerte (RROD) ──
                Recreación visual del error icónico del Xbox 360.
                Se construye con dos divs y animaciones CSS puras:
                - rrod-outer: el anillo exterior con el efecto rojo
                Toda la animación está definida en PaginaNoEncontrada.css */}
            <div className="rrod-wrapper">
                <div className="rrod-outer"></div>
            </div>

            <br />

            {/* Código de error — hace referencia al error HTTP 404
                HTTP 404 = el servidor no encontró el recurso solicitado
                Aquí lo usamos porque la ruta no existe en la app */}
            <h1>ERROR: 404</h1><br/>
            <h2>Página no encontrada</h2>
            <p>La ruta que buscas no existe.</p>

            {/* <Link> navega de regreso a "/" sin recargar la página.
                className permite aplicar estilos específicos al link
                desde PaginaNoEncontrada.css */}
            <Link to="/" className="pagina404-link">
                ⬅️ Volver al Inventario
            </Link>

        </div>
    );
}

export default PaginaNoEncontrada;