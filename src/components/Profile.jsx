import React, { useEffect, useState } from "react";
import profilePhoto from "../img/profile-photo.jpg";
import Posts from "../components/Posts";
import PostModal from "./PostModal";
import { posts } from "../sources/constants";
import '../page-styles/Profile.css';
const Profile = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  useEffect(() => {
    document.title = "Profile";
  }, []);

  const user = {
    username: "Gaurav Chauhan",
    fullName: "__gauravchauhan_",
    bio: `👑ɠąųཞą۷ ʂıŋɠɧ ƈɧąųɧąŋ 👑,
      20 || ɖɛƖɧıɬɛ,
      MSI 👨‍🎓`,
    followers: 1580,
    following: 200,
    posts: [
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
    ],
  };

  return (
    <>
      <div className="center profile-container">
        <div className="profile-header">
          <div className="profile-picture">
            <img src={profilePhoto} alt={`${user.username}'s profile`} />
          </div>

          <div className="profile-info">
            <div className="edit-profile">
              <h4>{user.fullName}</h4>
              {/* <button className="btn btn-primary">Follow</button> */}
            </div>

            <div className="profile-description large">
              <p
                dangerouslySetInnerHTML={{
                  __html: user.bio.replace(/,/g, ",<br />"),
                }}
              ></p>

              <div className="follower-info">
                <span>
                  <strong>{user.posts.length}</strong> Posts
                </span>
                <span>
                  <strong>{user.followers}</strong> Followers
                </span>
                <span>
                  <strong>{user.following}</strong> Following
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-description small">
          <p
            dangerouslySetInnerHTML={{
              __html: user.bio.replace(/,/g, ",<br />"),
            }}
          ></p>
          <div className="follower-info">
            <span>
              <strong>{user.posts.length}</strong> Posts
            </span>
            <span>
              <strong>{user.followers}</strong> Followers
            </span>
            <span>
              <strong>{user.following}</strong> Following
            </span>
          </div>
        </div>
      </div>

      <div className="post-title">
        <a href="#">Posts</a>
      </div>
      <Posts posts={posts} onPostClick={openModal} />
      {selectedPost && <PostModal post={selectedPost} onClose={closeModal} />}
    </>
  );
};

export default Profile;
