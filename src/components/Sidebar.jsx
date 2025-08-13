import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { categories } from "../assets/categories";
import { useProfileContext } from "../context/ProfileContext";

export default function Sidebar({ selectedCategory, setSelectedCategory }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 650);
  const { userProfile } = useProfileContext();

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
          category.name !== "Notification" && category.name !== "Settings"
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
                isActive ? "active transition transform active:scale-90 hover:scale-110" : ""}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <span>
                {category.name === "Profile" ? (
                  <div
                    className="h-auto items-center justify-center px-10 py-3 rounded-full object-cover"
                    style={{
                      marginLeft: "1rem",
                    }}
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden">
                      <img
                        src={userProfile?.avatarUrl || defaultImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
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
