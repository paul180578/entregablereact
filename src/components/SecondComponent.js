import React, { useState, useMemo } from "react";

export const SecondComponent = ({ users = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      (user.name && user.name.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term)) ||
      (user.phone && user.phone.includes(term))
    );
  }, [users, searchTerm]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📄 Consultar Usuarios</h2>

      {/* Búsqueda */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por nombre, email o teléfono..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <h3>No se encontraron resultados</h3>
          <p>La base de datos está vacía o el término no coincide.</p>
        </div>
      ) : (
        <div className="table-container">
          <table> 
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Fecha Registro</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  {/* Manejo de created_at nulo */}
                  <td>{u.created_at ? new Date(u.created_at).toLocaleDateString('es-ES') : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {searchTerm && (
        <p className="message info">
          📌 Mostrando {filteredUsers.length} de {users.length} usuarios
        </p>
      )}
    </div>
  );
};