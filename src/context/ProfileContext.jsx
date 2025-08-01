import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/appwrite";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await api.getCurrentUser();

        if (userData) {
          setUserProfile({
            username: userData.username,
            email: userData.email,
            name: userData.name,
            bio: userData.bio,
            posts: userData.posts,
            followers: userData.followers || 0,
            following: userData.following || 0,
            avatarUrl: userData.avatarUrl || "",
          });
        } else {
          console.error("User data not found!");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const fetchedPosts = await api.getPostsOfUser();
        setUserPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchUserProfile();
    fetchUserPosts();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        userProfile,
        setUserProfile,
        userPosts,
        setUserPosts,
        loading,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
