import React, { useEffect, useRef, useState } from "react";
import "../page-styles/Profile.css";
import { useUserContext } from "../context/AuthContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import api from "../services/appwrite";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const { userProfile, setUserProfile } = useUserContext();

  const showToastAlert = (text) => {
    toast.error(text, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const showToastSuccess = (text) => {
    toast.success(text, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  useEffect(() => {
    document.title = "Profile";
  }, []);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const updateProfilePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      showToastAlert("Please select a valid image file.");
      return;
    }

    try {
      setLoading(true);

      const uploadedFile = await api.uploadImage(file);
      if (uploadedFile) {
        console.log("File uploaded successfully", uploadedFile);
      }

      const fileUrl = await api.getFilePreview(uploadedFile.$id);
      console.log(fileUrl)
      const documentId = await api.getCurrentUserDocumentId();

      const updatedDoc = await api.updateProfile({
        documentId,
        avatar_url: fileUrl,
      });

      if (updatedDoc) {
        const freshProfile = await api.getCurrentUser();
        setUserProfile({
          ...userProfile,
          avatar_url: freshProfile.avatar_url,
        });
        showToastSuccess("Profile photo updated!");
      }
    } catch (error) {
      console.error("Error updating profile photo:", error);
      showToastAlert("Failed to update profile photo.");
    } finally {
      setLoading(false);
    }
  };

  const defaultImage =
    "https://pathwayactivities.co.uk/wp-content/uploads/2016/04/Profile_avatar_placeholder_large-circle-300x300.png";

  if (location.pathname === "/profile/edit-profile") {
    return <Outlet />;
  }

  return (
    <>
      <ToastContainer />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={updateProfilePhoto}
      />
      <div className="center profile-container">
        <div className="profile-header">
          <div className="profile-picture">
            <img
              src={userProfile?.avatar_url || defaultImage}
              alt="Profile"
              onClick={handleImageClick}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="profile-info">
            <div className="edit-profile">
              <div className="user-info">
                <h4>{userProfile?.name}</h4>
                <h5>@{userProfile?.username}</h5>
              </div>
              <button
                className="edit-profile-btn"
                onClick={() => navigate("edit-profile")}
              >
                Edit Profile
              </button>
            </div>

            <div className="profile-description large">
              <p
                dangerouslySetInnerHTML={{
                  __html: (userProfile?.bio || "").replace(/,/g, ",<br />"),
                }}
              ></p>

              <div className="follower-info">
                <span>
                  <strong>{userProfile?.posts}</strong> Posts
                </span>
                <span>
                  <strong>{userProfile?.followers}</strong> Followers
                </span>
                <span>
                  <strong>{userProfile?.following}</strong> Following
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
