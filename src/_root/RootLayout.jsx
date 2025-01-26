import React, { useState } from "react";
import { Outlet, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Right from "../components/Right";
import Home from "./Home";

export default function RootLayout() {
  const [selectedCategory, setSelectedCategory] = useState("Home");

  return (
    <>
      {/* <Navbar /> */}
      <main>
        <div
          className="container"
          style={
            selectedCategory === "Messages"
              ? { display: "grid", gridTemplateColumns: "5vw auto auto" }
              : {}
          }
        >
          <div className="left">
            <Sidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>

          <div className="middle">
            <Outlet />
          </div>

          <div className="right">
            <Routes>
              <Route path="/" element={<Right />}></Route>
              <Route path="/Home" element={<Right />}></Route>
            </Routes>
          </div>
        </div>
      </main>
    </>
  );
}
