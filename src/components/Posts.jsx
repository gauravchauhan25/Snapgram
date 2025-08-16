import { useState, useEffect } from "react";
import { useProfileContext } from "../context/ProfileContext";
import EditPost from "./EditPost";

const Post = ({ post, postId, onPostClick }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const { userProfile } = useProfileContext();
  const [showEdit, setShowEdit] = useState(false);

    const isVideo = post.mimeType?.startsWith("video/");
  const isImage = post.mimeType?.startsWith("image/");

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
              {/* <div className="profile-photo">
                {post?.fileUrl &&
                  (post?.fileType?.startsWith("video/") ? (
                    <video
                      controls
                      className="post-video"
                      style={{ maxWidth: "100%", borderRadius: "10px" }}
                    >
                      <source src={post?.fileUrl} type={post.fileType} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={post.fileUrl}
                      alt={`Post ${post?.$id}`}
                      className="post-image"
                    />
                  ))}
              </div> */}
              <div className="ingo">
                <h3>{post?.username}</h3>
                <small>{post?.location}</small>
              </div>
            </div>

            <span
              className="material-symbols-outlined transition transform active:scale-80 hover:scale-110"
              onClick={() => setShowEdit(true)}
            >
              more_vert
            </span>
          </div>

          <div className="caption">
            <p>
              <b>{post?.username} </b>
              {post.caption}
            </p>
          </div>
        </div>

       {isVideo ? (
  <video
    src={post?.fileUrl}
    className="post-image"   // keep styling identical
    playsInline
    preload="metadata"       // shows first frame; stays paused
    // no autoplay, no loop, no controls -> stays still
  />
) : (
  <img
    src={post?.fileUrl}
    alt={`Post ${post?.$id}`}
    className="post-image"
    loading="lazy"
  />
)}

      </div>

      {showEdit && <EditPost post={post} onClose={() => setShowEdit(false)} />}
    </div>
  );
};

export default Post;
