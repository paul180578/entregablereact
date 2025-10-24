import React, { useState } from "react";

export const FirstComponent = ({ onUserCreated }) => {
    const [form, setForm] = useState({ name: "", email: "", phone: "" });
    const [status, setStatus] = useState("");

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("");

        if (!form.name || !form.email || !form.phone) {
            setStatus("❌ Por favor, complete todos los campos.");
            return;
        }

        // Llamar a la función de creación centralizada en App.js (usa localStorage)
        const result = onUserCreated(form);

        if (result.success) {
            setStatus("✅ Usuario agregado correctamente. ID: " + result.user.id);
            setForm({ name: "", email: "", phone: "" }); 
        } else {
            // El error es manejado en App.js (por ejemplo, duplicado de email)
            setStatus(`❌ Error al agregar usuario: ${result.error || "Error desconocido"}`);
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