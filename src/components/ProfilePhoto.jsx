import React, { useState } from "react";
import { Client, Storage, Account, Databases } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67864fab003947d4618c");

export const account = new Account(client);
export const storage = new Storage(client);
export const databases = new Databases(client);

const ProfilePhoto = () => {
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the user's profile photo
  const fetchPhoto = async () => {
    try {
      const user = await account.get();
      const profilePhotoUrl = `https://cloud.appwrite.io/v1/storage/files/[FILE_ID]/view?project=67864fab003947d4618c`;
      setPhoto(profilePhotoUrl); // Replace [FILE_ID] with logic to retrieve the user's stored image ID.
    } catch (error) {
      console.error("Error fetching profile photo:", error);
    }
  };

  // Handle file upload
  const uploadPhoto = async (file) => {
    setIsLoading(true);
    try {
      const response = await storage.createFile(
        "[BUCKET_ID]", // Replace with your bucket ID
        "unique()", // File ID (auto-generated)
        file
      );
      console.log("Uploaded file:", response);
      // Update the user document or profile to associate the new file ID.
      setPhoto(
        `https://cloud.appwrite.io/v1/storage/files/${response.$id}/view`
      );
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle photo removal
  const removePhoto = async () => {
    setIsLoading(true);
    try {
      const fileId = "[CURRENT_FILE_ID]";
      await storage.deleteFile("[BUCKET_ID]", fileId);
      setPhoto(null);
      console.log("Photo removed successfully.");
    } catch (error) {
      console.error("Error removing photo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-photo-container">
      <h2>Profile Photo</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {photo ? (
            <div>
              <img src={photo} alt="Profile" className="profile-photo" />
              <button onClick={() => removePhoto()}>Remove</button>
              <label>
                Change
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadPhoto(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          ) : (
            <div>
              <p>No profile photo set.</p>
              <label>
                Add Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadPhoto(e.target.files[0])}
                />
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePhoto;
