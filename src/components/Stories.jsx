import { useEffect, useRef, useState } from 'react';
import { useProfileContext } from '../context/ProfileContext';
import { useStoryContext } from '../context/StoryContext';
import AddStory from '../pages/AddStory';
import ViewStoryModal from './ViewStoryModal';
import { FaPlus } from 'react-icons/fa6';
import ViewMyStoryModal from './ViewMyStoryModal';
import api from '../services/appwrite';

export default function Stories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isMyStoryOpen, setIsMyStoryOpen] = useState(false);
  const [activeStory, setActiveStory] = useState(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { userProfile } = useProfileContext();
  const { userStory, isStory, myStory } = useStoryContext();

  const storyContainerRef = useRef(null);

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

    storyContainer.addEventListener('scroll', updateButtonVisibility);

    return () => {
      storyContainer.removeEventListener('scroll', updateButtonVisibility);
    };
  }, []);

  // useEffect(() => {
  //   const checkMyStory = async () => {
  //     try {
  //       const story = await api.checkMyStory();

  //       if (story) {
  //         setMyStory(story.documents);

  //         if (story.documents.length  > 0) {
  //           setIsStory(true);
  //         } else {
  //           setIsStory(false);
  //         }
  //       }
  //     } catch (error) {
  //       console.log("Error finding my story: ", error);
  //     }
  //   };

  //   checkMyStory();
  // }, []);

  // useEffect(() => {
  //   console.log(myStory);
  // }, [myStory]);

  const scrollLeft = () => {
    storyContainerRef.current.scrollBy({
      left: -200,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    storyContainerRef.current.scrollBy({
      left: 200,
      behavior: 'smooth',
    });
  };

  const defaultImage =
    'https://pathwayactivities.co.uk/wp-content/uploads/2016/04/Profile_avatar_placeholder_large-circle-300x300.png';

  return (
    <>
      <div
        className="stories"
        ref={storyContainerRef}
        style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
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

        <div className="story transition-transform duration-500 ease-out active:scale-85 hover:scale-102">
          <div className={`profile-photo ${isStory ? 'has-story' : ''}`}>
            <img
              src={userProfile?.avatarUrl || defaultImage}
              alt="mystory"
              loading="lazy"
              onClick={() => {
                if (isStory) setIsMyStoryOpen(true);
              }}
            />
            <button
              onClick={() => setIsStoryOpen(true)}
              className="absolute bottom-3 right-2 bg-gradient-to-r from-[#4a1f84] to-[#4a1f84] 
      w-6 h-6 flex items-center justify-center rounded-full text-[#fff] 
      border-2 border-white shadow-md hover:scale-110 transition cursor-pointer"
            >
              <FaPlus size={14} />
            </button>
          </div>
          <p className="story-name">Your Story</p>
        </div>

        {/* Loop for creating multiple stories */}
        {userStory.map((user) => (
          <div
            className="story transition-transform duration-500 ease-out active:scale-85 hover:scale-102"
            key={user.userId}
          >
            <div className="profile-photo has-story">
              <img
                src={user?.avatarUrl || defaultImage}
                loading="lazy"
                onClick={() => {
                  setActiveStory(user);
                  setIsModalOpen(true);
                }}
                alt={user?.name || 'story'}
              />
            </div>
            <p className="story-name w-22 truncate">{user?.name}</p>
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

      {isMyStoryOpen && (
        <ViewMyStoryModal
          isOpen={isMyStoryOpen}
          onClose={() => setIsMyStoryOpen(false)}
          myStory={myStory}
        />
      )}

      {isModalOpen && activeStory && (
        <ViewStoryModal
          isOpen={isModalOpen}
          stories={activeStory.stories || []} // passing array of stories
          user={activeStory}
          onClose={() => {
            setIsModalOpen(false);
            setActiveStory(null);
          }}
        />
      )}
    </>
  );
}
