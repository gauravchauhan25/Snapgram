import { useNavigate } from "react-router-dom";

export default function SearchCard({ user }) {
  const defaultImage =
    "https://pathwayactivities.co.uk/wp-content/uploads/2016/04/Profile_avatar_placeholder_large-circle-300x300.png";

  const navigate = useNavigate();

  return (
    <div className="search-card">
      <img
        src={user.avatarUrl || defaultImage}
        alt="avatar"
        className="profile-photo"
        onClick={() => navigate(`/${user.username}`)}
      />
      
      <div className="user-info">
        <h3>{user.name}</h3>
        <p onClick={() => navigate(`/${user.username}`)}>@{user.username}</p>
      </div>
    </div>
  );
}
