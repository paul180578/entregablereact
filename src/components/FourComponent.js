import React, { useState } from "react";

export const FourComponent = ({ users = [], onUserDeleted }) => {
    // CORREGIDO: Usamos window.confirm, pero si quieres evitarlo por completo,
    // puedes usar una función de mensaje simple aquí. Mantenemos el confirm
    // ya que estaba en tu código original, pero lo encerramos en una función.
    const customConfirm = (message) => window.confirm(message);

    const [message, setMessage] = useState("");

    const handleDelete = (id) => {
        if (!customConfirm("🚨 ALERTA DE SISTEMA: ¿Seguro que deseas ELIMINAR permanentemente a este usuario?")) return;

        // Llamar a la función de eliminación centralizada en App.js (usa localStorage)
        const result = onUserDeleted(id);
            
        if (result.success) {
            setMessage("✅ Usuario [ID: " + id + "] eliminado correctamente.");
        } else {
            // Este caso es poco probable con la implementación actual, pero se mantiene para manejo de errores.
            setMessage("❌ Error al eliminar usuario.");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>🗑️ Deletar Usuario</h2>
            {message && <p className={`message ${message.includes("✅") ? 'success' : message.includes("❌") ? 'error' : 'info'}`}>{message}</p>}

            {users.length === 0 ? (
                <div className="empty-state">
                    <h3>No hay registros en el sistema</h3>
                    <p>Crea nuevos usuarios en la pestaña "Registrar".</p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Acción</th></tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td className="action-buttons">
                                        <button className="btn-delete" onClick={() => handleDelete(u.id)}>🔴 DELETAR</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
