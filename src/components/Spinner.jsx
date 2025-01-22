import React from "react";

export default function Spinner({ loading }) {
  return (
    loading && (
      <div className="spinner">
        <img
          src="https://media.tenor.com/hQz0Kl373E8AAAAi/loading-waiting.gif"
          alt="Loading..."
        />
      </div>
    )
  );
}
