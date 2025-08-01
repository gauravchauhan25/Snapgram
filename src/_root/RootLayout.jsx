import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { ProfileProvider } from "../context/ProfileContext";
import api from "../services/appwrite";
import { set } from "nprogress";

export default function RootLayout() {
  const [selectedCategory, setSelectedCategory] = useState("Home");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoogleUserData = async () => {
      try {
        setLoading(true);
        const user = await api.getAccount();

        if (user) {
          const exists = await api.getUserById(user.$id);

          if (!exists) {
            const response = await api.addUser(
              user.$id,
              user.name,
              user.email,
              user.name,
              user.phone || "",
              user.prefs?.photo || ""
            );

            if (response) {
              console.log(" User added to Appwrite DB:");
            } else {
              console.log(" User data failed to save.");
            }
          } else {
            console.log("User already exists.");
          }
        }
      } catch (error) {
        console.log("Error fetching user session. Logging out...", error);
        await api.logout();
        navigate("/sign-in");
      } finally { 
        setLoading(false);
      }
    };

    fetchGoogleUserData();
  }, []);

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
