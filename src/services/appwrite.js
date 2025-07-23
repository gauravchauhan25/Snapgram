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
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject("67864fab003947d4618c");

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

      if (!newAccount) throw new Error("Account creation failed");

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
      console.log(error);
      return error;
    }
  }

  //===========ADD USER TO DB=============
  async addUser(userId, name, email, username, phoneNumber) {
    try {
      const response = await this.databases.createDocument(
        "6787eaef00269d8615ae",
        "679a66480030b6502b44",
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
      console.error("Error :: adding to DB!", JSON.stringify(error, null, 2));
      throw error;
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
      console.error("Google Login Error:", error);
    }
  }

  //===========LOGOUT THE USER===============
  async logout() {
    try {
      return await this.account.deleteSessions("current");
    } catch (error) {
      console.log(error);
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
        "6787eaef00269d8615ae",
        "679a66480030b6502b44",
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
        "6787eaef00269d8615ae",
        "679a66480030b6502b44",
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

  async getPosts() {
    try {
      const currentUser = await this.account.get();
      const userId = currentUser.$id;

      const response = await this.databases.listDocuments(
        "6787eaef00269d8615ae",
        "679a67910018bef5cd9e",
        [Query.equal("userId", userId)]
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

  //==========UPLOAD THE AVATARIMAGE TO THE BUCKET===========
  async uploadImage(file) {
    try {
      return await this.storage.createFile(
        "678e84c3003d7bf76e6e",
        ID.unique(),
        file
      );
    } catch (error) {
      console.error("Error:: uploading file:", error);
    }
  }

  //=========EDIT PROFILE==============
  async updateProfile({ documentId, name, username, bio }) {
    try {
      const response = await this.databases.updateDocument(
        "6787eaef00269d8615ae",
        "679a66480030b6502b44",
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
        "6787eaef00269d8615ae",
        "679a66480030b6502b44",
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
        "6787eaef00269d8615ae",
        "679a67910018bef5cd9e", //change the collectionId to posts not users in DB
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

  //==========UPLOAD THE POSTIMAGE TO THE "POSTSMEDIA" BUCKET===========
  async uploadPostImage(file) {
    try {
      return await this.storage.createFile(
        "678e84c3003d7bf76e6e", //change the bucket Id for posts
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
      return this.storage.getFileView("678e84c3003d7bf76e6e", fileId);
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

  //=====CHECKING TOTAL NUMBER OF INPUTS IN THE COLLECTION(OR ATTRIBUTES)======
  async getDocumentCount() {
    try {
      const response = await this.databases.listDocuments(
        "679a67910018bef5cd9e"
      );
      const totalCount = response.total;
      console.log(`Total number of documents: ${totalCount}`);
    } catch (error) {
      console.error("Error :: fetching document count:", error);
    }
  }

  //======STORYING FILE RELATED INFO INTO DB========
  async storeFileInfo(fileId) {
    try {
      const document = await database.createDocument("679a67910018bef5cd9e", {
        fileId: fileId,
        fileName: "image.jpg",
        uploadedAt: new Date().toISOString(),
      });
      console.log("File metadata stored:", document);
    } catch (error) {
      console.error("Error :: storing file info:", error);
    }
  }
}

const api = new Services();
export default api;
export const { account, database, storage } = api;
