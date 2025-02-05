import { Client, Account, Databases, ID } from "appwrite";

// const config = {
//   appwriteUrl: "https://cloud.appwrite.io/v1",
//   appwriteProjectID: "67864fab003947d4618c",
// };

export class authService {
  client = new Client();
  account;
  database;

  constructor() {
    this.client
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject("67864fab003947d4618c");
    this.account = new Account(this.client);
    this.database = new Databases(this.client);
    // console.log(config.appwriteProjectID);
    // console.log(config.appwriteUrl);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      return userAccount;
    } catch (error) {
      console.error("Error creating account:", error.message);
      throw error;
    }
  }
  async login({ email, password, navigate }) {
    try {
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );
      console.log(session);
      return session;
    } catch (error) {
      console.error("Error logging in:", error.message);
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
      // console.error("Error logging out:", error.message);
      return false;
    }
  }
}

const auth = new authService();
export default auth;
