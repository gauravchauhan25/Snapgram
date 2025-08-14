import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useProfileContext } from "../context/ProfileContext";
import EditPost from "./EditPost";
import api from "../services/appwrite";
import { useState } from "react";

const PostModal = ({ post, onClose }) => {
  const [showEdit, setShowEdit] = useState(false);
  const { userProfile, setUserProfile, userPosts } = useProfileContext();
  const navigate = useNavigate();

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
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  };


  const defaultImage =
    "https://pathwayactivities.co.uk/wp-content/uploads/2016/04/Profile_avatar_placeholder_large-circle-300x300.png";

  return (
    <>
      <Toaster />

      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <img src={post?.fileUrl} alt="post" className="modal-image" />

          <div className="modal-details">
            <div className="head">
              <div className="user">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={post?.avatarUrl || defaultImage}
                    alt="avatar"
                    loading="lazy"
                    onClick={() => navigate(`/$(userProfile?.username)`)}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="ingo">
                  <h3 onClick={() => navigate(`/$(userProfile?.username)`)}>
                    {post?.username}
                  </h3>
                  <small>{post?.location}</small>
                </div>
              </div>

              <div className="timeAgo">
                <small>{timeAgo(post?.uploadedAt)}</small>
              </div>

              {userProfile.userId === post.userId && (
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
              {/* <b>{userProfile?.username} </b> */}
              <p
                style={{ whiteSpace: "pre-line" }}
                dangerouslySetInnerHTML={{
                  __html: (post?.caption || "").replace(/,/g, ",<br />"),
                }}
              ></p>
              <span className="harsh-tag">
                {(post?.hashtags || []).join("  ")}
              </span>
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
