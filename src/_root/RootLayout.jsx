import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/appwrite";
import { useUserContext } from "../context/AuthContext";

export default function RootLayout() {
  const [selectedCategory, setSelectedCategory] = useState("Home");
  const { setUserProfile, setUserPosts, setAllUsersPosts } = useUserContext();

  useEffect(() => {
    const fetchMyProfile = async () => {
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

    const fetchMyPosts = async () => {
      try {
        const fetchedPosts = await api.getPostsOfUser();
        setUserPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchMyProfile();
    fetchMyPosts();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <div
          className="container"
          style={
            selectedCategory === "Messages"
              ? { display: "grid", gridTemplateColumns: "5vw auto auto" }
              : {}
          }
        >
          <div className="left">
            <Sidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>

          <div className="middle">
            <Outlet />
          </div>

          {/* <div className="right">
            <Routes>
              <Route path="/" element={<Right />}></Route>
              <Route path="/Home" element={<Right />}></Route>
            </Routes>
          </div> */}
        </div>
      </main>
    </>
  );
}
