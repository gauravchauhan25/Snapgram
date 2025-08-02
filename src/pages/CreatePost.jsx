import { useEffect, useState } from "react";
import "../page-styles/CreatePost.css";
import api from "../services/appwrite";
import { ToastContainer } from "react-toastify";
import { useProfileContext } from "../context/ProfileContext";
import { showToastAlert, showToastSuccess } from "../popup/react-toats";
import { createIcon } from "../assets/categories";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const { setUserProfile } = useProfileContext();

  useEffect(() => {
    document.title = "Create Post";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (location.length > 30) {
      showToastAlert("Location must be less than 30 characters.");
      return;
    }
    if (!file) {
      showToastAlert("Please select an image to upload.");
      return;
    }

    try {
      setLoading(true);

      const currentUser = await api.getCurrentUser();
      const uploadedFile = await api.uploadPostImage(file);

      if (uploadedFile) {
        console.log("File uploaded successfully", uploadedFile);
      } else {
        showToastAlert("File Not Supported!");
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

        showToastSuccess("Post Uploaded!");
        setTitle("");
        setCaption("");
        setLocation("");
        setFile(null);
        document.getElementById("fileInput").value = "";
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
      <div className="edit-container">
        <h1 className="title">{createIcon.icon} Create a New Post</h1>

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
                  <div className="drag-drop-container">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="image"
                      className="file_uploader-img"
                    />
                  </div>
                </>
              ) : (
                <div className="file_uploader-box">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="97"
                    height="77"
                    viewBox="0 0 97 77"
                    fill="none"
                  >
                    <path
                      d="M17.0168 24.0902H17.3119C20.066 23.8934 22.1316 21.5328 22.0332 18.7787C21.8365 16.0246 19.4759 13.959 16.7218 14.0574C13.9677 14.1557 11.9021 16.6147 12.0004 19.3688C12.0988 22.0246 14.3611 24.0902 17.0168 24.0902ZM14.6562 17.0082C15.148 16.418 15.9349 16.0246 16.7218 16.0246H16.9185C18.5906 16.0246 19.9677 17.4016 19.9677 19.0738C19.9677 20.7459 18.5906 22.1229 16.9185 22.1229C15.2463 22.1229 13.8693 20.7459 13.8693 19.0738C13.8693 18.2869 14.1644 17.5984 14.6562 17.0082Z"
                      fill="currentColor"
                    />
                    <path
                      d="M84.2961 18.582L58.0338 17.1066L57.8371 14.1557C57.542 8.54918 52.7223 4.22131 47.0174 4.51639L13.6731 6.38524C8.06656 6.68032 3.73869 11.5984 4.03377 17.2049L5.90262 50.6475V51.4344C6.59115 56.5492 10.919 60.3852 16.0338 60.3852H16.6239L37.9682 59.2049V59.7951C37.6731 65.4016 41.9026 70.3197 47.6075 70.6148L81.0502 72.582H81.6403C87.0502 72.582 91.5748 68.3525 91.8698 62.9426L93.8371 29.5C94.2305 23.7951 89.9026 18.9754 84.2961 18.582ZM8.06656 11.1066C9.54197 9.43442 11.6075 8.45082 13.7715 8.35245L47.2141 6.4836C51.7387 6.18852 55.6731 9.7295 55.9682 14.2541L56.1649 17.0082L50.9518 16.7131C45.3452 16.418 40.4272 20.6475 40.1321 26.3525L39.542 35.6967L30.1977 46.2213C30.001 46.5164 29.6075 46.6148 29.2141 46.7131C28.8207 46.7131 28.5256 46.6148 28.2305 46.3197L20.5584 39.4344C19.1813 38.1557 17.1157 38.3525 15.837 39.7295L7.86983 48.6803L6.09934 17.2049C5.90262 14.9426 6.68951 12.7787 8.06656 11.1066ZM16.6239 58.3197C12.3944 58.5164 8.65672 55.5656 7.96819 51.3361L17.2141 41.0082C17.4108 40.7131 17.8043 40.6148 18.1977 40.5164C18.5911 40.5164 18.8862 40.6148 19.1813 40.9098L26.8534 47.7951C27.542 48.3852 28.4272 48.6803 29.3125 48.6803C30.1977 48.6803 30.9846 48.1885 31.5748 47.5984L39.2469 38.9426L38.1649 57.2377L16.6239 58.3197ZM91.8698 29.3033L89.9026 62.7459C89.6075 67.2705 85.6731 70.8115 81.1485 70.5164L47.7059 68.5492C43.1813 68.2541 39.6403 64.3197 39.9354 59.7951L41.9026 26.3525C42.1977 22.0246 45.7387 18.582 50.1649 18.582H50.6567L84.0993 20.5492C88.7223 20.8443 92.1649 24.7787 91.8698 29.3033Z"
                      fill="currentColor"
                    />
                    <path
                      d="M77.9027 41.4016L61.2797 30.4836C59.2141 29.1066 56.46 29.6967 55.1813 31.7623C54.7879 32.4508 54.4928 33.1393 54.4928 33.9262L53.3125 53.6967C53.2141 56.1557 54.9846 58.2213 57.4436 58.418H57.7387C58.4273 58.418 59.1158 58.2213 59.7059 57.9262L77.4109 49.0738C79.5748 47.9918 80.46 45.3361 79.3781 43.1721C78.9846 42.4836 78.4928 41.8934 77.9027 41.4016ZM76.5256 47.3033L58.8207 56.1557C58.4273 56.3525 58.0338 56.4508 57.542 56.4508C57.1486 56.4508 56.6568 56.2541 56.3617 56.0574C55.6732 55.5656 55.1814 54.7787 55.2797 53.8934L56.46 34.123C56.5584 33.2377 57.0502 32.4508 57.8371 32.0574C58.624 31.6639 59.5092 31.7623 60.2961 32.1557L76.7223 43.0738C77.9027 43.8607 78.1977 45.3361 77.4109 46.418C77.2141 46.8115 76.9191 47.1066 76.5256 47.3033Z"
                      fill="currentColor"
                    />
                  </svg>

                  <h3 className="drag-drop-text">
                    Drag photo here
                    <p>SVG, PNG, JPG</p>

                    <span
                      className="choose-file"
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    >
                      or Choose your file
                    </span>
                  </h3>
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

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Create Post"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
