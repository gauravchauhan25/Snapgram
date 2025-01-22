import React, { useState } from "react";
import CommentBox from "./CommentBox";

const PostModal = ({ post, onClose }) => {
  const [comments, setComments] = useState([
    { username: "user1", text: "Great post!" },
    { username: "user2", text: "Amazing!" },
  ]);

  const handleAddComment = (commentText) => {
    setComments([...comments, { username: "you", text: commentText }]);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={post.imageUrl} alt="Post" className="modal-image" />

        <div className="modal-details">
          <div className="head">
            <div className="user">
              <div className="profile-photo">
                <img src={post.imgProfileUrl} alt="" loading="lazy" />
              </div>
              <div className="ingo">
                <h3>{post.username}</h3>
                <small>{post.location}</small>
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
              <b>{post.username} </b>
              {post.caption}
              <span className="harsh-tag">{post.hashtags.join("  ")}</span>
            </p>
          </div>

          <div style={{ position: "absolute", bottom: "1.5rem" }}>
            <CommentBox
              post={post}
              comments={comments}
              onAddComment={handleAddComment}
            />
          </div>
        </div>
      </div>
      <button className="close-button" onClick={onClose}>
        X
      </button>
    </div>
  );
};

export default PostModal;
