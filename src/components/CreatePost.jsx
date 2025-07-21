import React, { useEffect, useState } from "react";
import { ID } from "appwrite";
import api from "../services/appwrite";
import "../page-styles/CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    document.title = "Create Post";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    api.getDocumentCount();
    setLoading(true);
    setError(null);
    setSuccess(false);
    api.uploadImage(file);

    try {
      const create = await api.createPost({ title, location, caption });
      if (create) {
        setCaption("");
        setLocation("");
        setSuccess(true);
      }
    } catch (err) {
      console.error("Error creating post:", err.message);
      setError(err.message);
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

        {error && <p className="error-message">{error}</p>}
        {success && (
          <p className="success-message">Post created successfully!</p>
        )}
        <button type="submit" className="create-post-btn" disabled={loading}>
          {loading ? "Submitting..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
