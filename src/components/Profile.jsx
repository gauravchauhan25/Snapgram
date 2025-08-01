import React, { useEffect, useRef, useState } from "react";
import "../page-styles/Profile.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import api from "../services/appwrite";
import { ToastContainer } from "react-toastify";
import { showToastAlert, showToastSuccess } from "./ReactToasts";

import Post from "./Posts";
import PostModal from "./PostModal";
import { useProfileContext } from "../context/ProfileContext";

const Profile = () => {
  const { userProfile, setUserProfile, userPosts } = useProfileContext();
  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [selectedPost, setSelectedPost] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  useEffect(() => {
     if (userProfile?.username) {
      document.title = `${userProfile.name} • Snapgram`;
    }
  }, [userProfile]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const updateProfilePhoto = async (e) => {
    e.preventDefault();

    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      showToastAlert("Please select a valid image file.");
      return;
    }

    try {
      // setLoading(true);

      const uploadedFile = await api.uploadImage(file);
      console.log("Uploaded File Response:", uploadedFile);

      if (!uploadedFile || !uploadedFile.$id) {
        showToastAlert("File upload failed.");
        return;
      }

      const fileUrl = await api.getFilePreview(uploadedFile.$id);
      const documentId = await api.getCurrentUserDocumentId();

      const updatedDoc = await api.updateAvatar({
        documentId,
        fileUrl,
      });

      if (updatedDoc) {
        const freshProfile = await api.getCurrentUser();
        setUserProfile({
          ...userProfile,
          avatarUrl: freshProfile.avatarUrl,
        });
        showToastSuccess("Profile photo updated!");
      } else {
        showToastAlert("Failed to update profile photo.");
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

  if (location.pathname === "/Profile/edit-profile") {
    return <Outlet />;
  }

  return (
    <>
      <ToastContainer />
      <div className="fade-in">
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={updateProfilePhoto}
        />

        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-picture">
              <img
                src={userProfile?.avatarUrl || defaultImage}
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

              <div className="profile-description large-device">
                <p
                  style={{ whiteSpace: "pre-line" }}
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

          <div className="profile-description small-device">
            <p
              style={{ whiteSpace: "pre-line" }}
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

        <div className="posts post-grid">
          {userPosts.map((post) => (
            <Post key={post.$id} post={post} onPostClick={openModal} />
          ))}

          {selectedPost && (
            <PostModal post={selectedPost} onClose={closeModal} />
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
