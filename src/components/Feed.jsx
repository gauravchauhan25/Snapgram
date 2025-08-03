import { useNavigate } from "react-router-dom";
import { likedIcon, likeIcon, saveIcon } from "../assets/categories";

export default function Feed({ feedData }) {
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

  return (
    <div>
      <div className="fade-in">
        <div className="feed">
          <div className="head">
            <div className="user">
              <div className="profile-photo">
                <img
                  src={feedData.user.avatarUrl}
                  alt=""
                  loading="lazy"
                  onClick={() => navigate(`/${feedData.user.username}`)}
                />
              </div>

              <div className="info">
                <h3 onClick={() => navigate(`/${feedData.user.username}`)}>
                  {feedData.user.name}
                </h3>
                <small>{feedData.location}</small>
              </div>
            </div>

            <div>
              <div style={{ position: "relative", right: "1rem" }}>
                <small>{timeAgo(feedData?.uploadedAt)}</small>
              </div>
            </div>
          </div>

          <div className="caption">
            <p>
              <b onClick={() => navigate(`/${feedData.user.username}`)}>
                {feedData.user.username}{" "}
              </b>
              {feedData.caption}
            </p>
          </div>

          <div className="photo">
            <img src={feedData.fileUrl} alt="" />

            <div className="interaction-icons">
              {likeIcon.icon}
              {saveIcon.icon}
            </div>
          </div>

          <div className="action-button">
            <div className="interaction-buttons"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
