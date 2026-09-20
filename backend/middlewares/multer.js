import multer from "multer"

const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"./public")
  },
  filename:(req,file,cb)=>{
    // Sanitize filename: replace spaces with underscores and append a timestamp
    const sanitized = file.originalname.replace(/[\s()]+/g, "_");
    cb(null, Date.now() + "_" + sanitized)
  }
})
export const upload = multer({storage});