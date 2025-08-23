import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useProfileContext } from "../context/ProfileContext";
import { useNavigate } from "react-router-dom";

export default function ViewStoryModal({ isOpen, onClose, story }) {
  const [loading, setLoading] = useState(false);
  const { userProfile } = useProfileContext();

  const navigate = useNavigate();

  const vidRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const isVideo = story?.mimeType?.startsWith("video/");
  const isImage = story?.mimeType?.startsWith("image/");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-neutral-900 md:bg-black" />

      <button
        onClick={onClose}
        className="absolute top-4 right-8 p-2 transition transform active:scale-80 hover:scale-110 cursor-pointer"
        aria-label="Close"
      >
        <IoCloseSharp size={36} />
      </button>

      <div
        className="relative z-[101] mx-3 flex h-screen md:h-[95vh] w-screen md:max-w-[520px] flex-col overflow-hidden md:rounded-2xl bg-neutral-900 text-[#fff] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between">
          <div className=" mx-10 mt-5">
            <div className="flex gap-5 items-center justify-center">
              <div className="w-11 h-11 rounded-full overflow-hidden">
                <img
                  src={story?.avatarUrl || defaultImage}
                  alt="avatar"
                  loading="lazy"
                  onClick={() => navigate(`/${story?.username}`)}
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>

              <div className="cursor-pointer">
                <h3 className="text-[0.9rem] font-semibold">{story?.name}</h3>
                <p
                  className="text-[0.8rem] text-[#9D95AE]"
                  onClick={() => navigate(`/${story?.username}`)}
                >
                  @{story?.username}
                </p>
              </div>
            </div>
          </div>

          <div className="h-10 w-10" />
        </header>

        <section className="relative mb-0 flex-1 overflow-y-hidden flex items-center justify-center">
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
                className="post-muted-btn absolute bottom-4 right-3 z-20 rounded-full bg-black text-[#fff] text-lg p-2 hover:bg-black/70"
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
