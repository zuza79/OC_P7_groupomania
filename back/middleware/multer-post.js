const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images/posts')
    },
    filename: (req, file, callback) => {
        console.log("consol log multer file : " + file)
        const name = file.originalname.split(' ').join('_');  
        //const name = file.originalname.replace(/\.[^/.]+$/, "")
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage: storage }).single('image');