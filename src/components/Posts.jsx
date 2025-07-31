import { useState, useEffect } from "react";
import { useUserContext } from "../context/AuthContext";

const Post = ({ post, onPostClick }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const { userProfile } = useUserContext();

  useEffect(() => {
    const handleResize = () => {
      setIsDisabled(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const defaultImage =
    "https://pathwayactivities.co.uk/wp-content/uploads/2016/04/Profile_avatar_placeholder_large-circle-300x300.png";

  return (
    <div
      className={`post-card ${isDisabled ? "disabled" : ""}`}
      onClick={() => !isDisabled && onPostClick(post)}
    >
      <div className="feed">
        <div className="post-details">
          <div className="head">
            <div className="user">
              <div className="profile-photo">
                <img
                  src={userProfile?.avatarUrl || defaultImage}
                  alt=""
                  loading="lazy"
                />
              </div>
              <div className="ingo">
                <h3>{userProfile?.username}</h3>
                <small>{post?.location}</small>
              </div>
            </div>

            <span className="edit">
              <i>
                <span className="material-symbols-outlined">more_vert</span>
              </i>
            </span>
          </div>

          <div className="caption">
            <p>
              <b>{userProfile?.name} </b>
              {post.caption}
            </p>
          </div>
        </div>
        <img
          src={post?.fileUrl}
          alt={`Post ${post?.$id}`}
          className="post-image"
        />
      </div>
    </div>
  );
};

export default Post;
