import React, { useEffect, useState } from "react";
import { ID } from "appwrite";
import auth from "../services/auth";
import "../page-styles/CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [location, setlocation] = useState("");
  const [caption, setcaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = "Create Post";
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Replace with your database ID and collection ID
      const databaseID = "your_database_id";
      const collectionID = "your_collection_id";

      const newPost = await auth.database.createDocument(
        databaseID,
        collectionID,
        ID.unique(),
        {
          title,
          caption,
          author: "current_user_id_or_name", // Replace or fetch dynamically
        }
      );

      console.log("Post created successfully:", newPost);
      setTitle("");
      setcaption("");
      setSuccess(true);
    } catch (err) {
      console.error("Error creating post:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
 const [file, setFile] = useState(null);

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
            onChange={(e) => setlocation(e.target.value)}
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
            onChange={(e) => setcaption(e.target.value)}
            className="textarea"
            rows="5"
            required
          ></textarea>
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
                <p className="file-name">{file.name}</p>
              ) : (
                <div className="plus-sign">Drag and Drop here!</div>
              )}
            </div>
        </div>

        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden-input"
        />

        
        {error && <p className="error-message">{error}</p>}
        {success && (
          <p className="success-message">Post created successfully!</p>
        )}
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Submitting..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
