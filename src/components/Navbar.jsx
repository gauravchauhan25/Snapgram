import React, { useState } from "react";

function Navbar() {
  const [isLightTheme, setIsLightTheme] = useState(false);

  const handleThemeToggle = () => {
    setIsLightTheme(!isLightTheme);
    document.body.classList.toggle("light-theme-variables");
    document.body.style.transition = "all 500ms ease";
  };

  return (
    <>
      <nav>
        <div className="container">
          <div className="logo">
            <img
              src="https://cdn-icons-png.flaticon.com/128/185/185985.png"
              alt=""
            />
            <h2>Snapgram</h2>
          </div>

          <div className="theme-toggler" onClick={handleThemeToggle}>
            <span
              className={`material-icons-sharp ${isLightTheme ? "active" : ""}`}
            >
              <i className="fa-solid fa-sun"></i>
            </span>

            <span
              className={`material-icons-sharp ${isLightTheme ? "" : "active"}`}
            >
              <i className="fa-solid fa-moon"></i>
            </span>
          </div>

          <div className="create">
            <div className="profile-photo">
              <img src="" alt="" />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
