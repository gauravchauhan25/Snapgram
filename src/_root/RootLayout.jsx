import React, { useState, useEffect } from "react";
import { Outlet, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Right from "../components/Right";
import api from "../services/appwrite";
import { useUserContext } from "../context/AuthContext";

export default function RootLayout() {
  const [selectedCategory, setSelectedCategory] = useState("Home");

  const { setUserProfile } = useUserContext();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await api.getCurrentUser();

        if (userData) {
          setUserProfile({
            username: userData.username,
            name: userData.name,
            bio: userData.bio,
            posts: userData.posts,
            followers: userData.followers || 0,
            following: userData.following || 0,
            avatar_url: userData.avatar_url || "",
          });
        } else {
          console.error("User data not found!");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
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

          <div className="right">
            <Routes>
              <Route path="/" element={<Right />}></Route>
              <Route path="/Home" element={<Right />}></Route>
            </Routes>
          </div>
        </div>
      </main>
    </>
  );
}
