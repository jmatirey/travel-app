const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, next) {
        next(null, './public/uploads/');
    },
    filename: function(req, file, next) {
        next(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
})

const upload = multer({ storage: storage });
module.exports = upload;