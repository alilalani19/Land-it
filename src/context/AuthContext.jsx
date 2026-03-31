import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem("landit_users") || "[]");
  } catch {
    return [];
  }
}

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem("landit_session") || "null");
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession);

  useEffect(() => {
    if (user) {
      localStorage.setItem("landit_session", JSON.stringify(user));
    } else {
      localStorage.removeItem("landit_session");
    }
  }, [user]);

  function signup({ name, email, password }) {
    const users = loadUsers();
    if (users.find((u) => u.email === email)) {
      return { error: "An account with this email already exists." };
    }
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      avatar: name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("landit_users", JSON.stringify([...users, { ...newUser, password }]));
    setUser(newUser);
    return { success: true };
  }

  function login({ email, password }) {
    const users = loadUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      return { error: "Invalid email or password." };
    }
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    return { success: true };
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
