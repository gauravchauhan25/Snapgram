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

// const appwriteConfig = {
//   url: "https://cloud.appwrite.io/v1",
//   projectId: "67864fab003947d4618c",
//   userCollectionId: "679a66480030b6502b44",
//   databaseID: "6787eaef00269d8615ae",
// };

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

  //=======CREATE AN ACCOUNT============
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

      // Use the Appwrite Auth user ID
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

  //========LOGIN FOR USER==========
  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.log("Error :: Logging In", error);
    }
  }

  async loginWithGoogle() {
    try {
      this.account.createOAuth2Session(
        "google",
        "https://77q2rz-3000.csb.app/Home",
        "https://77q2rz-3000.csb.app/sign-in"
      );
    } catch (error) {
      console.error("Error :: Google Login:", error);
    }
  }

  //===========LOGOUT THE USER===============
  async logout() {
    try {
      return await this.account.deleteSessions("current");
    } catch (error) {
      console.log("Error :: logout", error);
    }
  }

  //=====CHECK CURRENT ACCOUNT SESSION PRESENT OR NOT=======
  async getAccount() {
    try {
      return await this.account.get();
    } catch (error) {
      console.error("Error fetching account:", error);
    }
    return null;
  }

  //=====CHECK FOR THE CURRENT USER ACCOUNT=========
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

  //==========UPLOAD THE AVATARIMAGE TO THE BUCKET===========
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

  //=========EDIT PROFILE==============
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

  //==========UPLOAD THE POSTIMAGE TO THE "POSTSMEDIA" BUCKET===========
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

  //=======DELETE THE IMAGE FROM BUCKET============
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

  //CHANGES THE PASSWORD
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

  async getUserProfileByUsername(username) {
    try {
      return await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwriteUsersCollectionID,
        [Query.equal("username", username)]
      );
0    } catch (error) {
      console.error("Error fetching user profile by username:", error);
      return null;  
    }
  }
}

const api = new Services();
export default api;
export const { account, database, storage } = api;
