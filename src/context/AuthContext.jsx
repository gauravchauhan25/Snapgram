import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/appwrite";
import LoadingScreen from "../components/LoadingScreen";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [allUsersPosts, setAllUsersPosts] = useState([]);
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

  if (loading) return <LoadingScreen />

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userProfile,
        setUserProfile,
        userPosts,
        setUserPosts,
        allUsersPosts,
        setAllUsersPosts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserContext = () => useContext(AuthContext);
