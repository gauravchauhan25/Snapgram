import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Circle,
  Users,
  Type,
  Sticker,
  Music,
  MoreHorizontal,
  Send,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import api from "../services/appwrite";
import toast, { Toaster } from "react-hot-toast";
import { useProfileContext } from "../context/ProfileContext";
import { useStoryContext } from "../context/StoryContext";

export default function ViewStory({ isOpen, story, onClose }) {
  const [loading, setLoading] = useState(false);
  const { userProfile } = useProfileContext?.() || { userProfile: null };
  const { userStory } = useStoryContext(); //Fetch user story

    const vidRef = useRef(null);
    const [muted, setMuted] = useState(true);
  
  const isVideo = !!file && file.type?.startsWith("video");
  const isImage = !!file && file.type?.startsWith("image");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && isOpen) onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <Toaster position="top-center" />
      <div className="absolute inset-0 bg-neutral-900 md:bg-black" />

      <div
        className="relative z-[101] mx-3 flex h-screen md:h-[95vh]  w-screen md:max-w-[520px] flex-col overflow-hidden md:rounded-2xl bg-neutral-900 text-[#fff] shadow-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-3 py-3">
          <button
            onClick={onClose}
            className="inline-flex h-10 w-10 my-2 mx-2 items-center justify-center rounded-full hover:bg-[#fff]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 hover:cursor-pointer"
            aria-label="Close"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="h-10 w-10" />
        </header>

        <section className="relative mb-0 flex-1 overflow-auto ring-1 ring-white/5 flex items-center justify-center">
        
          {isVideo ? (
            <div className="relative inline-block">
              <video
                src={story.fileUrl}
                ref={vidRef}
                muted={muted}
                className="photo"
                autoPlay
                loop
                playsInline
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
                className="post-muted-btn absolute bottom-4 right-3 z-20 rounded-full bg-black text-[#fff] text-lg p-2 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/40"
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
              src={story.fileUrl}
              alt="feed"
              className="photo"
              loading="lazy"
            />
          ) : null}
        </section>
      </div>
    </div>
  );
}
