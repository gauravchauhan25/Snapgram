import { useEffect, useState } from "react";
import { database } from "../appwrite";

const useUserProfile = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const response = await database.getDocument(
          "6787eaef00269d8615ae",
          "679a66480030b6502b44",
          userId
        );
        setUser(response);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading };
};

export default useUserProfile;
