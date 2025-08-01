import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/appwrite";
import LoadingScreen from "../components/LoadingScreen"; 

const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [allUserPosts, setAllUserPosts] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchPostsOfUsers = async () => {
      setLoading(true);

      try {
        const response = await api.getPostsOfAllUsers();

        const postsWithUserInfo = await Promise.all(
          response.map(async (post) => {
            const userResponse = await api.getUserById(post.userId);
            post.user = userResponse; // Attach user info to the post
            return post;
          })
        );

        setAllUserPosts(postsWithUserInfo); // Set the posts with user info
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchPostsOfUsers();
  }, []);

  if (loading) return <LoadingScreen />; 
  
  return (
    <UsersContext.Provider value={{ allUserPosts, setAllUserPosts }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsersContext = () => useContext(UsersContext);
