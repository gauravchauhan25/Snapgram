import React, { useEffect, useState } from "react";
import "../page-styles/CreatePost.css";
import { ToastContainer } from "react-toastify";
import api from "../services/appwrite";
import { useUserContext } from "../context/AuthContext";
import { showToastAlert, showToastSuccess } from "./ReactToasts";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const { setUserProfile } = useUserContext();

  useEffect(() => {
    document.title = "Create Post";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const currentUser = await api.getCurrentUser();
      const uploadedFile = await api.uploadPostImage(file);

      if (uploadedFile) {
        console.log("File uploaded successfully", uploadedFile);
      } else {
        console.log("Error while uploading!");
        return;
      }

      const fileUrl = await api.getFilePreview(uploadedFile.$id);
      console.log(fileUrl);

      const userId = currentUser.userId;

      const response = await api.createPost({
        userId,
        title,
        location,
        caption,
        fileUrl,
      });

      if (response) {
        const documentId = await api.getCurrentUserDocumentId();

        await api.updatePostCount({
          documentId,
          post: (currentUser.posts || 0) + 1,
        });

        setUserProfile((prev) => ({
          ...prev,
          posts: (prev.posts || 0) + 1,
        }));
        
        setTitle("");
        setCaption("");
        setTags("");
        setLocation("");
        setFile(null);
        document.getElementById("fileInput").value = "";

        showToastSuccess("Post Uploaded!");
      } else {
        console.log("Error :: creating post");
      }
    } catch (error) {
      console.log("Error creating post:", error);
      showToastAlert("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      console.log("Dropped file:", droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("Selected file:", selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <ToastContainer />
      <div className="create-post-container">
        <h1 className="title">Create a New Post</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="label">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location" className="label">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="caption" className="label">
              Caption
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="textarea"
              rows="5"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="location" className="label">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="caption" className="label">
              Upload Image
            </label>
            <div
              className="dropzone"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {file ? (
                <>
                  <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="image"
                      className="file_uploader-img"
                    />
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <h3 className="mb-2 mt-6">Drag photo here</h3>
                  <p className="mb-6">SVG, PNG, JPG</p>
                  <button
                    type="button"
                    className="create-post-btn"
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    Select from computer
                  </button>
                </div>
              )}
            </div>
          </div>

          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />

          <button type="submit" className="create-post-btn" disabled={loading}>
            {loading ? "Submitting..." : "Create Post"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
