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
  Image as ImageIcon,
} from "lucide-react";
import api from "../services/appwrite";
import toast, { Toaster } from "react-hot-toast";
import { useProfileContext } from "../context/ProfileContext";

export default function AddStory({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userProfile } = useProfileContext?.() || { userProfile: null };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  // Generate local preview URL
  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );
  const isVideo = !!file && file.type?.startsWith("video");
  const isImage = !!file && file.type?.startsWith("image");

  // Upload story
  const handleStory = async (e) => {
    e.preventDefault?.();

    if (!file) return toast.error("Please select a photo or video first.");

    const mimeType = file?.type;

    try {
      setLoading(true);
      const uploadedFile = await api.uploadFile(file);
      if (!uploadedFile) {
        toast.error("Upload failed. Try a different file.");
        return;
      }

      const fileUrl = await api.getFilePreview(uploadedFile.$id);
      const add = await api.addStory(
        userProfile?.userId,
        userProfile?.name,
        userProfile?.username,
        userProfile?.avatarUrl || defaultImage,
        fileUrl,
        uploadedFile.$id,
        mimeType
      );

      if (add) {
        toast.success("Story posted");
        setFile(null);
        onClose?.();
      }
    } catch (error) {
      console.error("Error handling story:", error);
      toast.error("Something went wrong while posting!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const defaultImage =
    "https://pathwayactivities.co.uk/wp-content/uploads/2016/04/Profile_avatar_placeholder_large-circle-300x300.png";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <Toaster />
      <div className="absolute inset-0 bg-neutral-900 md:bg-black" />

      <div
        className="relative z-[101] mx-3 flex h-screen md:h-[95vh]  w-screen md:max-w-[520px] flex-col overflow-hidden md:rounded-2xl bg-neutral-900 shadow-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-3 py-1">
          <button
            onClick={onClose}
            className="transition transform active:scale-90 hover:scale-105 cursor-pointer inline-flex h-10 w-10 my-2 mx-2 items-center justify-center rounded-full hover:bg-[#fff]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 hover:cursor-pointer"
            aria-label="Close"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <nav className="flex items-center gap-5 md:gap-8 my-2 md:my-5 md:ml-20 ml-6">
            <IconBubble>
              <Circle className="h-5 w-5 hover:cursor-pointer" />
            </IconBubble>
            <IconBubble>
              <Users className="h-5 w-5 hover:cursor-pointer" />
            </IconBubble>
            <IconBubble>
              <Type className="h-5 w-5 hover:cursor-pointer" />
            </IconBubble>
            <IconBubble>
              <Sticker className="h-5 w-5 hover:cursor-pointer" />
            </IconBubble>
            <IconBubble>
              <Music className="h-5 w-5 hover:cursor-pointer" />
            </IconBubble>
            <IconBubble>
              <MoreHorizontal className="h-5 w-5 hover:cursor-pointer" />
            </IconBubble>
          </nav>

          <div className="h-10 w-10" />
        </header>

        <section
          className="relative mb-0 flex-1 overflow-auto ring-1 ring-white/5 flex items-center justify-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {previewUrl ? (
            isVideo ? (
              <video
                src={previewUrl}
                className="max-h-full max-w-full object-contain"
                playsInline
                autoPlay
                loop
              />
            ) : (
              <img
                src={previewUrl}
                alt="preview"
                className="max-h-full max-w-full object-contain"
              />
            )
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-900">
              <div className="grid justify-center place-items-center h-16 w-16 rounded-full bg-white/10 my-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="97"
                  height="77"
                  viewBox="0 0 97 77"
                  fill="none"
                >
                  <path
                    d="M17.0168 24.0902H17.3119C20.066 23.8934 22.1316 21.5328 22.0332 18.7787C21.8365 16.0246 19.4759 13.959 16.7218 14.0574C13.9677 14.1557 11.9021 16.6147 12.0004 19.3688C12.0988 22.0246 14.3611 24.0902 17.0168 24.0902ZM14.6562 17.0082C15.148 16.418 15.9349 16.0246 16.7218 16.0246H16.9185C18.5906 16.0246 19.9677 17.4016 19.9677 19.0738C19.9677 20.7459 18.5906 22.1229 16.9185 22.1229C15.2463 22.1229 13.8693 20.7459 13.8693 19.0738C13.8693 18.2869 14.1644 17.5984 14.6562 17.0082Z"
                    fill="currentColor"
                  />
                  <path
                    d="M84.2961 18.582L58.0338 17.1066L57.8371 14.1557C57.542 8.54918 52.7223 4.22131 47.0174 4.51639L13.6731 6.38524C8.06656 6.68032 3.73869 11.5984 4.03377 17.2049L5.90262 50.6475V51.4344C6.59115 56.5492 10.919 60.3852 16.0338 60.3852H16.6239L37.9682 59.2049V59.7951C37.6731 65.4016 41.9026 70.3197 47.6075 70.6148L81.0502 72.582H81.6403C87.0502 72.582 91.5748 68.3525 91.8698 62.9426L93.8371 29.5C94.2305 23.7951 89.9026 18.9754 84.2961 18.582ZM8.06656 11.1066C9.54197 9.43442 11.6075 8.45082 13.7715 8.35245L47.2141 6.4836C51.7387 6.18852 55.6731 9.7295 55.9682 14.2541L56.1649 17.0082L50.9518 16.7131C45.3452 16.418 40.4272 20.6475 40.1321 26.3525L39.542 35.6967L30.1977 46.2213C30.001 46.5164 29.6075 46.6148 29.2141 46.7131C28.8207 46.7131 28.5256 46.6148 28.2305 46.3197L20.5584 39.4344C19.1813 38.1557 17.1157 38.3525 15.837 39.7295L7.86983 48.6803L6.09934 17.2049C5.90262 14.9426 6.68951 12.7787 8.06656 11.1066ZM16.6239 58.3197C12.3944 58.5164 8.65672 55.5656 7.96819 51.3361L17.2141 41.0082C17.4108 40.7131 17.8043 40.6148 18.1977 40.5164C18.5911 40.5164 18.8862 40.6148 19.1813 40.9098L26.8534 47.7951C27.542 48.3852 28.4272 48.6803 29.3125 48.6803C30.1977 48.6803 30.9846 48.1885 31.5748 47.5984L39.2469 38.9426L38.1649 57.2377L16.6239 58.3197ZM91.8698 29.3033L89.9026 62.7459C89.6075 67.2705 85.6731 70.8115 81.1485 70.5164L47.7059 68.5492C43.1813 68.2541 39.6403 64.3197 39.9354 59.7951L41.9026 26.3525C42.1977 22.0246 45.7387 18.582 50.1649 18.582H50.6567L84.0993 20.5492C88.7223 20.8443 92.1649 24.7787 91.8698 29.3033Z"
                    fill="currentColor"
                  />
                  <path
                    d="M77.9027 41.4016L61.2797 30.4836C59.2141 29.1066 56.46 29.6967 55.1813 31.7623C54.7879 32.4508 54.4928 33.1393 54.4928 33.9262L53.3125 53.6967C53.2141 56.1557 54.9846 58.2213 57.4436 58.418H57.7387C58.4273 58.418 59.1158 58.2213 59.7059 57.9262L77.4109 49.0738C79.5748 47.9918 80.46 45.3361 79.3781 43.1721C78.9846 42.4836 78.4928 41.8934 77.9027 41.4016ZM76.5256 47.3033L58.8207 56.1557C58.4273 56.3525 58.0338 56.4508 57.542 56.4508C57.1486 56.4508 56.6568 56.2541 56.3617 56.0574C55.6732 55.5656 55.1814 54.7787 55.2797 53.8934L56.46 34.123C56.5584 33.2377 57.0502 32.4508 57.8371 32.0574C58.624 31.6639 59.5092 31.7623 60.2961 32.1557L76.7223 43.0738C77.9027 43.8607 78.1977 45.3361 77.4109 46.418C77.2141 46.8115 76.9191 47.1066 76.5256 47.3033Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <p className="text-sm">Drag & drop a photo/video</p>
              <label className="cursor-pointer rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition transform active:scale-85 hover:scale-110">
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                Choose file
              </label>
            </div>
          )}
        </section>

        {/* Footer for sharing */}
        <footer className="p-1 flex items-center gap-3 my-3 mx-3">
          <PillButton
            className="transition transform active:scale-90 hover:scale-105 cursor-pointer"
            onClick={handleStory}
          >
            <div className="flex items-center gap-2 add-to-story">
              <div className="h-6 w-6 rounded-full overflow-hidden">
                <img
                  src={userProfile?.avatarUrl || defaultImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <span>Add to Your story</span>
            </div>
          </PillButton>

          <button
            onClick={handleStory}
            disabled={!file || loading}
            className="transition transform active:scale-90 hover:scale-105 ml-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#fff] text-black hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer"
            aria-label="Share"
          >
            {loading ? (
              <svg
                className="h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" opacity=".25" />
                <path d="M22 12a10 10 0 0 1-10 10" strokeWidth="2" />
              </svg>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </footer>

        <input
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
}

function IconBubble({ children }) {
  return (
    <button
      type="button"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff]/5 hover:bg-[#fff]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
    >
      {children}
    </button>
  );
}

function PillButton({ children, className = "" }) {
  return (
    <button
      type="button"
      className={
        "inline-flex items-center rounded-3xl bg-[#fff]/10 p-1 text-sm hover:bg-[#fff]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 " +
        className
      }
    >
      {children}
    </button>
  );
}
