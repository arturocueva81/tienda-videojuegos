import { Link } from 'react-router-dom';
import './Navbar.css';

// ─────────────────────────────────────────────
// COMPONENTE: Navbar
// Barra de navegación fija que aparece en todas las páginas de la app.
// Contiene el nombre de la aplicación y los links de navegación.
//
// No recibe props — es un componente estático que no depende de datos externos.
// ─────────────────────────────────────────────
function Navbar() {
    return (
        // <nav> es una etiqueta HTML semántica para barras de navegación
        <nav className="navbar">

            {/* Nombre/marca de la aplicación — solo es decorativo, no navega */}
            <span className="navbar-marca">🎮 Game Pass Manager</span>

            {/* Contenedor de los links de navegación */}
            <div className="navbar-links">

                {/* <Link> de React Router reemplaza al <a href> tradicional de HTML.
                    Diferencia clave:
                    <a href="/">        → recarga la página completa (comportamiento HTML)
                    <Link to="/">       → cambia la URL sin recargar (comportamiento SPA)
                    Esto es lo que hace que la app sea una Single Page Application (SPA). */}

                {/* Navega a "/" → renderiza TablaVideojuegos */}
                <Link to="/">📋 Inventario</Link>

                {/* Navega a "/nuevo" → renderiza FormularioVideojuego vacío */}
                <Link to="/nuevo">➕ Nuevo Juego</Link>

            </div>
        </nav>
    );
}

export default Navbar;