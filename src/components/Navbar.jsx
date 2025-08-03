import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {settingsIcon} from "../assets/categories"; 

function Navbar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

          <div className={` ${isMobile ? "none" : "category"}`}>
            <Link to="/Settings" className="menu-item">
              <span>
                {settingsIcon.icon}
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
