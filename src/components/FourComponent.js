import React, { useEffect, useState } from "react";

export const FourComponent = ({ users = [], onUserDeleted }) => {
    const [message, setMessage] = useState("");

    const handleDelete = async (id) => {
        if (!window.confirm("🚨 ALERTA DE SISTEMA: ¿Seguro que deseas ELIMINAR permanentemente a este usuario?")) return;

        try {
            const res = await fetch(`http://localhost:3000/users/${id}`, { method: "DELETE" });
            
            if (res.ok) {
                setMessage("✅ Usuario [ID: " + id + "] eliminado correctamente.");
                if (onUserDeleted) onUserDeleted();
            } else setMessage("❌ Error al eliminar usuario.");
        } catch {
            setMessage("⚠️ No se pudo conectar con el servidor. Verifica tu conexión.");
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