
import './TablaVideojuegos.css';

function TablaVideojuegos({ videojuegos }) {
    return (
        <div className="tabla-container">

            <div className="tabla-header">
                <h2> Microsoft XBOX - <span>Game Pass</span></h2>
                <p>Total de títulos: {videojuegos.length}</p>
            </div>

            <div className="tabla-wrapper">
                <table className="tabla-videojuegos">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Género</th>
                            <th>Plataforma</th>
                            <th>Lanzamiento</th>
                            <th>Precio</th>
                            <th>Disponible</th>
                            <th>Progreso</th>
                        </tr>
                    </thead>
                    <tbody>
                        {videojuegos.map((juego) => (
                            <tr key={juego.id}>
                                <td>{juego.titulo}</td>
                                <td>{juego.genero}</td>
                                <td>{juego.plataforma}</td>
                                <td>{juego.lanzamiento}</td>
                                <td>${juego.precio}</td>
                                <td>
                                    <span className={`badge ${juego.disponible ? 'badge-disponible' : 'badge-nodisponible'}`}>
                                        {juego.disponible ? 'Disponible' : 'Agotado'}
                                    </span>
                                </td>

                                {/* Componente <progress> — Documentación oficial: https://react.dev/reference/react-dom/components/progress
                                    - value: valor actual del progreso (número entre 0 y 1)
                                    - max: valor máximo (1 = 100%)
                                    - Ejemplo: value={0.85} max={1} representa un 85% de progreso
                                    Math.round() convierte el decimal a porcentaje legible (0.85 → 85%)
                                    */}
                                <td className="progreso-cell">
                                    <progress value={juego.progreso} max={1} />
                                    <span>{Math.round(juego.progreso * 100)}%</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TablaVideojuegos;