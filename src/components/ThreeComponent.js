import React, { useEffect, useState } from "react";

export const ThreeComponent = ({ users = [], onUserUpdated }) => {
    const [selectedId, setSelectedId] = useState("");
    const [form, setForm] = useState({ name: "", email: "", phone: "" });
    const [message, setMessage] = useState("");

    const handleSelect = (e) => {
        const id = e.target.value;
        setSelectedId(id);
        const user = users.find((u) => u.id === parseInt(id));
        if (user) {
            // Inicializa el formulario solo con los campos existentes
            setForm({ name: user.name, email: user.email, phone: user.phone });
            setMessage(""); 
        } else {
            setForm({ name: "", email: "", phone: "" });
        }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedId) return;
        
        const existingUser = users.find(u => u.id === parseInt(selectedId));
        if (!existingUser) return;
        
        try {
            // 🛑 CAMBIO CLAVE: Aseguramos que el payload no tenga 'password' del estado inicial
            const updatePayload = {
                // Mantenemos solo los campos que sabemos que existen en la DB y que no estamos editando
                id: existingUser.id,
                created_at: existingUser.created_at,
                // Agregamos los valores actualizados del formulario
                ...form,
            };

            const res = await fetch(`http://localhost:3000/users/${selectedId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatePayload),
            });
            if (res.ok) {
                setMessage("✅ Usuario actualizado correctamente.");
                if (onUserUpdated) onUserUpdated();
            } else setMessage("❌ Error al actualizar usuario.");
        } catch {
            setMessage("⚠️ No se pudo conectar con el servidor.");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>✏️ Modificar Usuario</h2>
            
            {message && <p className={`message ${message.includes("✅") ? 'success' : message.includes("❌") ? 'error' : 'info'}`}>{message}</p>}

            <form onSubmit={handleUpdate}> 
                <div className="form-group">
                    <label htmlFor="user-select">Seleccionar Usuario</label>
                    <select id="user-select" onChange={handleSelect} value={selectedId}>
                        <option value="">-- Selecciona un usuario para editar --</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>{u.name} (ID: {u.id})</option>
                        ))}
                    </select>
                </div>

                {selectedId && (
                    <>
                        <div className="form-group">
                            <label htmlFor="name-input">Nombre</label>
                            <input id="name-input" name="name" value={form.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email-input">Correo</label>
                            <input id="email-input" name="email" value={form.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone-input">Teléfono</label>
                            <input id="phone-input" name="phone" value={form.phone} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn-primary">Guardar Cambios</button>
                    </>
                )}
            </form>
            
            {users.length === 0 && (
                <div className="empty-state">
                    <h3>No hay usuarios para modificar.</h3>
                </div>
            )}
        </div>
    );
};