import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { categories } from "../assets/categories";
import { useUserContext } from "../context/AuthContext";

export default function Sidebar({ selectedCategory, setSelectedCategory }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 650);
  const { userProfile } = useUserContext();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 650);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredCategories = isMobile
    ? categories.filter(
        (category) =>
          category.name !== "Notification" &&
          category.name !== "Settings"
      )
    : categories;

  const defaultImage =
    "https://pathwayactivities.co.uk/wp-content/uploads/2016/04/Profile_avatar_placeholder_large-circle-300x300.png";

  return (
    <>
      <div className="sidebar">
        {filteredCategories.map((category) => (
          <div className="" key={category.name}>
            <NavLink
              to={`/${category.name}`}
              className={`menu-item ${({ isActive }) =>
                isActive ? "active" : ""}`}
              onClick={() => setSelectedCategory(category.name)}
              // key={category.name}
            >
              <span>
                {category.name === "Profile" ? (
                  <div
                    style={{
                      width: "1.7rem",
                      height: "auto",
                      borderRadius: "50%",
                      objectFit: "cover",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: "1rem",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <img
                      src={userProfile?.avatarUrl || defaultImage}
                      alt="Profile"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                ) : (
                  category.icon
                )}
              </span>

              <h3
                style={
                  selectedCategory === "Messages" ? { display: "none" } : {}
                }
              >
                {category.name}
              </h3>
            </NavLink>
          </div>
        ))}
      </div>
    </>
  );
}
