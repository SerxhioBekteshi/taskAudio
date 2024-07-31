import axios from "axios";
import multer from "multer";
import { AppError } from "../utils/appError";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/audio");
  },

  filename: function (req: any, file: any, cb: any) {
    req.fileType = file.mimetype.split("/")[1];
    cb(null, `audio-${Date.now()}.${req.fileType}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("audio")) {
    cb(null, true);
  } else {
    cb(
      new AppError("ot an audio file! Please upload only audio files."),
      false
    );
  }
};

// Multer upload setup
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// });

const upload = multer();

const uploadAudio = async (req: any, res: any, next: any) => {
  // i can also use catch Async as wrapper to catch errors in the utils folder
  const encodedFile = req.file;
  console.log(encodedFile, "HERE>");

  if (!encodedFile) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // const filePath = path.join(__dirname, 'public/audio', encodedFile.filename);
    // Forward the encoded file to Backend 2 (Python)
    // const response = await axios.post(
    //   "http://localhost:5000/upload",
    //   encodedFile,
    //   {
    //     headers: {
    //       "Content-Type": "application/octet-stream",
    //     },
    //   }
    // );
    // res.json({
    //   message: "File forwarded to Backend 2",
    //   response: response.data,
    // });
  } catch (error) {
    console.error("Error forwarding file:", error);
    res.status(500).json({ message: "Error forwarding file" });
  }
};

export default {
  uploadAudio,
  upload,
};
