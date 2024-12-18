const multer = require('multer');
const fs = require('fs');
const path = require('path');
// const AVATAR_PATH =path.join('/uploadY/avatars');
const AVATAR_PATH = path.join(__dirname, '..', 'uploadY', 'avatars');
console.log("AVATAR_PATH:", AVATAR_PATH);

if (!fs.existsSync(AVATAR_PATH)) {
  
    fs.mkdirSync(AVATAR_PATH, { recursive: true });
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, AVATAR_PATH)

    },
    filename: function (req, file, cb) {
        // Set the file name to be unique
        cb(null, Date.now() + '-' + file.originalname);
    }
})
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG, and GIF are allowed.'), false);
    }
};



const upload = multer({
    storage: storage   
})

// const upload = multer({ dest: 'uploads/' })
module.exports=upload;
