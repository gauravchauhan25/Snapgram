import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
            <Link to="/Notification" className="menu-item">
              <span>
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    fill="currentColor"
                    class="bi bi-bell"
                    viewBox="0 0 20 20"
                    style={{
                      fill: "var(--color-dark)",
                    }}
                  >
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                  </svg>
                </i>
              </span>
            </Link>

            <Link to="/Messages" className="menu-item">
              <span>
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    class="bi bi-messenger"
                    width="25"
                    height="30"
                    viewBox="0 0 20 20"
                    style={{
                      fill: "var(--color-dark)",
                    }}
                  >
                    <path d="M0 7.76C0 3.301 3.493 0 8 0s8 3.301 8 7.76-3.493 7.76-8 7.76c-.81 0-1.586-.107-2.316-.307a.64.64 0 0 0-.427.03l-1.588.702a.64.64 0 0 1-.898-.566l-.044-1.423a.64.64 0 0 0-.215-.456C.956 12.108 0 10.092 0 7.76m5.546-1.459-2.35 3.728c-.225.358.214.761.551.506l2.525-1.916a.48.48 0 0 1 .578-.002l1.869 1.402a1.2 1.2 0 0 0 1.735-.32l2.35-3.728c.226-.358-.214-.761-.551-.506L9.728 7.381a.48.48 0 0 1-.578.002L7.281 5.98a1.2 1.2 0 0 0-1.735.32z" />
                  </svg>
                </i>
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
