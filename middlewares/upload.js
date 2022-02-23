const multer = require('multer');
const CreateError = require("http-errors");
const path = require('path');

const tempDir = path.join(__dirname, "../", "temp");

const multerConfig = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cd) => {
        if(file.mimetype.includes('image'))
        {
            cd(null, file.originalname);
        } else {
            cd(new CreateError(400, 'This file can not be uploaded'));
        }
    },
    limits: {
        fileSize: 100
    }
});

const upload = multer({
    storage: multerConfig
});

module.exports = upload;