import React from 'react'

//Main loading screen
export default function LoadingScreen() {
  return (
    <div className="center-container">
      <img
        src="https://cdn-icons-png.flaticon.com/128/185/185985.png"
        alt="Loading..."
        className="loading-spinner"
      />
    </div>
  );
}
