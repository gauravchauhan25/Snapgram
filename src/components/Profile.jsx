import React, { useEffect, useState } from "react";
import { storage, account } from "../services/appwrite";
import Posts from "../components/Posts";
import PostModal from "./PostModal";
import { posts } from "../sources/constants";
import auth from "../services/appwrite";
import "../page-styles/Profile.css";
import { Link } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Profile";

    const fetchUserProfile = async () => {
      try {
        const userAccount = await account.get();
        const email = userAccount.email;
        const userData = await auth.getUserByEmail(email);

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

    (async () => {
      await fetchUserProfile();
    })();
  }, []);

  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <div className="center profile-container">
        <div className="profile-header">
          <div className="profile-picture">
            <img src={"https://via.placeholder.com/150"} alt="Profile" />
          </div>

          <div className="profile-info">
            <div className="edit-profile">
              <div className="user-info">
                <h4>{user.name}</h4>
                <h5>@{user.username}</h5>
              </div>

              <button
                className="edit-btn"
                onClick={() => navigate("/edit-profile")}
              >
                Edit Profile
              </button>
            </div>

            <div className="profile-description large">
              <p
                dangerouslySetInnerHTML={{
                  __html: user.bio.replace(/,/g, ",<br />"),
                }}
              ></p>

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

      {/* <div className="posts">
        <a href="#" className="post-title">
          Posts
        </a>
        <Posts posts={posts} onPostClick={openModal} />

        {selectedPost && <PostModal post={selectedPost} onClose={closeModal} />}
      </div> */}
    </>
  );
};

export default Profile;
