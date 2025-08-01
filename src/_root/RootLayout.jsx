import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { ProfileProvider } from "../context/ProfileContext"; 

export default function RootLayout() {
  const [selectedCategory, setSelectedCategory] = useState("Home");

  return (
    <ProfileProvider>
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
            <Outlet /> {/* This will render the nested routes */}
          </div>
        </div>
      </main>
    </ProfileProvider>
  );
}
