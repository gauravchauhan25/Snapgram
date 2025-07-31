const config = {
    appwriteUrl: String(import.meta.env.VITE_REACT_APP_APPWRITE_URL),
    appwriteProjectID: String(import.meta.env.VITE_REACT_APP_APPWRITE_PROJECT_ID),
    appwriteDatabaseID: String(import.meta.env.VITE_REACT_APP_APPWRITE_DATABASE_ID),
    appwriteUsersCollectionID: String(import.meta.env.VITE_REACT_APP_APPWRITE_USERS_COLLECTION_ID),
    appwritePostsCollectionID: String(import.meta.env.VITE_REACT_APP_APPWRITE_POSTS_COLLECTION_ID),
    appwriteBucketID: String(import.meta.env.VITE_REACT_APP_APPWRITE_BUCKET_ID),
}

export default config;