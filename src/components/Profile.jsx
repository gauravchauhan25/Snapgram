import React, { useEffect, useState } from "react";
import { storage, account } from "../services/appwrite";
import Posts from "../components/Posts";
import PostModal from "./PostModal";
import { posts } from "../sources/constants";
import api from "../services/appwrite";
import "../page-styles/Profile.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get current route
  const [user, setUser] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Profile";

    const fetchUserProfile = async () => {
      try {
        const userAccount = await account.get();
        const email = userAccount.email;
        const userData = await api.getUserByEmail(email);

        if (userData) {
          setUser({
            username: userData.username,
            name: userData.name,
            bio: userData.bio,
            posts: userData.posts,
          });
        } else {
          console.error("User data not found!");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (isLoading)
    return (
      <p style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        Loading...
      </p>
    );

  const defaultImage =
    "https://pathwayactivities.co.uk/wp-content/uploads/2016/04/Profile_avatar_placeholder_large-circle-300x300.png";

  if (location.pathname === "/Profile/edit-profile") {
    return <Outlet />;
  }

  return (
    <>
      <div className="center profile-container">
        <div className="profile-header">
          <div className="profile-picture">
            <img src={defaultImage} alt="Profile" />
          </div>
          <div className="profile-info">
            <div className="edit-profile">
              <div className="user-info">
                <h4>{user.name}</h4>
                <h5>@{user.username}</h5>
              </div>
              <button className="edit-profile-btn" onClick={() => navigate("edit-profile")}>
                Edit Profile
              </button>
            </div>

            <div className="profile-description large">
              <p dangerouslySetInnerHTML={{ __html: user.bio.replace(/,/g, ",<br />") }}></p>

              <div className="follower-info">
                <span>
                  <strong>{user.posts}</strong> Posts
                </span>
                <span>
                  <strong>2200</strong> Followers
                </span>
                <span>
                  <strong>100</strong> Following
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
