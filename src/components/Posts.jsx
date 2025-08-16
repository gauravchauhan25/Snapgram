import { useState, useEffect, useRef } from "react";
import { useProfileContext } from "../context/ProfileContext";
import EditPost from "./EditPost";

const Post = ({ post, postId, onPostClick }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const { userProfile } = useProfileContext();
  const [showEdit, setShowEdit] = useState(false);
  const vidRef = useRef(null);
  const [muted, setMuted] = useState(true);

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
              <div className="profile-photo">
                <img
                  src={userProfile.avatarUrl}
                  alt={`Post ${post?.$id}`}
                  className="post-image"
                />
              </div>
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
          <div className="relative inline-block">
            <video
              src={post.fileUrl}
              ref={vidRef}
              muted={muted}
              className="photo"
              autoPlay
              loop
              playsInline
            />
            <button
              type="button"
              onClick={() => {
                const next = !muted;
                setMuted(next);
                if (vidRef.current) {
                  vidRef.current.muted = next;
                  if (!next) vidRef.current.volume = 1;
                }
              }}
              className="post-muted-btn absolute bottom-4 right-3 z-20 rounded-full bg-black text-[#fff] text-lg p-2 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label={muted ? "Unmute video" : "Mute video"}
              aria-pressed={!muted}
            >
              {muted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 10v4h4l5 4V6L7 10H3z" fill="currentColor" />
                  <path
                    d="M16 9l5 5m0-5l-5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 10v4h4l5 4V6L7 10H3z" fill="currentColor" />
                  <path
                    d="M16 8c1.657 1.343 1.657 6.657 0 8M19 5c3 3 3 11 0 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>
        ) : isImage ? (
          <img src={post.fileUrl} alt="feed" className="photo" loading="lazy" />
        ) : null}
      </div>

      {showEdit && <EditPost post={post} onClose={() => setShowEdit(false)} />}
    </div>
  );
};

export default Post;
