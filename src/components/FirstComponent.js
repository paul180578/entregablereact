import React, { useState } from "react";

export const FirstComponent = ({ onUserCreated }) => {
    // 🚩 CORREGIDO: El estado inicial SOLO contiene los campos de la DB
    const [form, setForm] = useState({ name: "", email: "", phone: "" });
    const [status, setStatus] = useState("");

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("");

        // Validación básica antes de enviar
        if (!form.name || !form.email || !form.phone) {
            setStatus("❌ Por favor, complete todos los campos.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    // Se envía SÓLO el formulario actual (name, email, phone)
                    ...form,
                    created_at: new Date().toISOString()
                }),
            });

            if (response.ok) {
                setStatus("✅ Usuario agregado correctamente.");
                // 🚩 CORREGIDO: Resetear el formulario sin la propiedad 'password'
                setForm({ name: "", email: "", phone: "" }); 
                if (onUserCreated) onUserCreated();
            } else {
                // Leer el error si la API lo proporciona
                const errorData = await response.json();
                console.error("Error del servidor:", errorData);
                setStatus("❌ Error al agregar usuario (Server Error).");
            }
        } catch {
            setStatus("⚠️ No se pudo conectar con el servidor. Verifica que el backend esté en http://localhost:3000.");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>➕ Registrar Nuevo Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre de Usuario</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre de Usuario"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo Electrónico"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Teléfono</label>
                    <input
                        type="text"
                        name="phone"
                        placeholder="Teléfono"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn-primary">Registrar Usuario</button>
            </form>

            {status && (
                <p className={`message ${status.includes("✅") ? "success" : status.includes("❌") ? "error" : "info"}`}>
                    {status}
                </p>
            )}
        </div>
    );
};
