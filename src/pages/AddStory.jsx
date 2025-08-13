import { useEffect, useState } from "react";
import api from "../services/appwrite";
import toast, { Toaster } from "react-hot-toast";

function AddStory() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Add Story";
  }, []);

  const handleStory = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      
    } catch (error) {
      console.log("Error handling story: ", error);
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
      <Toaster />

      <div>
        <input
          type="file"
          id="fileInput"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
      </div>
    </>
  );
}

export default AddStory;
