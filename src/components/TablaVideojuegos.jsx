import './TablaVideojuegos.css';

// Devuelve la clase CSS según la plataforma del juego
function getClasePlataforma(plataforma) {
    if (plataforma.includes('Xbox'))        return 'card-xbox';
    if (plataforma.includes('Playstation')) return 'card-playstation';
    if (plataforma.includes('Nintendo'))    return 'card-nintendo';
    return 'card-pc';
}

function TablaVideojuegos({ videojuegos, onEliminar, onEditar }) {
    return (
        <div className="tabla-container">

            <div className="tabla-header">
                <h2>Microsoft XBOX - <span>Game Pass</span></h2>
                <p className="total-badge">Total de títulos: {videojuegos.length}</p>
            </div>

            {/* Grid de 4 columnas — cada juego es una tarjeta */}
            <div className="grid-videojuegos">
                {videojuegos.map((juego) => (
                    <div
                        key={juego.id}
                        className={`card-juego ${getClasePlataforma(juego.plataforma)}`}
                    >
                        {/* 1. Título */}
                        <h3 className="card-titulo">{juego.titulo}</h3>

                        {/* 2. Imagen de portada */}
                        <div className="card-imagen-wrapper">
                            {juego.imagen
                                ? <img src={juego.imagen} alt={juego.titulo} className="card-imagen" />
                                : <div className="card-imagen-placeholder">Cargando...</div>
                            }
                        </div>

                        {/* 3. Datos del juego */}
                        <div className="card-datos">
                            <p><span>Género:</span> {juego.genero}</p>
                            <p><span>Plataforma:</span> {juego.plataforma}</p>
                            <p><span>Lanzamiento:</span> {juego.lanzamiento}</p>
                            <p><span>Precio:</span> ${juego.precio}</p>
                        </div>

                        {/* 4. Badge disponibilidad */}
                        <span className={`badge ${juego.disponible ? 'badge-disponible' : 'badge-nodisponible'}`}>
                            {juego.disponible ? 'Disponible' : 'Agotado'}
                        </span>

                        {/* 5. Barra de progreso */}
                        <div className="card-progreso">
                            <progress value={juego.progreso} max={1} />
                            <span>{Math.round(juego.progreso * 100)}%</span>
                        </div>

                        {/* 6. Botones de acción */}
                        <div className="card-acciones">
                            <button className="btn-editar"   onClick={() => onEditar(juego)}>✏️ Editar</button>
                            <button className="btn-eliminar" onClick={() => onEliminar(juego.id)}>🗑️ Eliminar</button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default TablaVideojuegos;