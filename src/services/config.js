const config = {
    appwriteUrl: String(process.env.REACT_APP_APPWRITE_URL),
    appwriteProjectID: String(process.env.REACT_APP_APPWRITE_PROJECT_ID),
    appwriteDatabaseID: String(process.env.REACT_APP_APPWRITE_DATABASE_ID),
    appwriteCollectionID: String(process.env.REACT_APP_APPWRITE_COLLECTION_ID),
    appwriteBucketID: String(process.env.REACT_APP_APPWRITE_COLLECTION_ID),
}

export default config;