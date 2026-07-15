// Recibe dos props:
// - mensaje: texto que se muestra en la notificación
// - visible: booleano que controla si se muestra o no
function AlertaNotificacion({ mensaje, visible }) {

    // Si no es visible, no renderiza nada en el DOM
    if (!visible) return null;

    return (
        <div className="toast-notificacion">
            <span className="toast-icono">✅</span>
            <span className="toast-mensaje">{mensaje}</span>
        </div>
    );
}

export default AlertaNotificacion;