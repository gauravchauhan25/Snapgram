import { useEffect, useState, useRef } from "react";
import api from "../services/appwrite";
import { FaHeart } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Spinner from "../components/Spinner";

function Reels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  // Fetch reels from backend API
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

        // ✅ filter only videos
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
        nextReel(); // swipe up
      } else if (touchEndY - touchStartY > 50) {
        prevReel(); // swipe down
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

  if (loading)
    return <Spinner loading={loading} />;
  if (!reels.length)
    return <div className="text-center text-white">🙁Sorry! No Reel found.</div>;

  return (
    <div
      ref={containerRef}
      className="flex justify-center items-center h-[calc(100vh-60px)] bg-black text-[#fff] overflow-hidden"
    >
      <div className="relative w-full max-w-sm h-full">
        {/* Video */}
        <video
          key={reels[currentIndex].$id}
          src={reels[currentIndex].fileUrl}
          autoPlay
          loop
          muted
          className="h-full w-full object-cover rounded-lg shadow-lg"
        />

        {/* Top bar: avatar, username, 3 dots */}
        <div className="absolute top-0 left-0 w-full flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center space-x-4">
            <img
              src={reels[currentIndex].user?.avatarUrl || "/default-avatar.png"}
              alt="avatar"
              className="w-10 h-10 rounded-full border"
            />
            <span className="font-semibold text-[#fff]">
              {reels[currentIndex].user?.name}
            </span>
          </div>
          <button className="text-[#fff] text-2xl transition transform active:scale-80 hover:scale-110 cursor-pointer">
            <HiOutlineDotsVertical />
          </button>
        </div>

        {/* Right-side action icons */}
        <div className="absolute right-3 bottom-20 flex flex-col items-center space-y-6 text-[#fff]">
          <button className="flex flex-col items-center">
            <FaHeart className="text-3xl transition transform active:scale-80 hover:scale-110 cursor-pointer" />
            <span className="text-xs">{reels[currentIndex].likes || 0}</span>
          </button>
          <button className="flex flex-col items-center">
            <FaRegCommentDots className="text-3xl transition transform active:scale-80 hover:scale-110 cursor-pointer" />
            <span className="text-xs">{reels[currentIndex].comments || 0}</span>
          </button>
          <button className="flex flex-col items-center">
            <FaShare className="text-3xl transition transform active:scale-80 hover:scale-110 cursor-pointer" />
            <span className="text-xs">Share</span>
          </button>
        </div>

        {/* Bottom overlay: caption */}
        <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/100 to-transparent text-[#fff]">
          {/* <h3 className="font-semibold text-xl">{reels[currentIndex].user?.name}</h3> */}
          <p className="text-sm line-clamp-3">{reels[currentIndex].caption}</p>
        </div>
      </div>
    </div>
  );
}

export default Reels;
