import { useEffect, useState, useRef } from "react";
import { FaRegComment } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoIosHeartEmpty, IoMdShareAlt } from "react-icons/io";
import { FcLike } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import api from "../services/appwrite";
import Spinner from "../components/Spinner"

function Reels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const vidRef = useRef(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const navigate = useNavigate();
  const handleLike = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    const fetchReels = async () => {
      setLoading(true);
      try {
        const response = await api.getPostsOfAllUsers();

        // attach user info and filter only video/mp4
        const postsWithUserInfo = await Promise.all(
          response.map(async (post) => {
            const userResponse = await api.getUserById(post.userId);
            post.user = userResponse;
            return post;
          })
        );

        const onlyVideos = postsWithUserInfo.filter(
          (post) => post.mimeType === "video/mp4"
        );

        setReels(onlyVideos);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        nextReel();
      } else if (e.key === "ArrowUp") {
        prevReel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, reels]);

  // Swipe navigation
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      if (touchStartY - touchEndY > 50) {
        nextReel();
      } else if (touchEndY - touchStartY > 50) {
        prevReel();
      }
    };

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      if (!container) return;
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex, reels]);

  const nextReel = () => {
    setCurrentIndex((prev) => (prev + 1) % reels.length);
  };

  const prevReel = () => {
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length);
  };

  if (loading) return <Spinner loading={loading} />;

  if (!reels.length)
    return <div className="text-center">🙁Sorry! No Reel found.</div>;

  const defaultImage =
    "https://pathwayactivities.co.uk/wp-content/uploads/2016/04/Profile_avatar_placeholder_large-circle-300x300.png";

  return (
    <div
      ref={containerRef}
      className="flex justify-center items-center h-[calc(100vh-130px)] md:h-[calc(100vh-60px)] overflow-hidden"
    >
      <div
        className="relative w-full max-w-[450px] h-full"
        onClick={() => {
          const next = !muted;
          setMuted(next);
          if (vidRef.current) {
            vidRef.current.muted = next;
            if (!next) vidRef.current.volume = 1;
          }
        }}
      >
        {/* Video */}
        <video
          key={reels[currentIndex].$id}
          src={reels[currentIndex].fileUrl}
          ref={vidRef}
          muted={muted}
          autoPlay
          loop
          className="h-full w-full object-cover rounded-lg shadow-lg"
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
          className="muted-btn absolute bottom-25 right-3 z-20 rounded-full bg-black text-[#fff] text-lg p-2 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/40"
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

        {/* Top bar: avatar, username, 3 dots */}
        <div className="absolute top-0 left-0 w-full flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center space-x-4">
            <div className="h-11 w-11 rounded-full overflow-hidden cursor-pointer">
              <img
                src={reels[currentIndex].user?.avatarUrl || defaultImage}
                alt="Profile"
                className="h-full w-full object-cover"
                onClick={(e) => {
                  e.stopPropagation();
                  const u =
                    reels[currentIndex]?.user?.username ??
                    reels[currentIndex]?.username;

                  if (u) navigate(`/${u}`);
                }}
              />
            </div>
            <span
              className="font-semibold cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const u =
                  reels[currentIndex]?.user?.username ??
                  reels[currentIndex]?.username;

                if (u) navigate(`/${u}`);
              }}
            >
              {reels[currentIndex].user?.name}
              {reels[currentIndex].user?.uploadedAt}
            </span>
          </div>
          <button className="text-2xl transition transform active:scale-80 hover:scale-110 cursor-pointer">
            <HiOutlineDotsVertical />
          </button>
        </div>

        {/* Right-side action icons */}
        <div className="absolute right-3 bottom-40 flex flex-col items-center space-y-6">
          <button
            className="flex flex-col items-center"
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          >
            {isLiked ? (
              <FcLike className="text-3xl transition transform active:scale-80 hover:scale-110 cursor-pointer" />
            ) : (
              <IoIosHeartEmpty className="text-3xl transition transform active:scale-80 hover:scale-110 cursor-pointer" />
            )}
            <span className="text-xs">{likeCount || 0}</span>
          </button>

          <button className="flex flex-col items-center">
            <FaRegComment className="text-2xl transition transform active:scale-80 hover:scale-110 cursor-pointer" />
            <span className="text-xs">{reels[currentIndex].comments || 0}</span>
          </button>

          <button className="flex flex-col items-center">
            <IoMdShareAlt className="text-3xl transition transform active:scale-80 hover:scale-110 cursor-pointer" />
            <span className="text-xs">Share</span>
          </button>
        </div>

        {/* Bottom overlay: caption */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/100 to-transparent">
          <p className="text-sm line-clamp-4">{reels[currentIndex].caption}</p>
        </div>
      </div>
    </div>
  );
}

export default Reels;
