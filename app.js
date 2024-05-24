
const express = require("express");
const path = require("path");
const { google } = require("googleapis");
const fs = require("fs");
const chokidar = require("chokidar");
const { exec } = require("child_process");

const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the HTML file for the file upload form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Endpoint to handle Google Drive link input
app.post("/upload", (req, res) => {
  const driveLink = req.body.driveLink;
  
  if (!driveLink) {
    return res.status(400).send("Google Drive link is required.");
  }

  const KEYFILE_PATH = path.join(__dirname, 'cred.json');
  const SCOPES = ["https://www.googleapis.com/auth/drive"];

  // Extract Google Drive folder ID from the provided link
  const folderIdMatch = driveLink.match(/[-\w]{25,}/);
  if (!folderIdMatch) {
    return res.status(400).send("Invalid Google Drive link.");
  }

  const PARENT_FOLDER_ID = folderIdMatch[0];

  // Update Google Drive API client with the credentials file
  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILE_PATH,
    scopes: SCOPES,
  });

  const drive = google.drive({ version: "v3", auth });

  res.send(
    `Google Drive link processed successfully;<br>
    PARENT_FOLDER_ID is now: ${PARENT_FOLDER_ID}`
  );

  console.log(`Google Drive folder ID set to: ${PARENT_FOLDER_ID}`);

  // Specify the local folder to monitor
  const watchFolder = path.join(__dirname, "../");

  // Function to log errors
  const logError = (message, response = null) => {
    console.error(`Error: ${message}`);
    if (response) {
      console.error(`HTTP response: ${response}`);
    }
  };

  // Function to upload files to Google Drive
  const uploadFileToDrive = async (filePath) => {
    try {
      const fileName = path.basename(filePath);

      // Create a file stream
      const fileStream = fs.createReadStream(filePath);

      // Upload file to Google Drive
      const response = await drive.files.create({
        requestBody: {
          name: fileName,
          parents: [PARENT_FOLDER_ID],
        },
        media: {
          mimeType: "image/jpeg", // Set the appropriate MIME type for your files
          body: fileStream,
        },
        fields: "id,name",
      });

      console.log(
        `Uploaded file: ${response.data.name} (ID: ${response.data.id})`
      );
    } catch (error) {
      logError(
        `Failed to upload file ${filePath}: ${error.message}`,
        error.response ? error.response.data : null
      );
    }
  };

  // Watch for added files in the specified folder
  const watcher = chokidar.watch(watchFolder, {
    persistent: true,
    ignored: /(^|[\/\\])\../, // Ignore dotfiles
    ignoreInitial: true, // Ignore initial files
    interval: 100,
    usePolling: false,
  });

  // Watch for added files
  watcher.on("add", (filePath) => {
    console.log(`Detected new file: ${filePath}`);
    uploadFileToDrive(filePath);
  });
});

const PORT = 5050;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  exec("start http://localhost:5050");
});
