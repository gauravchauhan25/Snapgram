import { Client, Account, Databases, ID, Query, Avatars } from "appwrite";

const appwriteConfig = {
  url: "https://cloud.appwrite.io/v1",
  projectId: "67864fab003947d4618c",
  userCollectionId: "679a66480030b6502b44",
  databaseID: "6787eaef00269d8615ae",
};

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
    this.avatars = new Avatars(this.client);
  }

  async createAccount({ email, password, name, username, phoneNumber }) {
    try {
      const newAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (!newAccount) throw new Error("Account creation failed");

      // const avatarUrl = this.avatars.getInitials(user.name);

      const newUser = await this.addUser( name, email, username, phoneNumber);

      return newUser;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async addUser(name, email, username, phoneNumber) {
    try {
        const userData = { name, email, username, phoneNumber };

        const accountId = ID.unique();
        const response = await this.databases.createDocument(
            "6787eaef00269d8615ae", 
            "679a66480030b6502b44",
            accountId, 
            {
                accountId: accountId, 
                username: userData.username,
                name: userData.name,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                accountCreatedAt: new Date().toISOString(),
            }
        );

        console.log("Added to DB successfully!");
        return response;
    } catch (error) {
        console.log("Error adding to DB!",error);
        throw error;
    }
}

  async login({ email, password }) {
    try {
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );
      return session;
    } catch (error) {
      console.log(error);
    }
  }

  async getAccount() {
    try {
      return await this.account.get();
    } catch (error) {
      console.error("Error fetching account:", error);
      return null;
    }
  }

  async getCurrentUser() {
    try {
      const currentAccount = await this.getAccount();
      if (!currentAccount) return null;

      const currentUser = await this.databases.listDocuments(
        "6787eaef00269d8615ae",
        "679a66480030b6502b44",
        [Query.equal("accountId", currentAccount.$id)]
      );

      if (!currentUser || currentUser.documents.length === 0) return null;

      return currentUser.documents[0];
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  }

  async logout() {
    try {
      const session = await this.account.deleteSession("current");
      return session;
    } catch (error) {
      console.log(error);
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

const api = new Services();
export default api;
export const { account, database, storage } = api;
