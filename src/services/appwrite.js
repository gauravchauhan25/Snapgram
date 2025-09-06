import {
  Client,
  Account,
  Databases,
  ID,
  Query,
  Avatars,
  Storage,
  Functions,
} from 'appwrite';
import config from './config.js';
import bcrypt from 'bcryptjs';

export class Services {
  client = new Client();
  account;
  databases;
  storage;
  avatars;
  functions;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectID);

    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
    this.avatars = new Avatars(this.client);
    this.functions = new Functions(this.client);
  }

  // Call Appwrite Function to send email
  async funcExecution(email, otp, name) {
    try {
      const payload = JSON.stringify({ email, otp, name }); // added username
      console.log('📤 Sending payload to Appwrite:', payload);

      const execution = await this.functions.createExecution(
        '68bc6ea9002eb52b00f0', // function ID
        payload, // payload
        false, // async
        '/', // path
        'POST' // method
      );

      console.log('Execution response:', execution);
      return execution;
    } catch (error) {
      console.log('Error in function execution', error);
    }
  }

  // Generate & store OTP
  async sendOtp(email, name) {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await bcrypt.hash(otp, 10);

      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

      await this.databases.createDocument(
        config.appwriteDatabaseID,
        config.appwriteOtpCollectionID,
        ID.unique(),
        { email, otp: hashedOtp, expiresAt, name }
      );

      // Call function to send email
      const response = await this.funcExecution(email, otp, name); // 👈 both must be passed

      if (response) {
        return true;
      }
      console.log('Error here!');
      return false;
    } catch (error) {
      console.log('Error sending OTP: ', error);
      return false;
    }
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
      console.log('Account creation failed: ', error);
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
          username: username.replace(/\s+/g, ''),
          name,
          email,
          phoneNumber,
          accountCreatedAt: new Date().toISOString(),
        }
      );

      console.log('Added to DB successfully!');
      return response;
    } catch (error) {
      console.error('Error :: adding user: !', JSON.stringify(error, null, 2));
      return null;
    }
  }

  //=============CHECKS FOR THE AVAILABILITY OF USERNAME====================
  async checkUsername(username) {
    try {
      const response = await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwriteUsersCollectionID,
        [Query.equal('username', username)]
      );

      if (response.documents.length === 0) {
        return false;
      }
      return true;
    } catch (error) {
      console.log('Error in checkUsername function: ', error);
    }
  }

  //==================LOGIN FOR USER=====================
  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.log('Error :: Logging In', error);
    }
  }

  //=============FOR GOOGLE OAUTH LOGIN====================
  async loginWithGoogle() {
    try {
      this.account.createOAuth2Session(
        'google',
        'https://snapgram-private.vercel.app/Home',
        'https://snapgram-private.vercel.app/sign-in'
      );
    } catch (error) {
      console.error('Error :: Google Login:', error);
    }
  }

  //===========LOGOUTS THE USER===============
  async logout() {
    try {
      return await this.account.deleteSessions('current');
    } catch (error) {
      console.log('Error :: logout', error);
    }
  }

  //=======GETS THE CURRENT ACCOUNT SESSION IF PRESENT==========
  async getAccount() {
    try {
      return await this.account.get();
    } catch (error) {
      // console.error("Error fetching account:", error);
      return null;
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
        [Query.equal('userId', currentAccount.$id)]
      );

      if (!currentUser || currentUser.documents.length === 0) return null;

      return currentUser.documents[0];
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  // ================SEARCH FOR THE USERS WITH USERNAME AS SEARCHED===================
  async searchUsers(value) {
    try {
      const usernameResults = await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwriteUsersCollectionID,
        [Query.startsWith('username', value)]
      );

      const nameResults = await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwriteUsersCollectionID,
        [Query.startsWith('name', value)]
      );

      const merged = [
        ...usernameResults.documents,
        ...nameResults.documents.filter(
          (doc) => !usernameResults.documents.some((u) => u.$id === doc.$id)
        ),
      ];

      return { documents: merged };
    } catch (error) {
      console.log('Error searching users by username:', error);
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
      console.log('Error updating password::', error);
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
        [Query.equal('userId', userId)]
      );

      if (response.documents.length === 0) {
        throw new Error('No matching user document found.');
      }

      return response.documents[0].$id;
    } catch (error) {
      console.error('Error fetching user document ID:', error);
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
      console.log('Error updating document: ', error);
    }
  }

  // ==============UPDATE USERNAME IN EVERY POSTS TILL NOW================
  async updateUsernameInPosts(username) {
    try {
      const currentUser = await this.getAccount();

      const posts = await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwritePostsCollectionID,
        [Query.equal('userId', currentUser.$id)]
      );

      for (const post of posts.documents) {
        await this.databases.updateDocument(
          config.appwriteDatabaseID,
          config.appwritePostsCollectionID,
          post.$id,
          {
            username: username,
          }
        );
      }
    } catch (error) {
      console.log('Error while updating username', error);
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
      console.log('Error updating post Count: ', error);
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
        [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
      );

      if (response.documents.length === 0) {
        console.log('No matching user posts found.');
      }

      return response.documents || [];
    } catch (error) {
      console.log('Error while getting document', error);
      return [];
    }
  }

  //=======GET THE POSTS OF ALL THE USERS IN THE DB AND SHOW THEM IN THE FEED=====
  async getPostsOfAllUsers() {
    try {
      const response = await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwritePostsCollectionID,
        [Query.orderDesc('$createdAt')]
      );

      if (response.documents.length === 0) {
        throw new Error('No matching posts found.');
      }

      return response.documents || [];
    } catch (error) {
      console.log('Error while getting document', error);
      return [];
    }
  }

  async getUserById(userId) {
    try {
      const response = await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwriteUsersCollectionID,
        [Query.equal('userId', userId)]
      );

      if (response.documents.length > 0) {
        return response.documents[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }

  //==========CREATING A NEW POST===================
  async createPost({
    userId,
    location,
    caption,
    fileUrl,
    username,
    avatarUrl,
    fileId,
    mimeType,
  }) {
    try {
      const newPost = await this.databases.createDocument(
        config.appwriteDatabaseID,
        config.appwritePostsCollectionID,
        ID.unique(),
        {
          userId,
          caption,
          location,
          fileUrl,
          username,
          avatarUrl,
          fileId,
          uploadedAt: new Date().toISOString(),
          mimeType,
        }
      );
      return newPost;
    } catch (error) {
      console.log('Error in createPost function! ', error);
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
      console.log('Error in createPost function! ', error);
    }
  }

  // =================EDIT THE POST IN THE DB=========================
  async editPost(documentId, location, caption) {
    try {
      const response = await this.databases.updateDocument(
        config.appwriteDatabaseID,
        config.appwritePostsCollectionID,
        documentId,
        {
          location: location,
          caption: caption,
        }
      );
      return response;
    } catch (error) {
      console.log('Error editpost: ', error);
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
      console.error('Error:: uploading file:', error);
    }
  }

  //============UPDATE THE AVATAR URL IN THE USERS COLLECTION=================
  async updateAvatar({ documentId, fileUrl }) {
    try {
      if (!documentId || !fileUrl) {
        console.error('Missing documentId or avatarURL', {
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
      console.error('Appwrite updateAvatar error:', error);
      return null;
    }
  }

  //============UPDATE THE AVATAR URL IN THE POSTS COLLECTION==================
  async updateAvatarInPosts(fileUrl) {
    try {
      const currentUser = await this.getAccount();

      const posts = await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwritePostsCollectionID,
        [Query.equal('userId', currentUser.$id)]
      );

      for (const post of posts.documents) {
        await this.databases.updateDocument(
          config.appwriteDatabaseID,
          config.appwritePostsCollectionID,
          post.$id,
          {
            avatarUrl: fileUrl,
          }
        );
      }
    } catch (error) {
      console.log('Error updating avatar in Posts collection', error);
    }
  }

  //============UPDATE THE AVATAR URL IN THE STORY COLLECTION==================
  async updateAvatarInStory(fileUrl) {
    try {
      const currentUser = await this.getAccount();

      const stories = await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwriteStoryCollectionID,
        [Query.equal('userId', currentUser.$id)]
      );

      for (const story of stories.documents) {
        await this.databases.updateDocument(
          config.appwriteDatabaseID,
          config.appwriteStoryCollectionID,
          story.$id,
          {
            avatarUrl: fileUrl,
          }
        );
      }
    } catch (error) {
      console.log('Error updating avatar in Posts collection', error);
    }
  }

  //==========UPLOAD THE FILE TO THE "MEDIA" BUCKET===========
  async uploadFile(file) {
    try {
      return await this.storage.createFile(
        config.appwriteBucketID,
        ID.unique(),
        file
      );
    } catch (error) {
      console.error('Error:: uploading file:', error);
    }
  }

  //========EXTRACT AND PROVIDE THE IMAGE URL FOR DISPLAYING ON THE WEBSITE=======
  async getFilePreview(fileId) {
    try {
      return this.storage.getFileView(config.appwriteBucketID, fileId);
    } catch (error) {
      console.log('Error previewing', error);
      return null;
    }
  }

  //===========DELETE THE FILE FROM BUCKET===============
  async deleteFile(fileId) {
    try {
      if (!fileId) throw new Error('deleteFile: fileId is missing/undefined');
      await this.storage.deleteFile(config.appwriteBucketID, fileId);
      return true;
    } catch (err) {
      console.error('Error:: deleting file:', err);
      return false; // return a boolean so callers can handle UI state
    }
  }

  //===========GETS THE POSTS OF USER BY USERID(FOR CREATING MULTIUSERS)===========
  async getPostsByUserId(userId) {
    try {
      return await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwritePostsCollectionID,
        [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
      );
    } catch (error) {
      console.error('Error fetching posts by user ID:', error);
      return [];
    }
  }

  //===========GETS THE DATA OF USER BY USERNAME(FOR CREATING MULTIUSERS)===========
  async getUserProfileByUsername(username) {
    try {
      return await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwriteUsersCollectionID,
        [Query.equal('username', username)]
      );
      0;
    } catch (error) {
      console.error('Error fetching user profile by username:', error);
      return null;
    }
  }

  //===========ADDS A NEW STORY TO DB===============
  async addStory(userId, name, username, avatarUrl, fileUrl, fileId, mimeType) {
    try {
      const response = await this.databases.createDocument(
        config.appwriteDatabaseID,
        config.appwriteStoryCollectionID,
        ID.unique(),
        {
          userId,
          username,
          name,
          avatarUrl,
          fileUrl,
          fileId,
          createdAt: new Date().toISOString(),
          mimeType,
        }
      );
      return response;
    } catch (error) {
      console.log('Error adding Story: ', error);
    }
  }

  //================DELETES THE STORY FROM DB====================
  async deleteStory(documentId) {
    try {
      const response = await this.databases.deleteDocument(
        config.appwriteDatabaseID,
        config.appwriteStoryCollectionID,
        documentId
      );
      return response;
    } catch (error) {
      console.log('Error deleting story: ', error);
    }
  }

  //===========FETCH ALL THE DOCUMENTS OR STORIES FROM DB==============
  async fetchUserStory() {
    try {
      const account = await this.getAccount();
      const userId = account.$id;
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const response = await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwriteStoryCollectionID,
        [
          Query.greaterThan('$createdAt', since),
          Query.orderAsc('$createdAt'),
          Query.notEqual('userId', userId),
        ]
      );

      return response?.documents ?? [];
    } catch (error) {
      console.log('Error fetching story: ', error);
      return [];
    }
  }

  //===========FETCH ALL THE DOCUMENTS OR STORIES FROM DB FOR THE LOGGED IN USERS ONLY==============
  async checkMyStory() {
    try {
      const id = await this.getAccount();
      const userId = id.$id;

      const response = await this.databases.listDocuments(
        config.appwriteDatabaseID,
        config.appwriteStoryCollectionID,
        [Query.equal('userId', userId), Query.orderAsc('$createdAt')]
      );

      return response;
    } catch (error) {
      console.log('Error fetching my story: ', error);
      return null;
    }
  }

  //=================SEND MESSAGE TO CONTACT SUPPORT=========================
  async contactSupport(name, email, message) {
    try {
      const response = await this.databases.createDocument(
        config.appwriteDatabaseID,
        config.appwriteContactsCollectionID,
        ID.unique(),
        {
          name: name,
          email: email,
          message: message,
        }
      );
      return response;
    } catch (error) {
      console.log('Error sending message', error);
      return null;
    }
  }

  //====================REPORT BUG TO TEAM============================
  async reportBugs(name, email, bug) {
    try {
      const response = await this.databases.createDocument(
        config.appwriteDatabaseID,
        config.appwriteReportBugsCollectionID,
        ID.unique(),
        {
          name: name,
          email: email,
          bug: bug,
        }
      );
      return response;
    } catch (error) {
      console.log('Error reporting bug:', error);
      return null;
    }
  }

  //=====================REQUEST FOR A NEW FEATURE========================
  async requestFeature(name, email, feature) {
    try {
      const response = await this.databases.createDocument(
        config.appwriteDatabaseID,
        config.appwriteRequestFeatureCollectionID,
        ID.unique(),
        {
          name: name,
          email: email,
          feature: feature,
        }
      );
      return response;
    } catch (error) {
      console.log('Error requesting feature:', error);
      return null;
    }
  }
}

const api = new Services();
export default api;
export const { account, database, storage } = api;
