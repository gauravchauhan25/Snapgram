import { Client, Account, Databases, ID, Query } from "appwrite";

export class Services {
  client = new Client();
  account;
  databases;
  storage;

  constructor() {
    this.client
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject("67864fab003947d4618c");

    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      return await this.account.create(ID.unique(), email, password, name);
    } catch (error) {
      console.error("Error creating account:", error.message);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );
      console.log(session);
      return session;
    } catch (error) {
      alert("Error logging in:", error.message);
      throw error;
    }
  }

  async isLoggedIn() {
    try {
      const session = await this.account.get();
      return !!session;
    } catch (error) {
      console.log("Appwrite service :: currentUser :: error", error.message);
      return false;
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
      console.log("Logged out successfully.");
      return true;
    } catch (error) {
      alert("Error logging out:", error.message);
      return false;
    }
  }

  async loginWithGoogle() {
    try {
      this.account.createOAuth2Session(
        "google",
        "https://yhxj28-3000.csb.app/Home",
        "https://yhxj28-3000.csb.app/sign-in"
      );
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  }

  async addUser(userData) {
    try {
      const user = await account.get();
      const userId = user.$id;

      const response = await this.databases.createDocument(
        "6787eaef00269d8615ae",
        "679a66480030b6502b44",
        ID.unique(),
        {
          userId: userId,
          username: userData.username,
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          dob: userData.dob,
          accountCreatedAt: new Date().toISOString(),
        }
      );
      console.log("User added successfully:", response);
      return response;
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const response = await this.databases.listDocuments(
        "6787eaef00269d8615ae",
        "679a66480030b6502b44",
        [Query.equal("email", email)]
      );

      return response.documents.length > 0 ? response.documents[0] : null;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }

  async createPost({ title, location, caption }) {
    try {
      const databaseID = "6787eaef00269d8615ae";
      const collectionID = "679a67910018bef5cd9e";

      const newPost = await this.databases.createDocument(
        databaseID,
        collectionID,
        ID.unique(),
        {
          title,
          caption,
          location,
        }
      );

      console.log("Post created successfully:", newPost);
      return newPost;
    } catch (error) {
      console.log(error);
    }
  }
}

const appwrite = new Services();
export default appwrite;
export const { account, database, storage } = appwrite;

// async uploadFile(bucketId, file) {
//   try {
//     const response = await this.storage.createFile(
//       bucketId,
//       ID.unique(),
//       file
//     );
//     return response;
//   } catch (error) {
//     console.error("Error uploading file:", error.message);
//     throw error;
//   }
// }

// async getFileViewUrl(bucketId, fileId) {
//   return `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=67864fab003947d4618c`;
// }

// async deleteFile(bucketId, fileId) {
//   try {
//     await this.storage.deleteFile(bucketId, fileId);
//     console.log("File deleted successfully.");
//     return true;
//   } catch (error) {
//     console.error("Error deleting file:", error.message);
//     return false;
//   }
// }
