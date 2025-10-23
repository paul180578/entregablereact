import React, { useState, useMemo } from "react";

export const StatsComponent = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Estadísticas calculadas (incluida la Antigüedad Promedio)
  const stats = useMemo(() => {
    const total = users.length;
    const withGmail = users.filter(u => u.email && u.email.includes("@gmail")).length;
    
    // Antigüedad promedio en días (Nueva Métrica)
    let avgDays = 0;
    
    // Filtramos usuarios con campo created_at válido para evitar errores
    const validUsers = users.filter(u => u.created_at && !isNaN(new Date(u.created_at)));
    
    if (validUsers.length > 0) {
        const totalDays = validUsers.reduce((sum, u) => {
            const createdDate = new Date(u.created_at);
            const daysDiff = (new Date() - createdDate) / (1000 * 60 * 60 * 24);
            return sum + daysDiff;
        }, 0);
        avgDays = (totalDays / validUsers.length).toFixed(1);
    }
    
    const recentUsers = validUsers.filter(u => {
      const createdDate = new Date(u.created_at);
      const daysDiff = (new Date() - createdDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length;

    return {
      total,
      withGmail,
      recentUsers,
      avgDays
    };
  }, [users]);

  // Filtrar usuarios por búsqueda
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
    <div>
      <h2>📊 Dashboard de Sistema</h2>

      {/* Tarjetas de estadísticas */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Usuarios</h3>
          <div className="stat-value">{stats.total}</div>
        </div>
        
        <div className="stat-card">
          <h3>Antigüedad Promedio (Días)</h3>
          <div className="stat-value">{stats.avgDays}</div>
        </div>

        <div className="stat-card">
          <h3>Usuarios @Gmail</h3>
          <div className="stat-value">{stats.withGmail}</div>
        </div>
        
        <div className="stat-card">
          <h3>Registrados 7 días</h3>
          <div className="stat-value">{stats.recentUsers}</div>
        </div>
      </div>

      <hr />

      {/* Búsqueda */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="🔎 Buscar Nombre, Email o Teléfono..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Resultados */}
      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <h3>ACCESS DENIED: No se encontraron registros</h3>
          <p>La búsqueda no arrojó resultados para el término ingresado.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Fecha Registro</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {searchTerm && (
        <p className="message info">
          📌 Mostrando {filteredUsers.length} de {users.length} resultados.
        </p>
      )}
    </div>
  );
};