import { useState } from 'react';
import '../page-styles/CreatePost.css';
import toast from 'react-hot-toast';
import api from '../services/appwrite';
import { useProfileContext } from '../context/ProfileContext';
import { deleteIcon, editIcon } from '../assets/categories';
import { useNavigate } from 'react-router-dom';

const EditPost = ({ post, onClose, onSubmit }) => {
  const [newLocation, setNewLocation] = useState(post?.location || '');
  const [newCaption, setNewCaption] = useState(post?.caption || '');

  const navigate = useNavigate();

  const { setUserProfile, setUserPosts } = useProfileContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const editPost = await api.editPost(post.$id, newLocation, newCaption);

      if (!editPost) {
        toast.error('Error updating post!');
        return;
      }

      setUserPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.$id === post.$id
            ? { ...p, location: newLocation, caption: newCaption }
            : p
        )
      );

      toast.success('Post Updated!');
      onClose?.();
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Something went wrong!');
    }
  };

  const deletePost = async (postsDocId, fileId) => {
    try {
      const del = await api.deletePost(postsDocId);

      if (!del) {
        toast.error('Error deleting Post!');
        return;
      }

      setUserPosts((prev) => prev.filter((p) => p.$id !== postsDocId));
      setUserProfile((prev) => ({
        ...prev,
        posts: Math.max((prev.posts || 1) - 1, 0),
      }));

      toast.success('Post Deleted');
      onClose?.();
      navigate('/Profile');

      api
        .deleteFile(fileId)
        .catch((err) =>
          console.error('Failed to delete file from storage:', err)
        );

      // Update DB post count
      const documentId = await api.getCurrentUserDocumentId();
      await api.updatePostCount({
        documentId,
        post: (await api.getCurrentUser()).posts - 1,
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Something went wrong!');
    }
  };

  return (
    <>
      <div className="editpost-backdrop" onClick={onClose}>
        <div className="editpost-content" onClick={(e) => e.stopPropagation()}>
          <button
            className="editpost-close-button transition transform active:scale-80 hover:scale-120"
            onClick={() => deletePost(post.$id)}
          >
            {deleteIcon.icon}
          </button>

          <h2 className="flex items-center gap-2 text-2xl font-semibold mb-10">
            {editIcon.icon} Edit Post
          </h2>

          <form onSubmit={handleSubmit} className="editpost-form">
            <label htmlFor="location" className="text-sm">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Enter new location"
              className="input"
              required
            />

            <label htmlFor="caption" className="text-sm">
              Caption
            </label>
            <textarea
              id="caption"
              rows="3"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              className="input"
              placeholder="Enter new caption"
              required
            ></textarea>

            {/* Buttons */}
            <div className="editpost-buttons">
              <button
                type="button"
                className="cancel-btn transition transform active:scale-90 hover:scale-105"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-btn transition transform active:scale-90 hover:scale-105"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditPost;
