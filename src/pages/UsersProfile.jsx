import { useEffect, useState } from "react";
import "../page-styles/Profile.css";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/appwrite";
import Post from "../components/Posts";
import PostModal from "../components/PostModal";
import { Toaster } from "react-hot-toast";

const UsersProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const { username } = useParams();

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
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userRes = await api.getUserProfileByUsername(username);

        if (!userRes || userRes.documents.length === 0) {
          setLoading(false);
          navigate("/user-not-found");
          return;
        }

        const user = userRes.documents[0];
        setProfileData(user);

        const userPostsRes = await api.getPostsByUserId(user.userId);
        setPosts(userPostsRes.documents);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  useEffect(() => {
    if (profileData?.username) {
      document.title = `${profileData.name} • Snapgram`;
    }
  }, [profileData]);

  const defaultImage =
    "https://pathwayactivities.co.uk/wp-content/uploads/2016/04/Profile_avatar_placeholder_large-circle-300x300.png";

  if (loading) {
    return (
      <div className="spinner">
        <img src="/icons/loader.svg" alt="Loading..." />
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="profile-fade-in">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-picture">
              <img
                src={profileData?.avatarUrl || defaultImage}
                alt="Profile"
                onClick={handleProfileClick}
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="profile-info">
              <div className="edit-profile">
                <div className="user-info">
                  <h4>{profileData?.name}</h4>
                  <h5>@{profileData?.username}</h5>
                </div>
              </div>

              <div className="profile-description large-device">
                <p
                  style={{ whiteSpace: "pre-line" }}
                  dangerouslySetInnerHTML={{
                    __html: (profileData?.bio || "").replace(/,/g, ",<br />"),
                  }}
                ></p>

                <div className="follower-info">
                  <span>
                    <strong>{profileData?.posts}</strong> Posts
                  </span>
                  <span>
                    <strong>{profileData?.followers}</strong> Followers
                  </span>
                  <span>
                    <strong>{profileData?.following}</strong> Following
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-description small-device">
            <p
              style={{ whiteSpace: "pre-line" }}
              dangerouslySetInnerHTML={{
                __html: (profileData?.bio || "").replace(/,/g, ",<br />"),
              }}
            ></p>

            <div className="follower-info">
              <span>
                <strong>{profileData?.posts}</strong> Posts
              </span>
              <span>
                <strong>{profileData?.followers}</strong> Followers
              </span>
              <span>
                <strong>{profileData?.following}</strong> Following
              </span>
            </div>
          </div>
        </div>

        <div className="posts post-grid">
          {posts.map((post) => (
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

export default UsersProfile;
