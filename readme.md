# Automatic Image Upload to Google Drive

This Node.js application watches a specific folder on your local system and automatically uploads any new images to a specified folder on your Google Drive account. It uses the `chokidar` library to monitor the folder for changes and `Google Drive API` for cloud interaction.

## Index

- [Setup](#setup)
- [Execution](#execution)
- [Google Drive Permissions](#google-drive-permissions)
- [References](#references)

## Setup

1. **Folder to Watch**: Specify the folder you want the application to watch. This folder will be monitored for new images to upload.
   
2. **Google Drive Folder ID**: Create a public google drive folder which has edit access and copy the folder link. 

5. **Credentials**: Obtain and add your own `cred.json` file in the project directory. This file contains OAuth 2.0 credentials to interact with Google Drive.

6. **Error Logging**: Error logging functionality is included to log and display any errors during the upload process.

### Obtaining Google Cloud Credentials

1. Go to the [Google Cloud Console](https://cloud.google.com/).
2. Enable the [Google Drive API](https://console.cloud.google.com/apis/library/drive.googleapis.com).
3. Create a service account and generate a `cred.json` file.
4. Save the `cred.json` file in your project directory.
5. Watch the video reference given below to create the `cred.json` file. 

## Google Drive Permissions

1. **Manage Folder Permissions**:
    - Allow anyone can access permission to the google driver folder. 
  
2. **IAM and Admin Permissions**:
    - Go to the IAM and Admin section.
    - Add the service account with appropriate permissions to your requested users.
    - Watch the video reference to know about the permissions.

For more detailed guidance on permissions and settings, follow the reference video pinned below.

## Execution

1. **Install Node.js**: Make sure Node.js is installed on your system.

2. **Install Dependencies**:
    - Navigate to the project directory and run:
        ```shell
        npm install
        ```

3. **Run the Application**:
    - Start the application:
        ```shell
        nodemon app
        ```

After execution, the application will start monitoring the specified folder and uploading new files to the cloud.

## References

- [Video Tutorial](https://www.youtube.com/watch?v=jaNo14iQdxk)
