import React, { useEffect, useState } from "react";
import "../page-styles/CreatePost.css";
import "../page-styles/EditProfile.css";
import { useUserContext } from "../context/AuthContext";
import api from "../services/appwrite";
import { ToastContainer } from "react-toastify";
import { showToastAlert, showToastSuccess } from "./ReactToasts";

const EditProfile = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [bio, setBio] = useState();

  const { userProfile, setUserProfile } = useUserContext();

  useEffect(() => {
    document.title = "Edit Profile";
  }, []);

  const handleEditProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const documentId = await api.getCurrentUserDocumentId();
      const response = await api.updateProfile({
        documentId,
        name,
        username,
        bio,
      });

      if (response) {
        console.log("Updated Successfully!", response);
        showToastSuccess("Updated Successfully!");

        const updatedUser = await api.getCurrentUser();
        if (updatedUser) {
          setUserProfile((prev) => ({
            ...prev,
            username: updatedUser.username,
            name: updatedUser.name,
            bio: updatedUser.bio,
            posts: updatedUser.posts,
            followers: updatedUser.followers || 0,
            following: updatedUser.following || 0,
          }));
        }
      } else {
        console.log("Error :: updating document");
        showToastAlert("Error updating");
      }
    } catch (error) {
      console.log("Error updating document!", error);
      showToastAlert("Error updating document!");
    } finally {
      setLoading(false);
    }
  };

  const defaultImage =
    "https://pathwayactivities.co.uk/wp-content/uploads/2016/04/Profile_avatar_placeholder_large-circle-300x300.png";

  return (
    <>
      <ToastContainer />
      <div className="edit-container">
        <h1 className="title">Edit Profile</h1>

        <form onSubmit={handleEditProfile}>
          <div className="container-profile-photo">
            <div className="edit-profile-picture">
              <img src={userProfile?.avatarUrl || defaultImage} alt="Profile" />
            </div>

            <div className="profile-info">
              <h3>{userProfile?.name}</h3>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="name" className="label">
              Name
            </label>

            <input
              type="text"
              id="name"
              // value={userProfile?.name}
              className="input"
              placeholder={userProfile?.name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              type="text"
              id="username"
              // value={userProfile?.username}
              className="input"
              placeholder={userProfile?.username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio" className="label">
              Bio
            </label>
            <textarea
              id="bio"
              placeholder={
                userProfile?.bio || "Tell us a little about yourself..."
              }
              className="input"
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <button type="submit" className="edit-btn" disabled={loading}>
            {loading ? "Updating..." : "Edit profile"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
