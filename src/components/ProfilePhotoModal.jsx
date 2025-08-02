import { useRef } from "react";
import { ToastContainer } from "react-toastify";
import { showToastAlert, showToastSuccess } from "../popup/react-toats";
import { useProfileContext } from "../context/ProfileContext";
import api from "../services/appwrite";

const ProfilePhotoModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { userProfile, setUserProfile, userPosts } = useProfileContext();

  if (!isOpen) return null;
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const updateProfilePhoto = async (e) => {
    e.preventDefault();

    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      showToastAlert("Please select a valid image file.");
      return;
    }

    try {
      setLoading(true);

      const uploadedFile = await api.uploadImage(file);
      console.log("Uploaded File Response:", uploadedFile);

      if (!uploadedFile || !uploadedFile.$id) {
        showToastAlert("File upload failed.");
        return;
      }

      const fileUrl = await api.getFilePreview(uploadedFile.$id);
      const documentId = await api.getCurrentUserDocumentId();

      const updatedDoc = await api.updateAvatar({
        documentId,
        fileUrl,
      });

      if (updatedDoc) {
        const freshProfile = await api.getCurrentUser();
        setUserProfile({
          ...userProfile,
          avatarUrl: freshProfile.avatarUrl,
        });
        showToastSuccess("Profile photo updated!");
      } else {
        showToastAlert("Failed to update profile photo.");
      }
    } catch (error) {
      console.error("Error updating profile photo:", error);
      showToastAlert("Failed to update profile photo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={updateProfilePhoto}
      />

      <div className="modal-overlay" onClick={onClose}>
        <div
          className="profile-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <h3>Change or Remove Profile Photo</h3>
          <ul>
            <li onClick={() => updateProfilePhoto()}>Change Photo</li>
            <li>Remove Photo</li>
            <li className="cancel-button" onClick={onClose}>
              Cancel
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProfilePhotoModal;
