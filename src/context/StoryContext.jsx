import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/appwrite";
import { useAuthContext } from "./AuthContext";

const StoryContext = createContext();

export const StoryProvider = ({ children }) => {
  const [userStory, setUserStory] = useState([]);
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

    if (isAuthenticated) {
      checkUserStory();
    } else {
      setUserStory([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    console.log(userStory);
  }, []);

  return (
    <StoryContext.Provider
      value={{
        userStory,
        setUserStory,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStoryContext = () => useContext(StoryContext);
