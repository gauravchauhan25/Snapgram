import {
  Client,
  Account,
  Databases,
  ID,
  Query,
  Avatars,
  Storage,
} from "appwrite";
import config from "./config.js";

export class Services {
  client = new Client();
  account;
  databases;
  storage;
  avatars;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectID);

    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
    this.avatars = new Avatars(this.client);
  }

  //================CREATES A ACCOUNT FOR USER=================
  async createAccount({ email, password, name, username, phoneNumber }) {
    try {
      const newAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (!newAccount) {
        return null;
      }
      const userId = newAccount.$id;
      const newUser = await this.addUser(
        userId,
        name,
        email,
        username,
        phoneNumber
      );

      return newUser;
    } catch (error) {
      console.log("Account creation failed: ", error);
      return null;
    }
  }

  //===========ADD USER TO DB=============
  async addUser(userId, name, email, username, phoneNumber) {
    try {
      const response = await this.databases.createDocument(
        config.appwriteDatabaseID,
        config.appwriteUsersCollectionID,
        ID.unique(),
        {
          userId: userId,
          username,
          name,
          email,
          phoneNumber,
          accountCreatedAt: new Date().toISOString(),
        }
      );

      console.log("Added to DB successfully!");
      return response;
    } catch (error) {
      console.error("Error :: adding user: !", JSON.stringify(error, null, 2));
      return null;
    }
  }

  //============LOGIN FOR USER===================
  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.log("Error :: Logging In", error);
    }
  }

  //=============FOR GOOGLE OAUTH LOGIN====================
  async loginWithGoogle() {
    try {
      this.account.createOAuth2Session(
        "google",
        "https://snapgram-private.vercel.app/Home",
        "https://snapgram-private.vercel.app/sign-in"
      );
    } catch (error) {
      console.error("Error :: Google Login:", error);
    }
  }

  //===========LOGOUTS THE USER===============
  async logout() {
    try {
      return await this.account.deleteSessions("current");
    } catch (error) {
      console.log("Error :: logout", error);
    }
  }

  //=======GETS THE CURRENT ACCOUNT SESSION IF PRESENT==========
  async getAccount() {
    try {
      return await this.account.get();
    } catch (error) {
      console.error("Error fetching account:", error);
    }
    return null;
  }

  //=============GET THE DATA OF THE CURRENT USER ACCOUNT=====================
  async getCurrentUser() {
    try {
      const currentAccount = await this.getAccount();
      if (!currentAccount) return null;

      const currentUser = await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwriteUsersCollectionID,
        [Query.equal("userId", currentAccount.$id)]
      );

      if (!currentUser || currentUser.documents.length === 0) return null;

      return currentUser.documents[0];
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  }
  async searchUsersByUsername(username) {
    try {
      return await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwriteUsersCollectionID,
        [Query.startsWith("username", username)]
      );
    } catch (error) {
      console.log("Error searching users by username:", error);
      return { documents: [] }; // Return an empty array if there's an error
    }
  }
  //==============CHANGES THE PASSWORD FOR CURRENT USER==================
  async changePassword({ email, currPassword, newPassword }) {
    try {
      const response = await this.account.updatePassword(
        newPassword,
        currPassword
      );
      if (!response) {
        return null;
      }

      return response;
    } catch (error) {
      console.log("Error updating password::", error);
    }
  }

  //==========GET THE DOCUMENT COUNT OF CURRENT USER===============
  async getCurrentUserDocumentId() {
    try {
      const currentUser = await this.account.get();
      const userId = currentUser.$id;

      const response = await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwriteUsersCollectionID,
        [Query.equal("userId", userId)]
      );

      if (response.documents.length === 0) {
        throw new Error("No matching user document found.");
      }

      return response.documents[0].$id;
    } catch (error) {
      console.error("Error fetching user document ID:", error);
      return null;
    }
  }

  //==============EDIT CURRENT USER PROFILE=================
  async updateProfile({ documentId, name, username, bio }) {
    try {
      const response = await this.databases.updateDocument(
        config.appwriteDatabaseID,
        config.appwriteUsersCollectionID,
        documentId,
        {
          name: name,
          username: username,
          bio: bio,
        }
      );
      return response;
    } catch (error) {
      console.log("Error updating document: ", error);
    }
  }

  //=============UPDATE POST COUNT==========================
  async updatePostCount({ documentId, post }) {
    try {
      const response = await this.databases.updateDocument(
        config.appwriteDatabaseID,
        config.appwriteUsersCollectionID,
        documentId,
        {
          posts: post,
        }
      );
      return response;
    } catch (error) {
      console.log("Error updating post Count: ", error);
    }
  }

  //================GETS ALL THE POSTS OF CURRENT LOGGED IN USER===========
  async getPostsOfUser() {
    try {
      const currentUser = await this.account.get();
      const userId = currentUser.$id;

      const response = await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwritePostsCollectionID,
        [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
      );

      if (response.documents.length === 0) {
        throw new Error("No matching user posts found.");
      }

      return response.documents || [];
    } catch (error) {
      console.log("Error while getting document", error);
      return [];
    }
  }

  //=======GET THE POSTS OF ALL THE USERS IN THE DB AND SHOW THEM IN THE FEED=====
  async getPostsOfAllUsers() {
    try {
      const response = await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwritePostsCollectionID,
        [Query.orderDesc("$createdAt")]
      );

      if (response.documents.length === 0) {
        throw new Error("No matching posts found.");
      }

      return response.documents || [];
    } catch (error) {
      console.log("Error while getting document", error);
      return [];
    }
  }

  async getUserById(userId) {
    try {
      const response = await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwriteUsersCollectionID,
        [Query.equal("userId", userId)]
      );

      if (response.documents.length > 0) {
        return response.documents[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
  }

  //==========CREATING A NEW POST===================
  async createPost({ userId, title, location, caption, fileUrl }) {
    try {
      const newPost = await this.databases.createDocument(
        config.appwriteDatabaseID,
        config.appwritePostsCollectionID,
        ID.unique(),
        {
          userId,
          title,
          caption,
          location,
          fileUrl,
          uploadedAt: new Date().toISOString(),
        }
      );
      return newPost;
    } catch (error) {
      console.log("Error in createPost function! ", error);
    }
  }

  //=================DELETE SELECTED POST FROM DB===============
  async deletePost(postsDocId) {
    try {
      const newPost = await this.databases.deleteDocument(
        config.appwriteDatabaseID,
        config.appwritePostsCollectionID,
        postsDocId
      );
      return newPost;
    } catch (error) {
      console.log("Error in createPost function! ", error);
    }
  }

  //==========UPLOAD THE AVATARIMAGE TO THE STORAGE===========
  async uploadImage(file) {
    try {
      return await this.storage.createFile(
        config.appwriteBucketID,
        ID.unique(),
        file
      );
    } catch (error) {
      console.error("Error:: uploading file:", error);
    }
  }

  //============UPDATE THE AVATAR URL IN THE DB=================
  async updateAvatar({ documentId, fileUrl }) {
    try {
      if (!documentId || !fileUrl) {
        console.error("Missing documentId or avatarURL", {
          documentId,
          fileUrl,
        });
        return null;
      }

      const response = await this.databases.updateDocument(
        config.appwriteDatabaseID,
        config.appwriteUsersCollectionID,
        documentId,
        {
          avatarUrl: fileUrl,
        }
      );

      return response;
    } catch (error) {
      console.error("Appwrite updateAvatar error:", error);
      return null;
    }
  }

  //==========UPLOAD THE POST FILE TO THE "MEDIA" BUCKET===========
  async uploadPostImage(file) {
    try {
      return await this.storage.createFile(
        config.appwriteBucketID,
        ID.unique(),
        file
      );
    } catch (error) {
      console.error("Error:: uploading file:", error);
    }
  }

  //========EXTRACT AND PROVIDE THE IMAGE URL FOR DISPLAYING ON THE WEBSITE=======
  async getFilePreview(fileId) {
    try {
      return this.storage.getFileView(config.appwriteBucketID, fileId);
    } catch (error) {
      console.log("Error previewing", error);
      return null;
    }
  }

  //===========DELETE THE IMAGE FROM BUCKET===============
  async deleteImage(fileId) {
    try {
      await this.storage.deleteFile(
        config.appwriteBucketID,
        ID.unique(),
        fileId
      );
      return true;
    } catch (error) {
      console.error("Error:: uploading file:", error);
    }
  }

  //===========GETS THE POSTS OF USER BY USERID(FOR CREATING MULTIUSERS)===========
  async getPostsByUserId(userId) {
    try {
      return await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwritePostsCollectionID,
        [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
      );
    } catch (error) {
      console.error("Error fetching posts by user ID:", error);
      return [];
    }
  }

  //===========GETS THE DATA OF USER BY USERNAME(FOR CREATING MULTIUSERS)===========
  async getUserProfileByUsername(username) {
    try {
      return await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwriteUsersCollectionID,
        [Query.equal("username", username)]
      );
      0;
    } catch (error) {
      console.error("Error fetching user profile by username:", error);
      return null;
    }
  }
}

const api = new Services();
export default api;
export const { account, database, storage } = api;
