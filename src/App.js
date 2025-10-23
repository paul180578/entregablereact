import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import { FirstComponent } from "./components/FirstComponent";
import { SecondComponent } from "./components/SecondComponent";
import { ThreeComponent } from "./components/ThreeComponent";
import { FourComponent } from "./components/FourComponent";
import { StatsComponent } from "./components/StatsComponent";

function App() {
  const [activeTab, setActiveTab] = useState("stats");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📄 Cargar usuarios desde backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 📘 Renderiza el componente según la pestaña activa
  const renderComponent = () => {
    if (loading) {
      return <p className="message info">⏳ SYSTEM LOADING: Cargando base de datos...</p>;
    }

    switch (activeTab) {
      case "stats":
        return <StatsComponent users={users} />;
      case "create":
        return <FirstComponent onUserCreated={fetchUsers} />;
      case "read":
        return <SecondComponent users={users} />;
      case "update":
        return <ThreeComponent users={users} onUserUpdated={fetchUsers} />;
      case "delete":
        return <FourComponent users={users} onUserDeleted={fetchUsers} />;
      default:
        return null;
    }
  };

 // ... dentro de la función App()

// ...

return (
    <div className="App">
      <header className="App-header">
        <div className="App-logo">⛭</div> 
        <h1>CYBERNETIC USER MANAGEMENT SYSTEM</h1>

        {/* 🧭 Navegación: Añadido data-text para el efecto Glitch */}
        <div className="tab-buttons">
          <button
            onClick={() => setActiveTab("stats")}
            className={activeTab === "stats" ? "active" : ""}
            data-text="📊 DASHBOARD" // 💡 Nuevo atributo
          >
            📊 DASHBOARD
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={activeTab === "create" ? "active" : ""}
            data-text="➕ REGISTRAR" // 💡 Nuevo atributo
          >
            ➕ REGISTRAR
          </button>
          <button
            onClick={() => setActiveTab("read")}
            className={activeTab === "read" ? "active" : ""}
            data-text="📄 CONSULTAR" // 💡 Nuevo atributo
          >
            📄 CONSULTAR
          </button>
          <button
            onClick={() => setActiveTab("update")}
            className={activeTab === "update" ? "active" : ""}
            data-text="✏️ MODIFICAR" // 💡 Nuevo atributo
          >
            ✏️ MODIFICAR
          </button>
          <button
            onClick={() => setActiveTab("delete")}
            className={activeTab === "delete" ? "active" : ""}
            data-text="🗑️ DELETAR" // 💡 Nuevo atributo
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
