import React , {useEffect} from "react";
import "../App.css";
import Feed from "../components/Feed";
import Stories from "../components/Stories";

export default function Home() {
  useEffect(() => {
    document.title = "Home";
  }, []);

  return (
    <>
      <div className="middle">
        <Stories />
        <Feed />
      </div>
    </>
  );
}
