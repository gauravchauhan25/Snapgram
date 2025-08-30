import { useRef, useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useProfileContext } from "../context/ProfileContext";
import { useNavigate } from "react-router-dom";
import { likedIcon, likeIcon } from "../assets/categories";
import { Send } from "lucide-react";
import { FaPause, FaPlay } from "react-icons/fa";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

export default function ViewStoryModal({ isOpen, onClose, stories, user }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(true);
  
  const navigate = useNavigate();
  const vidRef = useRef(null);
  const { userProfile } = useProfileContext();
  
  const story = stories[currentIndex];
  const isVideo = story?.mimeType?.startsWith("video/");
  const isImage = story?.mimeType?.startsWith("image/");
  
  
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

  useEffect(() => {
    if (isVideo && vidRef.current) {
      const videoElement = vidRef.current;

      const handleTimeUpdate = () => {
        const current = videoElement.currentTime;
        const duration = videoElement.duration;
        setProgress((current / duration) * 100);

        // auto close at the end
        if (current >= duration) {
          onClose();
        }
      };

      videoElement.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [isVideo, story, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    setProgress(0);

    if (isImage) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            onClose();
            return 100;
          }
          return p + 100 / 100;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isOpen, currentIndex, stories.length, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 transition transform active:scale-90 hover:scale-110 cursor-pointer"
        aria-label="Close"
      >
        <IoCloseSharp size={30} />
      </button>

      {/* ---------------- STORY CONTAINER ---------------- */}
      <div
        className="relative z-[101] h-screen md:h-[95vh] w-screen md:max-w-[420px] flex flex-col overflow-hidden bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---------------- PROGRESS BAR ---------------- */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#7a7878]">
          <div
            className="h-full bg-[#4a1f84] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* ---------------- HEADER ---------------- */}
        <header className="flex items-center justify-between mx-5 my-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={story?.avatarUrl || "/default-avatar.png"}
                alt="avatar"
                loading="lazy"
                onClick={() => navigate(`/${story?.username}`)}
                className="w-full h-full object-cover cursor-pointer"
              />
            </div>

            <div>
              <h3
                className="text-sm font-semibold cursor-pointer"
                onClick={() => navigate(`/${story?.username}`)}
              >
                {story?.name}
              </h3>
              <p className="text-xs text-gray-400">
                {timeAgo(story.createdAt)}
              </p>
            </div>
          </div>

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
            className="absolute top-6 right-8 z-20 rounded-full bg-black/70 text-sm p-1 cursor-pointer"
            aria-label={muted ? "Unmute video" : "Mute video"}
            aria-pressed={!muted}
          >
            {muted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
          </button>

          <button
            type="button"
            onClick={() => {
              if (vidRef.current) {
                if (vidRef.current.paused) {
                  vidRef.current.play();
                } else {
                  vidRef.current.pause();
                }
              }
            }}
            className="absolute top-6 right-20 z-20 rounded-full bg-black/70 text-sm p-1 cursor-pointer"
            aria-label={vidRef.current?.paused ? "Play video" : "Pause video"}
          >
            {vidRef.current?.paused ? (
              <FaPlay size={15} />
            ) : (
              <FaPause size={15} />
            )}
          </button>
        </header>

        {/* ---------------- STORY CONTENT ---------------- */}
        <section className="relative flex-1 flex items-center justify-center overflow-hidden">
          {isVideo ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                src={story.fileUrl}
                ref={vidRef}
                muted={muted}
                className="h-full w-full object-contain"
                autoPlay
                playsInline
              />
              {/* Mute/Unmute */}
            </div>
          ) : isImage ? (
            <img
              src={story.fileUrl}
              alt="feed"
              className="h-full w-full object-contain"
              loading="lazy"
            />
          ) : null}
        </section>

        {/* ---------------- FOOTER ---------------- */}
        <footer className="flex items-center justify-between mx-5 my-5">
          <input
            type="text"
            placeholder={`Reply to ${story?.name}...`}
            className="flex-1 border-1 border-white rounded-sm px-4 py-2 text-sm outline-none mr-3"
          />
          <div className="flex gap-4">
            <button className="text-lg transition transform active:scale-90 hover:scale-110 cursor-pointer">
              {likeIcon.icon}
            </button>
            <button className="text-lg">
              <Send className="h-5 w-5 transition transform active:scale-85 hover:scale-110 cursor-pointer" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
