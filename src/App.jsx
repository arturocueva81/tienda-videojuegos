import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

// Importación de componentes de la aplicación
import Navbar from './components/Navbar';
import TablaVideojuegos from './components/TablaVideojuegos';
import FormularioVideojuego from './components/FormularioVideojuego';
import PaginaNoEncontrada from './components/PaginaNoEncontrada';

// ─────────────────────────────────────────────
// CONFIGURACIÓN DE LA API
// RAWG es una base de datos gratuita de videojuegos con imágenes de portada
// Documentación: https://rawg.io/apidocs
// ─────────────────────────────────────────────
const RAWG_KEY = '46f0dcd8b88b4e61bba8307efc283c1a';

// ─────────────────────────────────────────────
// DATOS INICIALES
// Lista de videojuegos que se carga al iniciar la aplicación.
// Cada juego tiene: id único, título, género, plataforma, fecha de lanzamiento,
// precio, disponibilidad en Game Pass, progreso (0 a 1) e imagen (vacía al inicio).
// La imagen se carga automáticamente desde RAWG al montar el componente.
// ─────────────────────────────────────────────
const juegosIniciales = [
    { id: 1, titulo: 'Halo Infinite', genero: 'Shooter',plataforma: 'Xbox Series X', lanzamiento: '2021-12-08', precio: 59.99, disponible: true,  progreso: 0.85, imagen: '' },
    { id: 2, titulo: 'Gran Turismo', genero: 'Deportes',plataforma: 'Playstation', lanzamiento: '2021-11-09', precio: 59.99, disponible: true,  progreso: 0.60, imagen: '' },
    { id: 3, titulo: 'Cyberpunk 2077', genero: 'RPG',plataforma: 'PC',lanzamiento: '2020-12-10', precio: 39.99, disponible: false, progreso: 0.30, imagen: '' },
    { id: 4, titulo: 'Mario Kart 8 Deluxe', genero: 'Aventura',plataforma: 'Nintendo', lanzamiento: '2018-03-20', precio: 29.99, disponible: true,  progreso: 0.50, imagen: '' },
    { id: 5, titulo: 'Unreal Tournament 3', genero: 'Shooter', plataforma: 'PC',lanzamiento: '2021-10-28', precio: 49.99, disponible: true,  progreso: 0.20, imagen: '' },
];

// ─────────────────────────────────────────────
// FUNCIÓN: buscarImagen
// Realiza una petición a la API de RAWG para obtener la imagen de portada
// de un videojuego buscándolo por su título.
//
// Parámetro: titulo (string) — nombre del juego a buscar
// Retorna:   URL de la imagen (string) o '' si no se encontró o hubo error
//
// encodeURIComponent convierte caracteres especiales del título para
// que funcionen correctamente en la URL (ej: espacios → %20)
// page_size=1 limita la respuesta a un solo resultado (el más relevante)
// ─────────────────────────────────────────────
const buscarImagen = async (titulo) => {
    try {
        const res = await fetch(
            `https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${encodeURIComponent(titulo)}&page_size=1`
        );
        const data = await res.json();
        // data.results[0] es el primer (y único) resultado
        // ?.background_image accede a la imagen de forma segura (optional chaining)
        // || '' retorna cadena vacía si no existe imagen
        return data.results?.[0]?.background_image || '';
    } catch {
        // Si hay un error de red o la API falla, retornamos vacío
        // para no romper la aplicación
        return '';
    }
};

// ─────────────────────────────────────────────
// COMPONENTE: Contenido
// Contiene toda la lógica de la aplicación y las rutas.
// Se separa de App() porque useNavigate solo puede usarse
// dentro de un componente que esté envuelto por <BrowserRouter>.
// Si se pusiera directamente en App(), daría error.
// ─────────────────────────────────────────────
function Contenido() {

    // useNavigate permite cambiar de ruta desde el código (sin que el usuario haga clic en un link)
    const navigate = useNavigate();

    // Estado central — todos los videojuegos viven aquí.
    // Cuando este estado cambia, React re-renderiza automáticamente
    // los componentes que lo usan (TablaVideojuegos, etc.)
    const [videojuegos, setVideojuegos] = useState(juegosIniciales);

    // ─────────────────────────────────────────────
    // EFECTO: Carga de imágenes iniciales
    // Se ejecuta una sola vez al montar el componente ([] = sin dependencias).
    // Promise.all espera a que TODAS las búsquedas terminen en paralelo
    // antes de actualizar el estado — más rápido que hacerlo una por una.
    // Nota: se usa useState en lugar de useEffect por simplicidad,
    // aunque useEffect sería la práctica más estándar para efectos secundarios.
    // ─────────────────────────────────────────────
    useEffect(() => {
    const cargarImagenes = async () => {
        const actualizados = await Promise.all(
            juegosIniciales.map(async (juego) => ({
                ...juego,
                imagen: await buscarImagen(juego.titulo),
            }))
        );
        setVideojuegos(actualizados);
    };
    cargarImagenes();
    }, []);

    // ─────────────────────────────────────────────
    // CRUD: Operaciones sobre la lista de videojuegos
    // ─────────────────────────────────────────────

    // CREAR — busca la imagen del nuevo juego y lo agrega al final de la lista
    const agregarJuego = async (nuevoJuego) => {
        const imagen = await buscarImagen(nuevoJuego.titulo);
        setVideojuegos([...videojuegos, { ...nuevoJuego, imagen }]);
        // [...videojuegos] copia la lista actual y agrega el nuevo juego al final
    };

    // ELIMINAR — filtra la lista excluyendo el juego con el id recibido
    const eliminarJuego = (id) => {
        setVideojuegos(videojuegos.filter((j) => j.id !== id));
    };

    // NAVEGAR A EDITAR — redirige al formulario enviando el juego como "state"
    // El formulario recibe estos datos a través de useLocation()
    const irAEditar = (juego) => {
        navigate('/editar', { state: juego });
    };

    // ACTUALIZAR — busca la nueva imagen y reemplaza el juego editado en la lista
    // .map() recorre todos los juegos: si el id coincide, reemplaza; si no, lo deja igual
    const actualizarJuego = async (juegoEditado) => {
        const imagen = await buscarImagen(juegoEditado.titulo);
        setVideojuegos(videojuegos.map((j) =>
            j.id === juegoEditado.id ? { ...juegoEditado, imagen } : j
        ));
    };

    return (
        <>
            {/* Navbar se muestra en todas las rutas */}
            <Navbar />

            {/*
                Routes: solo renderiza el componente que coincide con la URL actual.
                Funciona como un switch: entra a la primera ruta que coincide.

                /        → Tabla principal con todos los juegos
                /nuevo   → Formulario vacío para crear un juego nuevo
                /editar  → Formulario precargado para editar un juego existente
                *        → Cualquier ruta no definida muestra el error 404
            */}
            <Routes>
                <Route path="/" element={
                    <TablaVideojuegos
                        videojuegos={videojuegos}   // prop: lista completa de juegos
                        onEliminar={eliminarJuego}  // prop: función para eliminar
                        onEditar={irAEditar}        // prop: función para navegar a editar
                    />
                } />

                <Route path="/nuevo" element={
                    <FormularioVideojuego
                        onAgregar={agregarJuego}    // prop: función para crear
                        onEditar={actualizarJuego}  // prop: función para actualizar
                    />
                } />

                <Route path="/editar" element={
                    <FormularioVideojuego
                        onAgregar={agregarJuego}
                        onEditar={actualizarJuego}
                    />
                } />

                <Route path="*" element={<PaginaNoEncontrada />} />
            </Routes>
        </>
    );
}

// ─────────────────────────────────────────────
// COMPONENTE RAÍZ: App
// Envuelve toda la aplicación con BrowserRouter para habilitar
// el sistema de rutas SPA (Single Page Application).
// SPA = la página nunca se recarga; React cambia solo lo necesario.
// ─────────────────────────────────────────────
function App() {
    return (
        <BrowserRouter>
            <Contenido />
        </BrowserRouter>
    );
}

export default App;