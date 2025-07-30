import { createContext, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [allUsersPosts, setAllUsersPosts] = useState([]);

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const userData = await api.getCurrentUser();

//         if (userData) {
//           setUserProfile({
//             username: userData.username,
//             email: userData.email,
//             name: userData.name,
//             bio: userData.bio,
//             posts: userData.posts,
//             followers: userData.followers || 0,
//             following: userData.following || 0,
//             avatarUrl: userData.avatarUrl || "",
//           });
//         } else {
//           console.error("User data not found!");
//         }
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//       }
//     };

//     const fetchUserPosts = async () => {
//       try {
//         const fetchedPosts = await api.getPostsOfUser();
//         setUserPosts(fetchedPosts);
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//       }
//     };
//     fetchUserProfile();
//     fetchUserPosts();
//   }, []);

  return (
    <UserContext.Provider
      value={{
        userProfile,
        setUserProfile,
        userPosts,
        setUserPosts,
        allUsersPosts,
        setAllUsersPosts,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserProvider);
