import { useAuthContext } from "../context/AuthContext";

const EditPost = ({ post, onClose }) => {
  const { userProfile, setUserProfile } = useAuthContext();

  return (
    <>
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
