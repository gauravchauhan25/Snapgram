import { useEffect, useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useProfileContext } from "../context/ProfileContext";
import { useNavigate } from "react-router-dom";
import { likeIcon } from "../assets/categories";
import { Send } from "lucide-react";

import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
export default function ViewMyStoryModal({ isOpen, onClose, myStory }) {
  const { userProfile } = useProfileContext();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const vidRef = useRef(null);
  const [muted, setMuted] = useState(true);

  // Track current story index
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen) setCurrentIndex(0);
  }, [isOpen]);

  if (!isOpen || !myStory || myStory.length === 0) return null;

  const currentStory = myStory[currentIndex];
  const isVideo = currentStory?.mimeType?.startsWith("video/");
  const isImage = currentStory?.mimeType?.startsWith("image/");

  if (!isOpen || !myStory) return null;

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setProgress(0);
    }
  }, [isOpen]);

  // Auto-advance logic (single effect)
  useEffect(() => {
    if (!isOpen || !myStory) return;
    setProgress(0);

    let timeout;
    const vid = vidRef.current;

    if (isImage) {
      // run a timeout for 5s per image
      const duration = 5000;
      const step = 100; // update every 100ms
      let elapsed = 0;

      timeout = setInterval(() => {
        elapsed += step;
        setProgress((elapsed / duration) * 100);

        if (elapsed >= duration) {
          clearInterval(timeout);
          handleNext();
        }
      }, step);
    }

    if (isVideo && vid) {
      const handleTimeUpdate = () => {
        if (!vid.duration) return;
        setProgress((vid.currentTime / vid.duration) * 100);
      };

      const handleEnded = () => {
        handleNext();
      };

      vid.addEventListener("timeupdate", handleTimeUpdate);
      vid.addEventListener("ended", handleEnded);

      return () => {
        vid.removeEventListener("timeupdate", handleTimeUpdate);
        vid.removeEventListener("ended", handleEnded);
      };
    }

    return () => clearInterval(timeout);
  }, [currentIndex, myStory, isOpen]);

  const handleNext = () => {
    if (currentIndex < myStory.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const timeAgo = (timestamp) => {
    if (!timestamp) return "";
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
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 transition transform active:scale-90 hover:scale-110 cursor-pointer"
        aria-label="Close"
      >
        <IoCloseSharp size={30} />
      </button>

      {/* Story Container */}
      <div
        className="relative z-[101] h-screen md:h-[95vh] w-screen md:max-w-[420px] flex flex-col overflow-hidden bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bars */}
        <div className="absolute top-0 left-0 w-full flex gap-1 px-2 pt-2">
          {myStory.map((_, idx) => (
            <div key={idx} className="flex-1 h-1 bg-gray-600 rounded">
              <div
                className="h-full bg-[#4a1f84] transition-all duration-100 ease-linear"
                style={{
                  width:
                    idx === currentIndex
                      ? `${progress}%`
                      : idx < currentIndex
                      ? "100%"
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <header className="flex items-center justify-between mx-5 mt-6 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={currentStory?.avatarUrl || "/default-avatar.png"}
                alt="avatar"
                loading="lazy"
                onClick={() => navigate(`/${currentStory?.username}`)}
                className="w-full h-full object-cover cursor-pointer"
              />
            </div>
            <div>
              <h3
                className="text-sm font-semibold cursor-pointer"
                onClick={() => navigate(`/${currentStory?.username}`)}
              >
                {currentStory?.name}
              </h3>
              <p className="text-xs text-gray-400">
                {timeAgo(currentStory?.createdAt)}
              </p>
            </div>
          </div>
          {isVideo && (
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              className="rounded-full bg-black/70 p-1 cursor-pointer"
              aria-label={muted ? "Unmute video" : "Mute video"}
            >
              {muted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
            </button>
          )}
        </header>

        {/* Story Content */}
        <section className="relative flex-1 flex items-center justify-center overflow-hidden">
          {isVideo ? (
            <video
              src={currentStory.fileUrl}
              ref={vidRef}
              muted={muted}
              className="h-full w-full object-contain"
              autoPlay
              playsInline
            />
          ) : isImage ? (
            <img
              src={currentStory.fileUrl}
              alt="feed"
              className="max-h-full max-w-full object-contain"
              loading="lazy"
            />
          ) : null}

          {/* Navigation Buttons */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full"
            >
              ◀
            </button>
          )}
          {currentIndex < myStory.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full"
            >
              ▶
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
