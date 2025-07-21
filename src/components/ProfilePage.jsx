import React from "react";
import ProfileCard from "../components/ProfileCard";
import useUserProfile from "../hooks/useUserProfile";
import { useParams } from "react-router-dom";
import api from "../services/appwrite";

const ProfilePage = () => {
  const { userId } = useParams();
  const { user, loading } = api.useUserProfile(userId);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found.</p>;

  return <ProfileCard user={user} />;
};

export default ProfilePage;
