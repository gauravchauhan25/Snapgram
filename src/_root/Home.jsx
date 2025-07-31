import { useEffect, useState } from "react";
import Feed from "../components/Feed";
import Stories from "../components/Stories";
import api from "../services/appwrite";

export default function Home() {
  const [allUserPosts, setAllUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Home";

    const fetchPostsOfUsers = async () => {
      setLoading(true);

      try {
        const response = await api.getPostsOfAllUsers();

        const postsWithUserInfo = await Promise.all(
          response.map(async (post) => {
            const userResponse = await api.getUserById(post.userId);
            post.user = userResponse; 
            return post;
          })
        );

        setAllUserPosts(postsWithUserInfo);  // Set the posts with user info
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsOfUsers();
  }, []);

  return (
    <div className="middle">
      <Stories />

      <div className="feeds">
        {allUserPosts.map((feed) => (
          <Feed key={feed.$id} feedData={feed} loading={loading} />
        ))}
      </div>
    </div>
  );
}
