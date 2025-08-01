import { use, useEffect, useState } from "react";
import Feed from "../components/Feed";
import Stories from "../components/Stories";
import { useUsersContext } from "../context/UsersContext";

export default function Home() {
  const { allUserPosts, loading } = useUsersContext();

  useEffect(() => {
    document.title = "Home";
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
