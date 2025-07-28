import React, { useState, useEffect } from "react";
import { feeds } from "../assets/constants";
import Spinner from "./Spinner";

export default function Feed() {
  // const [isLiked, setIsLiked] = useState(false);
  // const [isBookmark, setIsBookmark] = useState(false);

  // const likedToggle = () => {
  //   setIsLiked(!isLiked);
  // };

  // const bookmarkToggle = () => {
  //   setIsBookmark(!isBookmark);
  // };

  const [feedList, setFeedList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const feedsPerPage = 4;

  // Load the initial feeds
  useEffect(() => {
    loadMoreFeeds();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load more feeds
  useEffect(() => {
    if (page > 1) loadMoreFeeds();
  }, [page]);

  // Function to load more feeds
  const loadMoreFeeds = () => {
    setLoading(true);

    setTimeout(() => {
      const newFeeds = feeds.slice(
        (page - 1) * feedsPerPage,
        page * feedsPerPage
      );
      setFeedList((prevFeeds) => [...prevFeeds, ...newFeeds]);
      setLoading(false);
    }, 500);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight
    ) {
      if (!loading) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  return (
    <div>
      <div className="feeds">
        {feedList.map((feed) => (
          <div className="feed" key={feed.id}>
            <div className="head">
              <div className="user">
                <div className="profile-photo">
                  <img src={feed.imgProfileUrl} alt="" loading="lazy" />
                </div>
                <div className="ingo">
                  <h3>{feed.username}</h3>
                  <small>{feed.location}</small>
                </div>
              </div>
              <span className="edit">
                <i>
                  <span className="material-symbols-outlined">more_vert</span>
                </i>
              </span>
            </div>

            <div className="caption">
              <p>
                <b>{feed.username} </b>
                {feed.caption}
                <span className="harsh-tag">{feed.hashtags.join("  ")}</span>
              </p>
            </div>

            <div className="photo">
              <img src={feed.imageUrl} alt="" />
            </div>

            <div className="action-button">
              <div className="interaction-buttons"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Spinner */}
      <Spinner loading={loading} />
    </div>
  );
}
