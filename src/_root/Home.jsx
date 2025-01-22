import React from "react";
import "../App.css";
import Feed from "../components/Feed";
import Stories from "../components/Stories";

export default function Home() {
  return (
    <>
      <div className="middle">
        <Stories />
        <Feed />
      </div>
    </>
  );
}
