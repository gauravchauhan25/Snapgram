import { useState } from "react";
import "../page-styles/CreatePost.css";
import toast from "react-hot-toast";
import api from "../services/appwrite";
import { useProfileContext } from "../context/ProfileContext";
import { deleteIcon, editIcon } from "../assets/categories";
import { useNavigate } from "react-router-dom";

const EditPost = ({ post, onClose, onSubmit }) => {
  const [newLocation, setNewLocation] = useState(post?.location || "");
  const [newCaption, setNewCaption] = useState(post?.caption || "");

  const navigate = useNavigate();

  const { setUserProfile, setUserPosts } = useProfileContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const documentId = post.$id;
      const editPost = await api.editPost(documentId, newLocation, newCaption);

      if (editPost) {
        setUserPosts((prevPosts) =>
          prevPosts.map((post) => ({
            ...post,
            location: newLocation,
            caption: newCaption,
          }))
        );
        toast.success("Post Updated!");
      } else {
        toast.error("Error updating post!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.log("Error updating post: ", error);
    }
    onClose();
  };

  const deletePost = async (postsDocId) => {
    try {
      const currentUser = await api.getCurrentUser();
      const del = await api.deletePost(postsDocId);
      const documentId = await api.getCurrentUserDocumentId();

      if (del) {
        await api.updatePostCount({
          documentId,
          post: (currentUser.posts || 0) - 1,
        });

        setUserProfile((prev) => ({
          ...prev,
          posts: (prev.posts || 0) - 1,
        }));

        setUserPosts((prevPosts) => prevPosts.filter((post) => post.id !== postsDocId));

        toast.success("Post Deleted");
        onClose?.();
        navigate("/Profile")

        await api.deleteFile(post.fileId);
      } else {
        toast.error("Error deleting Post!");
      }
      return;
    } catch (error) {
      console.log("Error",error);
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
