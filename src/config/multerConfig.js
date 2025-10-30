// // in case of local
// const multer = require('multer');
// const storage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,'uploads')
//     },
//     filename : (req,file,cb)=>{
//         cb(null, Date.now() + "_" + file.originalname)
//     }
// });


// //middleware
// const upload = multer({storage});

// module.exports= upload;

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'furniture', 
    allowed_formats: ['jpg', 'png'],
  },
});

const upload = multer({ storage });

module.exports = upload;

