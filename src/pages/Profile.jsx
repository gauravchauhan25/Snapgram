import React, { useEffect, useRef, useState } from 'react';
import '../page-styles/Profile.css';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/appwrite';
import toast from 'react-hot-toast';
import Post from '../components/Posts';
import PostModal from '../components/PostModal';
import { useProfileContext } from '../context/ProfileContext';
import { useStoryContext } from '../context/StoryContext';

const Profile = () => {
  const { userProfile, setUserProfile, userPosts, setUserPosts } =
    useProfileContext();

  const { setUserStory } = useStoryContext();

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [selectedPost, setSelectedPost] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  useEffect(() => {
    if (userProfile?.username) {
      document.title = `${userProfile.name} • Snapgram`;
    }
  }, [userProfile]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const updateProfilePhoto = async (e) => {
    e.preventDefault();

    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }

    try {
      const uploadedFile = await api.uploadFile(file);
      console.log('Uploaded File Response:', uploadedFile);

      if (!uploadedFile?.$id) {
        toast.error('File upload failed.');
        return;
      }

      const fileUrl = await api.getFilePreview(uploadedFile.$id);
      const documentId = await api.getCurrentUserDocumentId();

      // Run updates in parallel
      const [updatedInUsers, updatedInPosts, updatedInStories] =
        await Promise.all([
          api.updateAvatar({ documentId, fileUrl }),
          api.updateAvatarInPosts(fileUrl),
          api.updateAvatarInStory(fileUrl),
        ]);

      if (!updatedInUsers && !updatedInPosts && !updatedInStories) {
        toast.error('Failed to update profile photo.');
        return;
      }

      // ✅ Update states locally (no need to re-fetch)
      toast.success('Profile photo updated!');
      setUserProfile((prev) => ({ ...prev, avatarUrl: fileUrl }));

      setUserPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.userId === documentId ? { ...post, avatarUrl: fileUrl } : post
        )
      );
    } catch (error) {
      console.error('Error updating profile photo:', error);
      toast.error('Failed to update profile photo.');
    } finally {
      setLoading(false);
    }
  };

  const defaultImage =
    'https://pathwayactivities.co.uk/wp-content/uploads/2016/04/Profile_avatar_placeholder_large-circle-300x300.png';

  if (location.pathname === '/Profile/edit-profile') {
    return <Outlet />;
  }

  return (
    <>
      <div className="fade-in">
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={updateProfilePhoto}
        />

        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-picture">
              <img
                src={userProfile?.avatarUrl || defaultImage}
                alt="Profile"
                onClick={handleImageClick}
                className="transition transform active:scale-90 hover:scale-105 cursor-pointer"
              />
            </div>
            <div className="profile-info">
              <div className="edit-profile">
                <div className="user-info">
                  <h4>{userProfile?.name}</h4>
                  <h5>@{userProfile?.username}</h5>
                </div>

                <button
                  className="edit-profile-btn transition transform active:scale-90 hover:scale-105"
                  onClick={() => navigate('edit-profile')}
                >
                  Edit Profile
                </button>
              </div>

              <div className="profile-description large-device">
                <p
                  style={{ whiteSpace: 'pre-line' }}
                  dangerouslySetInnerHTML={{
                    __html: (userProfile?.bio || '').replace(/,/g, ',<br />'),
                  }}
                ></p>

                <div className="follower-info">
                  <span>
                    <strong>{userProfile?.posts}</strong> Posts
                  </span>
                  <span>
                    <strong>{userProfile?.followers}</strong> Followers
                  </span>
                  <span>
                    <strong>{userProfile?.following}</strong> Following
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-description small-device">
            <p
              style={{ whiteSpace: 'pre-line' }}
              dangerouslySetInnerHTML={{
                __html: (userProfile?.bio || '').replace(/,/g, ',<br />'),
              }}
            ></p>

            <div className="follower-info">
              <span>
                <strong>{userProfile?.posts}</strong> Posts
              </span>
              <span>
                <strong>{userProfile?.followers}</strong> Followers
              </span>
              <span>
                <strong>{userProfile?.following}</strong> Following
              </span>
            </div>
          </div>
        </div>

        <div className="posts post-grid">
          {userPosts.map((post) => (
            <Post key={post.$id} post={post} onPostClick={openModal} />
          ))}

          {selectedPost && (
            <PostModal post={selectedPost} onClose={closeModal} />
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
