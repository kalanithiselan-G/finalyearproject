import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() =>
    localStorage.getItem("access_token")
  );
  const [user, setUser] = useState(null);

  const isAuthenticated = !!token;

  // Track if user has visited before (for first-time Home + glowing Get Started)
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem("sonic_visited");
    if (visited === "true") {
      setHasVisited(true);
    }
  }, []);

  const markVisited = () => {
    localStorage.setItem("sonic_visited", "true");
    setHasVisited(true);
  };

  // On mount or when token changes, fetch /me
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const res = await fetch("http://localhost:8000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Not authenticated");
        }
        const data = await res.json();
        setUser(data); // { id, email, full_name }
        markVisited(); // once we know a valid user, mark as visited
      } catch {
        setToken(null);
        setUser(null);
        localStorage.removeItem("access_token");
      }
    };
    fetchMe();
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("access_token", newToken);
    markVisited();
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
    // keep hasVisited = true so next time navbar is "normal"
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        logout,
        hasVisited,
        markVisited,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


