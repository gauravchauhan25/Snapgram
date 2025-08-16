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

export default function AddStoryModal({ isOpen, onClose }) {
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

        <section
          className="relative mb-0 flex-1 overflow-auto ring-1 ring-white/5 flex items-center justify-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        ></section>
      </div>
    </div>
  );
}
