import { Client, Account, Databases, Storage, ID } from "appwrite";

export class authService {
  client = new Client();
  account;
  database;
  storage;

  constructor() {
    this.client
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject("67864fab003947d4618c");
    this.account = new Account(this.client);
    this.database = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      await this.login({ email, password });
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
      console.log("Login successful:", session);
      if (navigate) navigate("/"); // Redirect to home page after login
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

  async logout(navigate) {
    try {
      const session = await this.account.get();
      if (session) {
        await this.account.deleteSessions();
        console.log("Logged out successfully.");
        if (navigate) navigate("/sign-in");
      } else {
        console.log("No active session to log out.");
        if (navigate) navigate("/sign-in");
      }
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }
}

const auth = new authService();
export default auth;
