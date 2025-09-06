const config = {
    appwriteUrl: String(import.meta.env.VITE_REACT_APP_APPWRITE_URL),
    appwriteProjectID: String(import.meta.env.VITE_REACT_APP_APPWRITE_PROJECT_ID),
    appwriteDatabaseID: String(import.meta.env.VITE_REACT_APP_APPWRITE_DATABASE_ID),
    appwriteUsersCollectionID: String(import.meta.env.VITE_REACT_APP_APPWRITE_USERS_COLLECTION_ID),
    appwritePostsCollectionID: String(import.meta.env.VITE_REACT_APP_APPWRITE_POSTS_COLLECTION_ID),
    appwriteStoryCollectionID: String(import.meta.env.VITE_REACT_APP_APPWRITE_STORIES_COLLECTION_ID),
    appwriteOtpCollectionID: String(import.meta.env.VITE_REACT_APP_APPWRITE_OTPS_COLLECTION_ID),
    appwriteBucketID: String(import.meta.env.VITE_REACT_APP_APPWRITE_BUCKET_ID),

    appwriteContactsCollectionID: String(import.meta.env.VITE_REACT_APP_APPWRITE_CONTACT_SUPPORT_COLLECTION_ID),
    appwriteRequestFeatureCollectionID: String(import.meta.env.VITE_REACT_APP_APPWRITE_FEATURE_REQUEST_COLLECTION_ID),
    appwriteReportBugsCollectionID: String(import.meta.env.VITE_REACT_APP_APPWRITE_REPORT_BUGS_COLLECTION_ID),
}

export default config;