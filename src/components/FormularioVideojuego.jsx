import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FormularioVideojuego.css';

// ─────────────────────────────────────────────
// COMPONENTE: FormularioVideojuego
// Sirve para DOS propósitos según desde dónde se navegue:
//   1. CREAR un juego nuevo  → viene desde el botón "Nuevo Juego" (/nuevo)
//   2. EDITAR un juego       → viene desde el botón "Editar" de la tabla (/editar)
//
// Props que recibe:
//   - onAgregar: función de App.jsx para agregar un juego nuevo al estado
//   - onEditar:  función de App.jsx para actualizar un juego existente en el estado
// ─────────────────────────────────────────────
function FormularioVideojuego({ onAgregar, onEditar }) {

    // useLocation permite leer los datos enviados al navegar.
    // Cuando el usuario hace clic en "Editar", App.jsx navega a /editar
    // y envía el objeto juego como "state". Aquí lo recuperamos.
    const location = useLocation();

    // useNavigate permite redirigir al usuario desde el código.
    // Lo usamos para volver a "/" después de guardar o cancelar.
    const navigate = useNavigate();

    // Si venimos de "Editar", location.state tendrá el objeto juego.
    // Si venimos de "Nuevo", location.state será null.
    const juego = location.state || null;

    // ─────────────────────────────────────────────
    // ESTADO: form
    // Almacena los valores actuales de todos los campos del formulario.
    // Si estamos editando (juego !== null), se precargan los datos del juego.
    // Si es nuevo (juego === null), se usan valores vacíos o por defecto.
    //
    // Operador ?. (optional chaining): accede a la propiedad solo si juego existe.
    //   juego?.titulo → si juego es null, retorna undefined (no da error)
    // Operador ?? (nullish coalescing): usa el valor de la derecha si la izquierda es null/undefined.
    //   juego?.titulo ?? '' → si no hay título, usa cadena vacía
    //
    // Caso especial de progreso:
    //   El estado central guarda progreso como decimal (0.85).
    //   El formulario lo muestra como porcentaje (85) para mejor UX.
    //   Math.round(0.85 * 100) = 85
    // ─────────────────────────────────────────────
    const [form, setForm] = useState({
        titulo:      juego?.titulo      ?? '',
        genero:      juego?.genero      ?? 'Acción',
        plataforma:  juego?.plataforma  ?? 'Xbox',
        lanzamiento: juego?.lanzamiento ?? '',
        precio:      juego?.precio      ?? '',
        disponible:  juego?.disponible  ?? false,
        progreso:    juego?.progreso    ? Math.round(juego.progreso * 100) : 0,
        sinopsis:     juego?.sinopsis     ?? '',
        calificacion: juego?.calificacion ?? '',
    });

    // Estado que guarda los mensajes de error de cada campo
    // Empieza vacío — sin errores al cargar el formulario
    const [errores, setErrores] = useState({});

    // ─────────────────────────────────────────────
    // FUNCIÓN: handleChange
    // Manejador genérico que actualiza cualquier campo del form al escribir.
    // Funciona para: text, number, date, select y checkbox.
    //
    // e.target desestructura las propiedades del input que disparó el evento:
    //   - name:    atributo name del input (ej: "titulo", "precio")
    //   - value:   valor actual del input
    //   - type:    tipo del input ("text", "checkbox", etc.)
    //   - checked: estado del checkbox (true/false)
    //
    // [name]: sintaxis de propiedad dinámica — usa el valor de "name" como clave.
    //   Ejemplo: si name="titulo", actualiza form.titulo con el nuevo value.
    // ...form: copia todos los campos anteriores para no perder datos.
    // ─────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    // ─────────────────────────────────────────────
    // FUNCIÓN: handleSubmit
    // Se ejecuta al hacer clic en "Guardar" o "Registrar Juego".
    //
    // e.preventDefault() evita que el navegador recargue la página
    // (comportamiento por defecto de un <form> al hacer submit).
    //
    // Conversión de progreso: el form guarda 85, pero el estado central
    // necesita 0.85. Por eso dividimos entre 100 al guardar.
    //   Number(form.progreso) / 100 → convierte "85" (string) a 0.85 (number)
    //
    // Ternario: si hay juego editado → llama onEditar con el id original
    //           si es nuevo          → llama onAgregar con id único (Date.now())
    //
    // Date.now() retorna el timestamp actual en milisegundos.
    // Es una forma simple de generar ids únicos sin una base de datos.
    // ─────────────────────────────────────────────

    // ─────────────────────────────────────────────
    // FUNCIÓN: validarFormulario
    // Revisa cada campo y construye un objeto con los mensajes de error.
    // Si un campo está mal → agrega su mensaje al objeto 'nuevosErrores'
    // Si todo está bien   → el objeto queda vacío {}
    // Retorna true si NO hay errores (formulario válido)
    // Retorna false si HAY errores (bloquea el envío)
    // ─────────────────────────────────────────────
    const validarFormulario = () => {
        const nuevosErrores = {};

        // Validar título — no puede estar vacío
        if (!form.titulo.trim()) {
            nuevosErrores.titulo = 'El título es obligatorio';
        }

        // Validar fecha — no puede estar vacía
        if (!form.lanzamiento) {
            nuevosErrores.lanzamiento = 'La fecha de lanzamiento es obligatoria';
        }

        // Validar precio — debe ser mayor a 0
        if (!form.precio || Number(form.precio) <= 0) {
            nuevosErrores.precio = 'El precio debe ser mayor a 0';
        }

        // Validar sinopsis — entre 10 y 250 caracteres
        if (form.sinopsis.trim().length < 10) {
            nuevosErrores.sinopsis = 'La sinopsis debe tener al menos 10 caracteres';
        } else if (form.sinopsis.trim().length > 250) {
            nuevosErrores.sinopsis = 'La sinopsis no puede superar los 250 caracteres';
        }

        // Validar calificación — entre 1 y 100
        const cal = Number(form.calificacion);
        if (!form.calificacion || cal < 1 || cal > 100) {
            nuevosErrores.calificacion = 'La calificación debe estar entre 1 y 100';
        }

        // Guardamos los errores en el estado para mostrarlos en pantalla
        setErrores(nuevosErrores);

        // Si el objeto está vacío → no hay errores → retorna true
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!validarFormulario()) return;

        const datos = { ...form, progreso: Number(form.progreso) / 100 };
        juego ? onEditar({ ...datos, id: juego.id }) : onAgregar({ ...datos, id: Date.now() });
        navigate('/'); // regresa a la tabla después de guardar
    };

    return (
        <div className="formulario-container">

            {/* Título dinámico: cambia según el modo (crear o editar) */}
            <h2>{juego ? '✏️ Editar Videojuego' : '🎮 Registrar Nuevo Videojuego'}</h2>

            {/* onSubmit llama a handleSubmit cuando el usuario envía el formulario */}
            <form onSubmit={handleSubmit} className="formulario">

                {/* INPUT TEXT — Título del juego */}
                <div className="campo">
                    <label>Título</label>
                    <input type="text" name="titulo" value={form.titulo} onChange={handleChange} placeholder="Ej: Halo Infinite" required />
                    {errores.titulo && <span className="error-msg">⚠️ {errores.titulo}</span>}
                </div>

                {/* SELECT — Género: lista fija de opciones predefinidas */}
                <div className="campo">
                    <label>Género</label>
                    <select name="genero" value={form.genero} onChange={handleChange}>
                        <option>Acción</option>
                        <option>Aventura</option>
                        <option>Deportes</option>
                        <option>Estrategia</option>
                        <option>Peleas</option>
                        <option>RPG</option>
                        <option>Shooter</option>
                    </select>
                </div>

                {/* SELECT — Plataforma: consola o PC donde se juega */}
                <div className="campo">
                    <label>Plataforma</label>
                    <select name="plataforma" value={form.plataforma} onChange={handleChange}>
                        <option>PC</option>
                        <option>Nintendo</option>
                        <option>Playstation</option>
                        <option>Xbox</option>
                    </select>
                </div>

                {/* INPUT DATE — Fecha de lanzamiento oficial del juego */}
                <div className="campo">
                    <label>Fecha de Lanzamiento</label>
                    <input type="date" name="lanzamiento" value={form.lanzamiento} onChange={handleChange} required />
                    {errores.lanzamiento && <span className="error-msg">⚠️ {errores.lanzamiento}</span>}
                </div>

                {/* INPUT NUMBER — Precio: step="0.01" permite centavos (ej: 59.99) */}
                <div className="campo">
                    <label>Precio ($)</label>
                    <input type="number" name="precio" value={form.precio} onChange={handleChange} placeholder="Ej: 59.99" min="0" step="0.01" required />
                    {errores.precio && <span className="error-msg">⚠️ {errores.precio}</span>}
                </div>

                {/* INPUT NUMBER — Progreso del jugador (0 a 100%)
                    value: si progreso es 0, muestra el campo vacío (no "0")
                    para que el usuario pueda escribir sin el problema del "015".
                    Al guardar en handleSubmit, se convierte de vuelta a decimal. */}
                <div className="campo">
                    <label>Progreso (%)</label>
                    <input
                        type="number"
                        name="progreso"
                        value={form.progreso === 0 ? '' : form.progreso}
                        onChange={handleChange}
                        placeholder="Ej: 85"
                        min="0"
                        max="100"
                        step="1"
                    />
                </div>

                {/* CHECKBOX — Disponible en Game Pass
                    htmlFor="disponible" enlaza el <label> con el <input id="disponible">
                    para que al hacer clic en el texto también active el checkbox. */}
                <div className="campo campo-checkbox">
                    <input type="checkbox" name="disponible" id="disponible" checked={form.disponible} onChange={handleChange} />
                    <label htmlFor="disponible">Disponible en Game Pass</label>
                </div>

                {/* TEXTAREA — Sinopsis del juego
                    rows="3" define la altura visible del campo de texto.
                    minLength y maxLength limitan caracteres directamente en el HTML */}
                <div className="campo">
                    <label>Sinopsis</label>
                    <textarea
                        name="sinopsis"
                        value={form.sinopsis}
                        onChange={handleChange}
                        placeholder="Describe brevemente el juego (10 a 250 caracteres)"
                        rows="3"
                        minLength={10}
                        maxLength={250}
                    />
                    {/* Contador de caracteres en tiempo real */}
                    <small>{form.sinopsis.length}/250 caracteres</small>
                    {errores.sinopsis && <span className="error-msg">⚠️ {errores.sinopsis}</span>}
                </div>

                {/* INPUT NUMBER — Calificación del jugador */}
                <div className="campo">
                    <label>Calificación (1-100)</label>
                    <input
                        type="number"
                        name="calificacion"
                        value={form.calificacion}
                        onChange={handleChange}
                        placeholder="Ej: 90"
                        min="1"
                        max="100"
                        step="1"
                    />
                    {errores.calificacion && <span className="error-msg">⚠️ {errores.calificacion}</span>}
                </div>

                {/* BOTONES
                    - btn-guardar: type="submit" activa el onSubmit del form
                    - btn-cancelar: type="button" evita que active el submit;
                      navega de regreso a "/" sin guardar nada */}
                <div className="formulario-botones">
                    <button type="submit" className="btn-guardar">{juego ? 'Guardar Cambios' : 'Registrar Juego'}</button>
                    <button type="button" className="btn-cancelar" onClick={() => navigate('/')}>Cancelar</button>
                </div>

            </form>
        </div>
    );
}

export default FormularioVideojuego;