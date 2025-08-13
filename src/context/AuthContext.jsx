import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/appwrite";
import LoadingScreen from "../components/LoadingScreen";
import { UsersProvider } from "./UsersContext";
import { StoryProvider } from "./StoryContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await api.getAccount();
        setIsAuthenticated(session);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      <UsersProvider>
        {/* <StoryProvider> */}
          {children}
        {/* </StoryProvider> */}
      </UsersProvider>
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
