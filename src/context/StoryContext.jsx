import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/appwrite";

const StoryContext = createContext();

export const StoryProvider = ({ children }) => {
  const [userStory, setUserStory] = useState([]);

  useEffect(() => {
    const fetchUserStory = async () => {
      try {
        const fetchedStory = await api.fetchUserStory();

        if (fetchedStory) {
          setUserStory(fetchUserStory);
        }
      } catch (error) {
        console.log("Error fetching user stories: ", error);
      }
    };
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
