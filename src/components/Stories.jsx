import { useEffect, useRef, useState } from "react";
import { useProfileContext } from "../context/ProfileContext";
import { useStoryContext } from "../context/StoryContext";
import AddStory from "../pages/AddStory";
import AddStoryModal from "./AddStoryModal";
import { FaPlus } from "react-icons/fa6";

export default function Stories() {
  const { userProfile } = useProfileContext();
  const { userStory } = useStoryContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  const storyContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const storyContainer = storyContainerRef.current;

    const updateButtonVisibility = () => {
      setCanScrollLeft(storyContainer.scrollLeft > 0);
      setCanScrollRight(
        storyContainer.scrollLeft + storyContainer.clientWidth <
          storyContainer.scrollWidth
      );
    };

    updateButtonVisibility();

    storyContainer.addEventListener("scroll", updateButtonVisibility);

    return () => {
      storyContainer.removeEventListener("scroll", updateButtonVisibility);
    };
  }, []);

  const scrollLeft = () => {
    storyContainerRef.current.scrollBy({
      left: -200,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    storyContainerRef.current.scrollBy({
      left: 200,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div
        className="stories"
        ref={storyContainerRef}
        style={{ overflowX: "auto", whiteSpace: "nowrap" }}
      >
        {canScrollLeft && (
          <button
            id="scroll-left"
            onClick={scrollLeft}
            className="scroll-button left"
          >
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </button>
        )}

        <div className="story">
          <div className="profile-photo">
            <img
              src={userProfile?.avatarUrl}
              alt=""
              loading="lazy"

              onClick={() => {
                setIsStoryOpen(true);
              }}
            />
            <button
              onClick={() => setIsStoryOpen(true)}
              className="absolute bottom-2 right-2 bg-gradient-to-r from-[#4a1f84] to-[#4a1f84] 
              w-6 h-6 flex items-center justify-center rounded-full text-[#fff] 
              border-2 border-white shadow-md hover:scale-110 transition cursor-pointer"
            >
              <FaPlus size={14} />
            </button>
          </div>
          <p className="story-name">Your Story</p>
        </div>

        {/* Loop for creating multiple stories */}
        {userStory.map((story) => (
          <div className="story" key={story.$id}>
            <div className="profile-photo">
              <img
                src={story?.avatarUrl}
                loading="lazy"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              />
            </div>
            <p className="story-name">{story?.name}</p>
          </div>
        ))}

        {canScrollRight && (
          <button
            id="scroll-right"
            onClick={scrollRight}
            className="scroll-button right"
          >
            <span className="material-symbols-outlined">arrow_forward_ios</span>
          </button>
        )}
      </div>

      {isStoryOpen && (
        <AddStory isOpen={isStoryOpen} onClose={() => setIsStoryOpen(false)} />
      )}

      {isModalOpen && (
        <AddStoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
