import React, { useEffect, useRef, useState } from "react";
import { stories } from "../assets/constants";

export default function Stories() {
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

        {/* Loop for creating multiple stories */}
        {stories.map((story) => (
          <div className="story" key={story.id}>
            <div className="profile-photo">
              <img src={story.imageUrl} alt="storyImg" loading="lazy" />
            </div>
            <p className="name">{story.name}</p>
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
    </>
  );
}
