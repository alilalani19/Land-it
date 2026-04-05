import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

const AuthContext = createContext();

const ADMIN_EMAIL = "alalani29@sjs.org";

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

function getAllUsers() {
  return loadUsers().map(({ password, ...u }) => u);
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
      isAdmin: email === ADMIN_EMAIL,
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
    // Ensure admin flag is set even for existing accounts
    safeUser.isAdmin = safeUser.email === ADMIN_EMAIL;
    setUser(safeUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, signup, login, logout, getAllUsers }), [user, signup, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
