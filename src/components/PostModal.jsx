import React from "react";
import { useUserContext } from "../context/AuthContext";

const PostModal = ({ post, onClose }) => {
  const { userProfile } = useUserContext();

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

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={post?.fileUrl} alt="post" className="modal-image" />

        <div className="modal-details">
          <div className="head">
            <div className="user">
              <div className="profile-photo">
                <img src={userProfile?.avatarUrl} alt="avatar" loading="lazy" />
              </div>

              <div className="ingo">
                <h3>{userProfile?.username}</h3>
                <small>{post?.location}</small>
              </div>
            </div>

            <div className="timeAgo">
              <small>{timeAgo(post?.uploadedAt)}</small>
            </div>

            <span className="edit">
              <i>
                <span className="material-symbols-outlined">more_vert</span>
              </i>
            </span>
          </div>

          <div className="caption">
            <p>
              <b>{userProfile?.username} </b>
              {post?.caption}
              <span className="harsh-tag">
                {(post?.hashtags || []).join("  ")}
              </span>
            </p>
          </div>
        </div>
      </div>

      <button className="close-button" onClick={onClose}>
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
  );
};

export default PostModal;
