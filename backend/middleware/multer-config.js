const multer = require('multer');

// Dictionary of image extensions
const MIME_TYPE = { 
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

/**
 * Give the image destination
 * Give the picture a new name to avoid duplicates
 */
const storage = multer.diskStorage({
    destination: (req, file, callback) => { 
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const extension = MIME_TYPE[file.mimetype];
        callback(null, Date.now() + '.' + extension);
    }
});
module.exports = multer({ storage }).single('image'); 