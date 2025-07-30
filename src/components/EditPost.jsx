import { useUserContext } from "../context/AuthContext";
import api from "../services/appwrite";
import { ToastContainer } from "react-toastify";
import { showToastAlert, showToastSuccess } from "./ReactToasts";

const EditPost = ({ post, onClose }) => {
  const { userProfile, setUserProfile } = useUserContext();

  return (
    <>
      <ToastContainer />
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <p>Hello world</p>
        </div>

        <button className="close-button" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </>
  );
};

export default EditPost;
