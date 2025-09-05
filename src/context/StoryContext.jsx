import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/appwrite";
import { useAuthContext } from "./AuthContext";

const StoryContext = createContext();

export const StoryProvider = ({ children }) => {
  const [userStory, setUserStory] = useState([]);
  const [isStory, setIsStory] = useState(false);
  const [myStory, setMyStory] = useState([]);
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    const checkUserStory = async () => {
      try {
        const fetchedStory = await api.fetchUserStory();

        const grouped = fetchedStory.reduce((acc, story) => {
          if (!acc[story.username]) {
            acc[story.username] = {
              userId: story.userId,
              username: story.username,
              name: story.name,
              avatarUrl: story.avatarUrl,
              stories: [],
            };
          }
          acc[story.username].stories.push(story);
          return acc;
        }, {});

        setUserStory(Object.values(grouped));
      } catch (error) {
        console.log("Error fetching user stories: ", error);
      }
    };

    const checkMyStory = async () => {
      try {
        const story = await api.checkMyStory();

        if (story) {
          setMyStory(story.documents);

          if (story.documents.length  > 0) {
            setIsStory(true);
          } else {
            setIsStory(false);
          }
        }
      } catch (error) {
        console.log("Error finding my story: ", error);
      }
    };

    if (isAuthenticated) {
      checkMyStory();
      checkUserStory();
    } else {
      setUserStory([]);
    }
  }, [isAuthenticated]);

  return (
    <StoryContext.Provider
      value={{
        userStory,
        setUserStory,
        myStory,
        setMyStory,
        isStory,
        setIsStory,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStoryContext = () => useContext(StoryContext);
