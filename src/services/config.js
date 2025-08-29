const config = {
    appwriteUrl: String(import.meta.env.VITE_REACT_APP_APPWRITE_URL),
    appwriteProjectID: String(import.meta.env.VITE_REACT_APP_APPWRITE_PROJECT_ID),
    appwriteDatabaseID: String(import.meta.env.VITE_REACT_APP_APPWRITE_DATABASE_ID),
    appwriteUsersCollectionID: String(import.meta.env.VITE_REACT_APP_APPWRITE_USERS_COLLECTION_ID),
    appwritePostsCollectionID: String(import.meta.env.VITE_REACT_APP_APPWRITE_POSTS_COLLECTION_ID),
    appwriteStoryCollectionID: String(import.meta.env.VITE_REACT_APP_APPWRITE_STORIES_COLLECTION_ID),
    appwriteBucketID: String(import.meta.env.VITE_REACT_APP_APPWRITE_BUCKET_ID),
    smtpHost: String(import.meta.env.SMTP_HOST),
    smtpPort: String(import.meta.env.SMTP_PORT),
    smtpUser: String(import.meta.env.SMTP_USER),
    smtpPass: String(import.meta.env.SMTP_PASS),
    smtpEmail: String(import.meta.env.FROM_EMAIL),
    smtpFromName: String(import.meta.env.FROM_NAME),
}

export default config;