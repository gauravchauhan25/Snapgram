import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "../page-styles/CreatePost.css";
import "../page-styles/EditProfile.css";
import { storage, account } from "../services/appwrite";
import api from "../services/appwrite";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Edit Profile";

    
  }, []);

  const editProfile = async (e) => {
    e.preventDefault();


  }
  
  const defaultImage =
    "https://pathwayactivities.co.uk/wp-content/uploads/2016/04/Profile_avatar_placeholder_large-circle-300x300.png";

  return (
    <div className="create-post-container">
      <h1 className="title">Edit Profile</h1>

      <form onSubmit={editProfile}>
        <div className="container-profile-photo">
          <div className="edit-profile-picture">
              <img src={defaultImage} alt="Profile" />
          </div>

          <div className="profile-info">
            <h3>Gaurav Chauhan</h3>
          </div>

          <div className="change-photo">
             <button type="submit" className="edit-btn" disabled={loading}>
               {loading ? "Changing.." : "Change Photo"}
             </button>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="name" className="label">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder={name}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio" className="label">
            Bio
          </label>
          <input
            type="text"
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="input"
          />
        </div>
        <button type="submit" className="edit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Edit profile"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
