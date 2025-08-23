import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useProfileContext } from "../context/ProfileContext";
import EditPost from "./EditPost";
import { useRef, useState, useMemo, useEffect } from "react";

const PostModal = ({ post, onClose }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [muted, setMuted] = useState(true);
  
  const vidRef = useRef(null);
  const navigate = useNavigate();
  
  const { userProfile } = useProfileContext();

  const timeAgo = (timestamp) => {
    const now = new Date();
    const uploadedDate = new Date(timestamp);
    const secondsAgo = Math.floor((now - uploadedDate) / 1000);
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];
    for (const interval of intervals) {
      const count = Math.floor(secondsAgo / interval.seconds);
      if (count >= 1)
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
    return "just now";
  };

  const isVideo = post.mimeType?.startsWith("video/");
  const isImage = post.mimeType?.startsWith("image/");

  const defaultImage =
    "https://pathwayactivities.co.uk/wp-content/uploads/2016/04/Profile_avatar_placeholder_large-circle-300x300.png";

  useEffect(() => setMuted(true), [post?.fileUrl]);

  return (
    <>
      <Toaster />
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {isVideo ? (
            <>
              <video
                // src={post.fileUrl}
                ref={vidRef}
                className="modal-image"
                autoPlay
                loop
                muted={muted}
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
                className="muted-btn absolute bottom-11 left-[46%] z-20 rounded-full bg-black text-[#fff] text-lg p-2 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/40"
                aria-label={muted ? "Unmute video" : "Mute video"}
                aria-pressed={!muted}
              >
                {muted ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 10v4h4l5 4V6L7 10H3z" fill="currentColor" />
                    <path
                      d="M16 9l5 5m0-5l-5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
            </>
          ) : isImage ? (
            <img
              src={post?.fileUrl}
              alt="post"
              className="modal-image"
              loading="lazy"
            />
          ) : (
            <div className="modal-image grid place-items-center text-sm text-white/70">
              Unsupported media
            </div>
          )}

          <div className="modal-details">
            <div className="head">
              <div className="user">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={post?.avatarUrl || defaultImage}
                    alt="avatar"
                    loading="lazy"
                    onClick={() => navigate(`/${userProfile?.username}`)}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="info">
                  <h3 onClick={() => navigate(`/${userProfile?.username}`)}>
                    {post?.username}
                  </h3>
                  <small>{post?.location}</small>
                </div>
              </div>

              <div className="timeAgo">
                <small>{timeAgo(post?.uploadedAt)}</small>
              </div>

              {userProfile?.userId === post?.userId && (
                <span className="edit transition transform active:scale-80 hover:scale-130">
                  <i>
                    <span
                      className="material-symbols-outlined"
                      onClick={() => setShowEdit(true)}
                    >
                      more_vert
                    </span>
                  </i>
                </span>
              )}
            </div>

            <div className="caption">
              <br />
              <p
                style={{ whiteSpace: "pre-line" }}
                dangerouslySetInnerHTML={{
                  __html: (post?.caption || "").replace(/,/g, ",<br />"),
                }}
              />
            </div>
          </div>
        </div>

        <button
          className="close-button transition transform active:scale-80 hover:scale-120"
          onClick={onClose}
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {showEdit && (
          <EditPost post={post} onClose={() => setShowEdit(false)} />
        )}
      </div>
    </>
  );
};

export default PostModal;
