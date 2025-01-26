import React, { useState, useEffect } from "react";

const Post = ({ posts, onPostClick }) => {
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="post-grid">
      {posts.map((post) => (
        <div
          className={`post-card ${isDisabled ? "disabled" : ""}`}
          key={post.id}
          onClick={() => !isDisabled && onPostClick(post)}
        >
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

          <img
            src={post.imageUrl}
            alt={`Post ${post.id}`}
            className="post-image"
          />

          <div className="post-overlay">
            <span className="post-likes">❤️ {post.likeCount}</span>
          </div>

          <div className="post-details">
            <div className="action-button">
              <div className="interaction-buttons">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="transparent"
                    style={{
                      color: "var(--color-dark)",
                      fontSize: "1.4rem",
                    }}
                  >
                    <path
                      d="M16.5 3C19.5376 3 22 5.5 22 9C22 16 14.5 20 12 21.5C9.5 20 2 16 2 9C2 5.5 4.5 3 7.5 3C9.35997 3 11 4 12 5C13 4 14.64 3 16.5 3Z"
                      stroke="var(--color-dark)"
                    ></path>
                  </svg>
                </span>

                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="24"
                    fill="currentColor"
                    class="bi bi-chat"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
                  </svg>
                </span>

                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="transparent"
                  >
                    <path
                      d="M1.94619 9.31543C1.42365 9.14125 1.41953 8.86022 1.95694 8.68108L21.0431 2.31901C21.5716 2.14285 21.8747 2.43866 21.7266 2.95694L16.2734 22.0432C16.1224 22.5716 15.8178 22.59 15.5945 22.0876L12 14L18 6.00005L10 12L1.94619 9.31543Z"
                      stroke="rgb(230, 230, 230)"
                    ></path>
                  </svg>
                </span>
              </div>

              <div className="bookmark">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                    fill="transparent"
                  >
                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="liked-by">
              <span>
                <img src={post.likedBy1Profile} alt="" />
              </span>
              <span>
                <img src={post.likedBy2Profile} alt="" />
              </span>
              <span>
                <img src={post.likedBy3Profile} alt="" />
              </span>
              <p>
                Liked by <b> {post.likedBy} </b> and{" "}
                <b>{post.likeCount} others</b>
              </p>
            </div>

            <div className="caption">
              <p>
                <b>{post.username} </b>
                {post.caption}
                <span className="harsh-tag">{post.hashtags.join("  ")}</span>
              </p>
            </div>
            <div className="comments text-muted">
              <a href="#">View all {post.commentCount} comments</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Post;
