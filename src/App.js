import "./App.css";
import React, { useEffect, useState, useCallback } from "react";
import { FirstComponent } from "./components/FirstComponent";
import { SecondComponent } from "./components/SecondComponent";
import { ThreeComponent } from "./components/ThreeComponent";
import { FourComponent } from "./components/FourComponent";
import { StatsComponent } from "./components/StatsComponent";

// Clave para localStorage
const LOCAL_STORAGE_KEY = "cybernetic_user_system_users";
// Datos semilla iniciales para la primera carga
const INITIAL_SEED_DATA = [
  { id: 1, name: 'Juan Pérez', email: 'juan@gmail.com', phone: '555-1234', created_at: new Date().toISOString() },
  { id: 2, name: 'Ana López', email: 'ana@example.com', phone: '555-5678', created_at: new Date(Date.now() - 86400000 * 5).toISOString() }, 
  { id: 3, name: 'Carlos García', email: 'carlos@gmail.com', phone: '555-9012', created_at: new Date().toISOString() },
  { id: 4, name: 'María Fernández', email: 'maria@example.com', phone: '555-3456', created_at: new Date(Date.now() - 86400000 * 10).toISOString() }, 
  { id: 5, name: 'Lucía Torres', email: 'lucia@gmail.com', phone: '555-7890', created_at: new Date().toISOString() }
];

function App() {
  const [activeTab, setActiveTab] = useState("stats");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextId, setNextId] = useState(1); // Simula el AUTO_INCREMENT

  // Cargar usuarios desde localStorage o usar datos semilla
  const loadUsers = useCallback(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        const parsedUsers = JSON.parse(storedData);
        setUsers(parsedUsers);
        // Calcula el siguiente ID disponible
        const maxId = parsedUsers.reduce((max, user) => Math.max(max, user.id), 0);
        setNextId(maxId + 1);
      } else {
        // Inicializa con datos semilla y guarda en localStorage
        setUsers(INITIAL_SEED_DATA);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED_DATA));
        setNextId(INITIAL_SEED_DATA.length + 1);
      }
    } catch (error) {
      console.error("Error al cargar datos de localStorage:", error);
      setUsers(INITIAL_SEED_DATA); // Fallback
      setNextId(INITIAL_SEED_DATA.length + 1);
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Guardar usuarios en localStorage cada vez que 'users' cambie
  useEffect(() => {
    if (!loading) {
      // Ordena por ID descendente antes de guardar (para App.js original)
      const sortedUsers = [...users].sort((a, b) => b.id - a.id); 
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sortedUsers));
    }
  }, [users, loading]);

  // --- Funciones CRUD (Simulación de API) ---
  
  // Create
  const handleUserCreated = (newUser) => {
    const isDuplicate = users.some(u => u.email === newUser.email);
    if (isDuplicate) {
        return { success: false, error: "El email ya está registrado" };
    }
    
    const userWithId = {
        ...newUser,
        id: nextId,
        created_at: new Date().toISOString(),
    };
    
    setUsers(prevUsers => [userWithId, ...prevUsers]);
    setNextId(prevId => prevId + 1);
    return { success: true, user: userWithId };
  };

  // Update
  const handleUserUpdated = (id, updatedFields) => {
    const userId = parseInt(id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return { success: false, error: "Usuario no encontrado" };
    }
    
    const existingUser = users[userIndex];
    
    // Verificar duplicado de email (excepto para el usuario actual)
    const isDuplicateEmail = users.some(u => 
        u.email === updatedFields.email && u.id !== userId
    );
    
    if (isDuplicateEmail) {
      return { success: false, error: "El email ya está registrado por otro usuario" };
    }

    const updatedUser = {
      ...existingUser,
      ...updatedFields,
    };
    
    setUsers(prevUsers => 
      prevUsers.map(u => (u.id === userId ? updatedUser : u))
    );
    return { success: true, user: updatedUser };
  };

  // Delete
  const handleUserDeleted = (id) => {
    const userId = parseInt(id);
    
    // Corregido: La eliminación del usuario se maneja internamente.
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
    
    return { success: true }; 
  };


  // Renderiza el componente según la pestaña activa
  const renderComponent = () => {
    if (loading) {
      return <p className="message info">⏳ SYSTEM LOADING: Cargando base de datos virtual...</p>;
    }

    switch (activeTab) {
      case "stats":
        return <StatsComponent users={users} />;
      case "create":
        return <FirstComponent onUserCreated={handleUserCreated} />; 
      case "read":
        return <SecondComponent users={users} />;
      case "update":
        return <ThreeComponent users={users} onUserUpdated={handleUserUpdated} />;
      case "delete":
        return <FourComponent users={users} onUserDeleted={handleUserDeleted} />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-logo">⛭</div> 
        <h1>CYBERNETIC USER MANAGEMENT SYSTEM </h1>

        {/* 🧭 Navegación: Añadido data-text para el efecto Glitch */}
        <div className="tab-buttons">
          <button
            onClick={() => setActiveTab("stats")}
            className={activeTab === "stats" ? "active" : ""}
            data-text="📊 DASHBOARD" 
          >
            📊 DASHBOARD
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={activeTab === "create" ? "active" : ""}
            data-text="➕ REGISTRAR" 
          >
            ➕ REGISTRAR
          </button>
          <button
            onClick={() => setActiveTab("read")}
            className={activeTab === "read" ? "active" : ""}
            data-text="📄 CONSULTAR" 
          >
            📄 CONSULTAR
          </button>
          <button
            onClick={() => setActiveTab("update")}
            className={activeTab === "update" ? "active" : ""}
            data-text="✏️ MODIFICAR" 
          >
            ✏️ MODIFICAR
          </button>
          <button
            onClick={() => setActiveTab("delete")}
            className={activeTab === "delete" ? "active" : ""}
            data-text="🗑️ DELETAR" 
          >
            🗑️ DELETAR
          </button>
        </div>

        {/* 💡 Render dinámico */}
        <div>{renderComponent()}</div>
      </header>
    </div>
  );
}

export default App;