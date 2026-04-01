import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

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

  const signup = useCallback(({ name, email, password }) => {
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
  }, []);

  const login = useCallback(({ email, password }) => {
    const users = loadUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      return { error: "Invalid email or password." };
    }
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, signup, login, logout }), [user, signup, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
