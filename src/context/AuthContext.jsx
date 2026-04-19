import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, avatar, is_admin, created_at")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data;
}

function shapeUser(authUser, profile) {
  if (!authUser || !profile) return null;
  return {
    id: authUser.id,
    email: authUser.email,
    name: profile.name,
    avatar: profile.avatar,
    isAdmin: profile.is_admin,
    createdAt: profile.created_at || authUser.created_at,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function hydrate(session) {
      if (!session?.user) {
        if (mounted) setUser(null);
        return;
      }
      const profile = await fetchProfile(session.user.id);
      if (mounted) setUser(shapeUser(session.user, profile));
    }

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await hydrate(session);
      if (mounted) setLoading(false);
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      hydrate(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return { error: error.message };
    if (!data.session) {
      return { error: "Check your email to confirm your account before signing in." };
    }
    return { success: true };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({ user, loading, signup, login, logout }),
    [user, loading, signup, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
