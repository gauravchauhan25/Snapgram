import { useNavigate } from "react-router-dom";
import { likedIcon, likeIcon, saveIcon } from "../assets/categories";
import { useEffect, useRef, useState } from "react";

export default function Feed({ feedData }) {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(true);
  const vidRef = useRef(null);

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

  const isVideo = feedData.mimeType?.startsWith("video/");
  const isImage = feedData.mimeType?.startsWith("image/");

  useEffect(() => {
    if (!vidRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          vidRef.current.play().catch(() => {});
        } else {
          vidRef.current.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(vidRef.current);

    return () => observer.disconnect();
  }, [feedData.fileUrl]); // re-run if new video

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

          {isVideo ? (
            <div className="relative inline-block">
              {" "}
              {/* <-- add relative */}
              <video
                src={feedData.fileUrl}
                ref={vidRef}
                muted={muted}
                className="photo"
                autoPlay
                loop
                playsInline
                // controls not included -> hidden
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
                className="muted-btn absolute bottom-5 right-5 z-20 rounded-full bg-black text-[#fff] text-lg p-2 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/40"
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
            <img
              src={feedData.fileUrl}
              alt="feed"
              className="photo"
              loading="lazy"
            />
          ) : null}

          <div className="interaction-icons ">
            <div className="transition transform active:scale-80 hover:scale-110 cursor-pointer">
              {likeIcon.icon}
            </div>

            <div className="transition transform active:scale-80 hover:scale-110 cursor-pointer">
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
